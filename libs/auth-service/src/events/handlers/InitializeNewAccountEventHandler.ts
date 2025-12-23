import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { InitializeNewAccountEvent } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../services/auth.service';
import { Account } from '@app/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Notification } from '@app/common/src/models/notification.model';
import { AuthEmailNotificationService } from '@app/notification-service/src/services/email/auth.email.notification.service';

@EventsHandler(InitializeNewAccountEvent)
export class InitializeNewAccountEventHandler
  implements IEventHandler<InitializeNewAccountEvent>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    private readonly authService: AuthService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly authEmailNotificationService: AuthEmailNotificationService,
  ) {}

  async handle(event: InitializeNewAccountEvent) {
    try {
      this.logger.log(
        `[INITIALIZE-NEW-ACCOUNT-EVENT-HANDLER-PROCESSING]: ${JSON.stringify(event)}`,
      );

      const { account, payload } = event;

      this.authEmailNotificationService.newAccountNotifications(account);

      this.logger.log(`[INITIALIZE-NEW-ACCOUNT-EVENT-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[INITIALIZE-NEW-ACCOUNT-EVENT-HANDLER]: ${error}`);

      throw error;
    }
  }
}
