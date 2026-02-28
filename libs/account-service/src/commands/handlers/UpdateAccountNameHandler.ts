import {
  Inject,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAccountNameCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';
import { Subscription } from '@app/common/src/models/subscription.model';

@CommandHandler(UpdateAccountNameCommand)
export class UpdateAccountNameHandler
  implements ICommandHandler<UpdateAccountNameCommand, AccountInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) { }

  async execute(command: UpdateAccountNameCommand) {
    try {
      this.logger.log(`[UPDATE-ACCOUNT-NAME-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const account = await this.accountRepository.findOne({
        where: {
          id: secureUser.id,
        },
      });

      if (!account) {
        throw new UnauthorizedException('Account not found.');
      }

      Object.assign(account, {
        name: payload.name,
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

      this.logger.log(`[UPDATE-ACCOUNT-NAME-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatAccountInfo(account, subscription);
    } catch (error) {
      this.logger.log(`[UPDATE-ACCOUNT-NAME-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
