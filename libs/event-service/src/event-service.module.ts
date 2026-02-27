import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Invitation,
  FollowupInvitation,
  InvitationPayment,
} from '@app/common/src/models/invitation.model';
import { DocumentBuilder } from '@nestjs/swagger';
import { EventServiceCronHandlers } from './jobs';
import { EventService } from './services/event.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventServiceEventHandlers } from './events/handlers';
import { Setting } from '@app/common/src/models/setting.model';
import { Account } from 'libs/common/src/models/account.model';
import { Billing } from '@app/common/src/models/billing.model';
import { EventServiceQueryHandlers } from './queries/handlers';
import { setupSwaggerDocument } from '../../common/src/swagger';
import { Business } from '@app/common/src/models/business.model';
import { EventController } from './controllers/event.controller';
import { EventServiceCommandHandlers } from './commands/handlers';
import { AppLogger } from '../../common/src/logger/logger.service';
import { Event, EventParty } from '@app/common/src/models/event.model';
import { GetSystemJWTModule } from 'libs/common/src/middlewares/config';
import { Notification } from '@app/common/src/models/notification.model';
import { Subscription } from '@app/common/src/models/subscription.model';
import { Guest, GuestTimeline } from '@app/common/src/models/guest.model';
import { EventAdminController } from './controllers/event.admin.controller';
import { EventGuestController } from './controllers/event.guest.controller';
import { EventHelperController } from './controllers/event.helper.controller';
import { EventAuthorController } from './controllers/event.author.controller';
import { EventMessageController } from './controllers/event.message.controller';
import { HelperServiceModule } from '@app/helper-service/src/helper-service.module';
import { EmailSenderService } from '@app/helper-service/src/services/email-sender.service';
import { FollowupMessageTemplate, MessageTemplate } from '@app/common/src/models/message.template.model';
import { EventEmailNotificationService } from '@app/notification-service/src/services/email/event.email.notification.service';
import { PaymentEmailNotificationService } from '@app/notification-service/src/services/email/payment.email.notification.service';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    HelperServiceModule,
    GetSystemJWTModule(),
    TypeOrmModule.forFeature([
      Event,
      Guest,
      Account,
      Setting,
      Billing,
      Business,
      EventParty,
      Invitation,
      Notification,
      Subscription,
      GuestTimeline,
      MessageTemplate,
      InvitationPayment,
      FollowupInvitation,
      FollowupMessageTemplate,
    ]),
  ],
  controllers: [
    EventController,
    EventAdminController,
    EventGuestController,
    EventAuthorController,
    EventMessageController,
    EventHelperController,
  ],
  providers: [
    EventService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    EmailSenderService,
    EventEmailNotificationService,
    PaymentEmailNotificationService,
    ...EventServiceCronHandlers,
    ...EventServiceQueryHandlers,
    ...EventServiceEventHandlers,
    ...EventServiceCommandHandlers,
  ],
  exports: [EventService],
})
export class EventServiceModule {
  constructor(private configService: ConfigService) {
    setupSwaggerDocument(
      'event-service',
      new DocumentBuilder()
        .addBearerAuth()
        .addServer(this.configService.get<string>('API_HOST'))
        .setTitle('Event Docs')
        .setDescription('Event service endpoints...')
        .setVersion('1.0')
        .build(),
    )(EventServiceModule);
  }
}
