import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FCMessaging from '../../bases/FCMessaging';
import { EmailSenderService } from 'libs/helper-service/src/services/email-sender.service';

@Injectable()
export class SubscriptionsEmailNotificationService {
  constructor(
    public commandBus: CommandBus,
    private configService: ConfigService,
    private emailSenderService: EmailSenderService,
  ) {}
}
