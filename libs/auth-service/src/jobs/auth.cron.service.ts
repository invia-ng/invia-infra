import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '@app/common/src/logger/logger.service';

@Injectable()
export class AuthCronService {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  // !DAILY -> UPDATE USER ACTIVITY VIA USER MODEL
  // @Cron('*/10 * * * * *', { timeZone: 'Africa/Lagos' })
  // @Cron('00 23 * * *', { timeZone: 'Africa/Lagos' })
  async updateUserActivityViaUserModelCronNotification() {
    try {
      this.logger.log(
        `[UPDATE-USER-ACTIVITY-VIA-USER-MODEL-CRONJOB-PROCESSING]`,
      );

      this.logger.log(`[UPDATE-USER-ACTIVITY-VIA-USER-MODEL-CRONJOB-SUCCESS]`);
    } catch (error) {
      this.logger.error(
        `[UPDATE-USER-ACTIVITY-VIA-USER-MODEL-CRONJOB-ERROR] :: ${error}`,
      );
    }
  }
}
