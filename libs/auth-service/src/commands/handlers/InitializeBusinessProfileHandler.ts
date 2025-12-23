import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../services/auth.service';
import { InitializeBusinessProfileCommand } from '../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';
import { AuthEmailNotificationService } from 'libs/notification-service/src/services/email/auth.email.notification.service';

@CommandHandler(InitializeBusinessProfileCommand)
export class InitializeBusinessProfileHandler
  implements ICommandHandler<InitializeBusinessProfileCommand, AccountInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
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
        throw new Error('Account not found');
      }

      Object.assign(account, {
        businessName: payload.businessName,
        businessAvatar: payload.businessAvatar,
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
