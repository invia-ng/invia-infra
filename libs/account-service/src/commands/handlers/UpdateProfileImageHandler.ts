import {
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProfileImageCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Subscription } from '@app/common/src/models/subscription.model';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';
import { UserNotFoundException } from '@app/common/src/constants/exceptions';

@CommandHandler(UpdateProfileImageCommand)
export class UpdateProfileImageHandler
  implements ICommandHandler<UpdateProfileImageCommand, AccountInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) { }

  async execute(command: UpdateProfileImageCommand) {
    try {
      this.logger.log(`[UPDATE-ACCOUNT-PROFILE-PHOTO-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const account = await this.accountRepository.findOne({
        where: {
          id: secureUser.id,
        },
      });

      if (!account) {
        throw UserNotFoundException();
      }

      Object.assign(account, {
        avatar: payload.imageUrl,
      });

      await this.accountRepository.save(account);

      const subscription = await this.subscriptionRepository.findOne({
        where: {
          isExpired: false,
          business: {
            account: {
              id: account.id
            }
          }
        }
      });

      this.logger.log(`[UPDATE-ACCOUNT-PROFILE-PHOTO-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatAccountInfo(account, subscription);
    } catch (error) {
      this.logger.log(
        `[UPDATE-ACCOUNT-PROFILE-PHOTO-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
