import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '../../../common/src/logger/logger.service';

@Injectable()
export class SubscriptionService {
  constructor(@Inject('Logger') private readonly logger: AppLogger) {}
}
