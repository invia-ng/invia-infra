import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder } from '@nestjs/swagger';
import { NotificationServiceCronHandlers } from './jobs';
import { SupportService } from './services/support.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Setting } from '@app/common/src/models/setting.model';
import { Account } from 'libs/common/src/models/account.model';
import { setupSwaggerDocument } from '@app/common/src/swagger';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { SupportController } from './controllers/support.controller';
import { NotificationServiceQueryHandlers } from './queries/handlers';
import { Notification } from 'libs/common/src/models/notification.model';
import { NotificationController } from './controllers/notification.controller';
import { HelperServiceModule } from '@app/helper-service/src/helper-service.module';
import { AccountNotificationService } from './services/account.notification.service';
import { EmailSenderService } from 'libs/helper-service/src/services/email-sender.service';
import { AccountNotificationController } from './controllers/account.notification.controller';
import { AuthEmailNotificationService } from './services/email/auth.email.notification.service';
import { EventEmailNotificationService } from './services/email/event.email.notification.service';
import { PaymentEmailNotificationService } from './services/email/payment.email.notification.service';
import { EventWhatsAppNotificationService } from './services/email/event.whatsapp.notification.service';
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
    SupportService,
    EmailSenderService,
    AccountNotificationService,
    AuthEmailNotificationService,
    EventEmailNotificationService,
    PaymentEmailNotificationService,
    EventWhatsAppNotificationService,
    AdminAlertEmailNotificationService,
    SubscriptionsEmailNotificationService,
    // Cron-Jobs
    ...NotificationServiceCronHandlers,
    // Commands
    ...NotificationServiceQueryHandlers,
  ],
  exports: [
    SupportService,
    AuthEmailNotificationService,
    EventWhatsAppNotificationService,
    AdminAlertEmailNotificationService,
    SubscriptionsEmailNotificationService,
  ],
  controllers: [NotificationController, SupportController, AccountNotificationController],
})
export class NotificationServiceModule {
  constructor(private configService: ConfigService) {
    setupSwaggerDocument(
      'notification-service',
      new DocumentBuilder()
        .addBearerAuth()
        .addServer(this.configService.get<string>('API_HOST'))
        .setTitle('Notification Docs')
        .setDescription('Notification service endpoints...')
        .setVersion('1.0')
        .build(),
    )(NotificationServiceModule);
  }
}