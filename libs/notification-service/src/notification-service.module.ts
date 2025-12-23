import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationServiceCronHandlers } from './jobs';
import { SupportService } from './services/support.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Setting } from '@app/common/src/models/setting.model';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { SupportController } from './controllers/support.controller';
import { Notification } from 'libs/common/src/models/notification.model';
import { HelperServiceModule } from '@app/helper-service/src/helper-service.module';
import { AccountNotificationService } from './services/account.notification.service';
import { EmailSenderService } from 'libs/helper-service/src/services/email-sender.service';
import { AccountNotificationController } from './controllers/account.notification.controller';
import { AuthEmailNotificationService } from './services/email/auth.email.notification.service';
import { AdminAlertEmailNotificationService } from './services/email/admin.alert.email.notification.service';
import { SubscriptionsEmailNotificationService } from './services/email/subscriptions.email.notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Setting,
      Notification,
    ]),
    CqrsModule,
    ConfigModule,
    HelperServiceModule,
  ],
  providers: [
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    ...NotificationServiceCronHandlers,
    SupportService,
    EmailSenderService,
    AccountNotificationService,
    AuthEmailNotificationService,
    AdminAlertEmailNotificationService,
    SubscriptionsEmailNotificationService,
  ],
  exports: [
    SupportService,
    AuthEmailNotificationService,
    AdminAlertEmailNotificationService,
    // AccountNotificationController,
    SubscriptionsEmailNotificationService,
  ],
  controllers: [SupportController, AccountNotificationController],
})
export class NotificationServiceModule {}
