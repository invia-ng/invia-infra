import { Repository } from 'typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../services/auth.service';
import { InitializeBusinessProfileCommand } from '../impl';
import { AccountStatus } from '@app/common/src/constants/enums';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';

@CommandHandler(InitializeBusinessProfileCommand)
export class InitializeBusinessProfileHandler
  implements ICommandHandler<InitializeBusinessProfileCommand, AccountInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async execute(command: InitializeBusinessProfileCommand) {
    try {
      this.logger.log(`[INITIALIZE-ACCOUNT-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const account = await this.accountRepository.findOne({
        where: {
          id: secureUser.id,
        },
      });

      if(!account){
        throw new NotFoundException('Account not found');
      }

      const instance = await this.businessRepository.create({
        account,
        name: payload.businessName,
        avatar: payload.businessAvatar
      })

      const business = await this.businessRepository.save(instance);

      Object.assign(account, {
        status: AccountStatus.ACTIVE,
        isBusinessProfileUpdated: true,
      });

      await this.accountRepository.save(account);

      this.logger.log(`[INITIALIZE-ACCOUNT-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatAccountInfo(account);
    } catch (error) {
      this.logger.log(`[INITIALIZE-ACCOUNT-HANDLER-ERROR] :: ${error}`);
      console.log(error);

      throw error;
    }
  }
}
