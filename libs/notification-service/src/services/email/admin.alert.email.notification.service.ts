import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AppLogger } from '../../../../common/src/logger/logger.service';

@Injectable()
export class AdminAlertEmailNotificationService {
  constructor(
    private configService: ConfigService,
    private readonly gmailMailerService: MailerService,
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}
}
