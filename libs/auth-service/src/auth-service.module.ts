import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthServiceCronHandlers } from './jobs';
import { DocumentBuilder } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthServiceEventHandlers } from './events/handlers';
import { AuthController } from './controllers/auth.controller';
import { Account } from 'libs/common/src/models/account.model';
import { Setting } from '@app/common/src/models/setting.model';
import { setupSwaggerDocument } from '../../common/src/swagger';
import { Business } from '@app/common/src/models/business.model';
import { AuthServiceCommandHandlers } from './commands/handlers';
import { AppLogger } from '../../common/src/logger/logger.service';
import { GetSystemJWTModule } from 'libs/common/src/middlewares/config';
import { Notification } from '@app/common/src/models/notification.model';
import { Subscription } from '@app/common/src/models/subscription.model';
import { AuthHelperController } from './controllers/auth.helper.controller';
import { HelperServiceModule } from 'libs/helper-service/src/helper-service.module';
import { FileUploadController } from '@app/helper-service/src/controllers/file-upload.controller';
import { AuthEmailNotificationService } from '@app/notification-service/src/services/email/auth.email.notification.service';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    GetSystemJWTModule(),
    HelperServiceModule,
    TypeOrmModule.forFeature([
      Account,
      Setting,
      Business,
      Subscription,
      Notification,
    ]),
  ],
  providers: [
    AuthService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    AuthEmailNotificationService,
    ...AuthServiceCronHandlers,
    ...AuthServiceEventHandlers,
    ...AuthServiceCommandHandlers,
  ],
  exports: [AuthService],
  controllers: [AuthController, AuthHelperController, FileUploadController],
})
export class AuthServiceModule {
  constructor(private configService: ConfigService) {
    setupSwaggerDocument(
      'auth-service',
      new DocumentBuilder()
        .addBearerAuth()
        .addServer(this.configService.get<string>('API_HOST'))
        .setTitle('Auth Docs')
        .setDescription('Authentication endpoints...')
        .setVersion('1.0')
        .build(),
    )(AuthServiceModule);
  }
}
