import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './services/seeder.service';
import { S3UploadService } from './services/s3-upload.service';
import { HelperServiceQueryHandlers } from './queries/handlers';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { FileUploadService } from './services/file-upload.service';
import { EmailSenderService } from './services/email-sender.service';
import { AddressHelperService } from './services/address.helper.service';

@Module({
  imports: [CqrsModule, ConfigModule, TypeOrmModule.forFeature([])],
  exports: [
    AddressHelperService,
    FileUploadService,
    S3UploadService,
    EmailSenderService,
    SeederService,
  ],
  providers: [
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    AddressHelperService,
    FileUploadService,
    S3UploadService,
    EmailSenderService,
    SeederService,
    ...HelperServiceQueryHandlers,
  ],
  controllers: [],
})
export class HelperServiceModule {}
