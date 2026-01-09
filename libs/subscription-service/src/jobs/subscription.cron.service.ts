import { Cron } from '@nestjs/schedule';
import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '@app/common/src/logger/logger.service';

@Injectable()
export class SubscriptionCronService {
  constructor(@Inject('Logger') private readonly logger: AppLogger) {}
}
