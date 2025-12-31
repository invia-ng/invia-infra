import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder } from '@nestjs/swagger';
import { EventServiceCronHandlers } from './jobs';
import { EventService } from './services/event.service';
import { Event } from '@app/common/src/models/event.model';
import { Guest } from '@app/common/src/models/guest.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Setting } from '@app/common/src/models/setting.model';
import { Account } from 'libs/common/src/models/account.model';
import { EventServiceEventHandlers } from './events/handlers';
import { setupSwaggerDocument } from '../../common/src/swagger';
import { EventServiceQueryHandlers } from './queries/handlers';
import { Business } from '@app/common/src/models/business.model';
import { EventController } from './controllers/event.controller';
import { EventServiceCommandHandlers } from './commands/handlers';
import { AppLogger } from '../../common/src/logger/logger.service';
import { GetSystemJWTModule } from 'libs/common/src/middlewares/config';
import { Notification } from '@app/common/src/models/notification.model';
import { EventHelperController } from './controllers/event.helper.controller';
import { HelperServiceModule } from '@app/helper-service/src/helper-service.module';
import { EmailSenderService } from '@app/helper-service/src/services/email-sender.service';

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
      Business,
      Notification,
    ]),
  ],
  controllers: [
    EventController,
    EventHelperController,
  ],
  providers: [
    EventService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    EmailSenderService,
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
