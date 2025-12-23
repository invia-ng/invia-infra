import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { CreateAccountEvent } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../services/auth.service';
import { Account } from '@app/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Notification } from '@app/common/src/models/notification.model';
import { NotificationType, UserRole } from '@app/common/src/constants/enums';
import { AuthEmailNotificationService } from '@app/notification-service/src/services/email/auth.email.notification.service';

@EventsHandler(CreateAccountEvent)
export class CreateAccountEventHandler
  implements IEventHandler<CreateAccountEvent>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    private readonly authService: AuthService,
    @InjectRepository(Account)
    private readonly userRepository: Repository<Account>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly authEmailNotificationService: AuthEmailNotificationService,
  ) {}

  async handle(event: CreateAccountEvent) {
    try {
      this.logger.log(
        `[CREATE-ACCOUNT-EVENT-HANDLER-PROCESSING]: ${JSON.stringify(event)}`,
      );

      const { account, payload } = event;

      await this.notificationRepository.save({
        title: '👋 Welcome to Invia',
        message: `We’re thrilled to have you on board. Invia is here to help you manage your planned events. Explore now and see what’s waiting for you!`,
        notificationType: NotificationType.MESSAGE,
        user: account,
      });

      this.authEmailNotificationService.newAccountNotifications(account);

      this.logger.log(`[CREATE-ACCOUNT-EVENT-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[CREATE-ACCOUNT-EVENT-HANDLER]: ${error}`);

      throw error;
    }
  }
}
