import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder } from '@nestjs/swagger';
import { AccountServiceCronHandlers } from './jobs';
import { Event } from '@app/common/src/models/event.model';
import { Guest } from '@app/common/src/models/guest.model';
import { AccountService } from './services/account.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Setting } from '@app/common/src/models/setting.model';
import { Account } from 'libs/common/src/models/account.model';
import { AccountServiceEventHandlers } from './events/handlers';
import { setupSwaggerDocument } from '../../common/src/swagger';
import { AccountServiceQueryHandlers } from './queries/handlers';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from '../../common/src/logger/logger.service';
import { AccountServiceCommandHandlers } from './commands/handlers';
import { AccountController } from './controllers/account.controller';
import { Invitation } from '@app/common/src/models/invitation.model';
import { GetSystemJWTModule } from 'libs/common/src/middlewares/config';
import { Notification } from '@app/common/src/models/notification.model';
import { Subscription } from '@app/common/src/models/subscription.model';
import { AuthService } from '@app/auth-service/src/services/auth.service';
import { MessageTemplate } from '@app/common/src/models/message.template.model';
import { ManageMemberController } from './controllers/manage.member.controller';
import { ManageAccountController } from './controllers/manage.account.controller';
import { ManageBusinessController } from './controllers/manage.business.controller';
import { HelperServiceModule } from '@app/helper-service/src/helper-service.module';
import { SupportService } from '@app/notification-service/src/services/support.service';
import { EmailSenderService } from '@app/helper-service/src/services/email-sender.service';
import { FileUploadController } from '@app/helper-service/src/controllers/file-upload.controller';
import { AccountNotificationService } from '@app/notification-service/src/services/account.notification.service';
import { AuthEmailNotificationService } from '@app/notification-service/src/services/email/auth.email.notification.service';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    HelperServiceModule,
    GetSystemJWTModule(),
    TypeOrmModule.forFeature([Account, Setting, Business, Notification, Event, Guest, Invitation, MessageTemplate, Subscription]),
  ],
  controllers: [
    AccountController,
    ManageAccountController,
    ManageMemberController,
    ManageBusinessController,
    // SupportController,
    FileUploadController,
    // AccountNotificationController,
  ],
  providers: [
    AuthService,
    AccountService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    SupportService,
    EmailSenderService,
    AuthEmailNotificationService,
    AccountNotificationService,
    ...AccountServiceCronHandlers,
    ...AccountServiceQueryHandlers,
    ...AccountServiceEventHandlers,
    ...AccountServiceCommandHandlers,
  ],
  exports: [AccountService],
})
export class AccountServiceModule {
  constructor(private configService: ConfigService) {
    setupSwaggerDocument(
      'account-service',
      new DocumentBuilder()
        .addBearerAuth()
        .addServer(this.configService.get<string>('API_HOST'))
        .setTitle('Account Docs')
        .setDescription('Account endpoints...')
        .setVersion('1.0')
        .build(),
    )(AccountServiceModule);
  }
}
