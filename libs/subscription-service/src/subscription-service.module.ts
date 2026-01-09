import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder } from '@nestjs/swagger';
import {
  Subscription,
  SubscriptionPlan,
  SubscriptionPlanFeature,
} from '@app/common/src/models/subscription.model';
import { SubscriptionServiceCronHandlers } from './jobs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubscriptionService } from './services/subscription.service';
import { Account } from 'libs/common/src/models/account.model';
import { setupSwaggerDocument } from '../../common/src/swagger';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from '../../common/src/logger/logger.service';
import { SubscriptionServiceEventHandlers } from './events/handlers';
import { SubscriptionServiceQueryHandlers } from './queries/handlers';
import { GetSystemJWTModule } from 'libs/common/src/middlewares/config';
import { SubscriptionServiceCommandHandlers } from './commands/handlers';
import { SubscriptionController } from './controllers/subscription.controller';
import { HelperServiceModule } from '@app/helper-service/src/helper-service.module';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    HelperServiceModule,
    GetSystemJWTModule(),
    TypeOrmModule.forFeature([
      Account,
      Business,
      Subscription,
      SubscriptionPlan,
      SubscriptionPlanFeature,
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    ...SubscriptionServiceCronHandlers,
    ...SubscriptionServiceQueryHandlers,
    ...SubscriptionServiceEventHandlers,
    ...SubscriptionServiceCommandHandlers,
  ],
  exports: [SubscriptionService],
})
export class SubscriptionServiceModule {
  constructor(private configService: ConfigService) {
    setupSwaggerDocument(
      'subscription-service',
      new DocumentBuilder()
        .addBearerAuth()
        .addServer(this.configService.get<string>('API_HOST'))
        .setTitle('Subscription Docs')
        .setDescription('Subscription service endpoints...')
        .setVersion('1.0')
        .build(),
    )(SubscriptionServiceModule);
  }
}
