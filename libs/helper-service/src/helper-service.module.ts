import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './services/seeder.service';
import { MetaApiService } from './services/meta-api.service';
import { S3UploadService } from './services/s3-upload.service';
import { HelperServiceQueryHandlers } from './queries/handlers';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { FileUploadService } from './services/file-upload.service';
import { ImageUploadService } from './services/image-upload.service';
import { EmailSenderService } from './services/email-sender.service';
import { AddressHelperService } from './services/address.helper.service';

@Module({
  imports: [CqrsModule, ConfigModule, TypeOrmModule.forFeature([])],
  exports: [
    SeederService,
    MetaApiService,
    S3UploadService,
    FileUploadService,
    ImageUploadService,
    EmailSenderService,
    AddressHelperService,
  ],
  providers: [
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    SeederService,
    MetaApiService,
    S3UploadService,
    FileUploadService,
    ImageUploadService,
    EmailSenderService,
    AddressHelperService,
    ...HelperServiceQueryHandlers,
  ],
  controllers: [],
})
export class HelperServiceModule {}
