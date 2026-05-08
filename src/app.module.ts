import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { RouterModule } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtStrategy } from '@app/common/src/auth';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthModule } from './health/health.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthServiceModule } from '@app/auth-service/src';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { EventServiceModule } from '@app/event-service/src';
import { CommonModule } from '@app/common/src/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountServiceModule } from '@app/account-service/src';
import { AppLogger } from '@app/common/src/logger/logger.service';
import { DatabaseSource } from '@app/common/src/database/database-source';
import { SubscriptionServiceModule } from '@app/subscription-service/src';
import { DeviceInfoMiddleware } from '@app/common/src/middlewares/device.info.middleware';
import { SuccessResponseMiddleware } from '@app/common/src/middlewares/success.middleware';
import { NotificationServiceModule } from '@app/notification-service/src/notification-service.module';

@Module({
  imports: [
    HealthModule,
    CommonModule,
    AuthServiceModule,
    EventServiceModule,
    AccountServiceModule,
    SubscriptionServiceModule,
    NotificationServiceModule,
    TypeOrmModule.forRoot(DatabaseSource),
    CacheModule.register({ isGlobal: true }),
    LoggerModule.forRoot(),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<number>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          port: 465,
          secure: true,
          host: 'smtp.gmail.com',
          auth: {
            user: configService.get<string>('GMAIL_SMTP_EMAIL'),
            pass: configService.get<string>('GMAIL_SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
        },
      }),
      inject: [ConfigService],
    }),
    RouterModule.register([
      {
        path: 'v1/account',
        module: AccountServiceModule,
      },
      {
        path: 'v1/auth',
        module: AuthServiceModule,
      },
      {
        path: 'v1/event',
        module: EventServiceModule,
      },
      {
        path: 'v1/notification',
        module: NotificationServiceModule,
      },
      {
        path: 'v1/subscription',
        module: SubscriptionServiceModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DeviceInfoMiddleware).forRoutes('*');
    consumer.apply(SuccessResponseMiddleware).forRoutes('*');
  }
}
