import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Repository, LessThanOrEqual } from 'typeorm';
import { AppLogger } from '@app/common/src/logger/logger.service';
import { Subscription } from '@app/common/src/models/subscription.model';
import { SubscriptionStatusEnum } from '@app/common/src/constants/enums';

@Injectable()
export class SubscriptionCronService {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  //! EVERYDAY - EXPIRED SUBSCRIPTIONS CRON HANDLER
  // @Cron('*/10 * * * * *')
  @Cron('45 23 * * *', { timeZone: 'Africa/Lagos' })
  async processExpiredSubscriptionsCronHandler() {
    try {
      this.logger.log('[PROCESS-EXPIRED-SUBSCRIPTIONS-CRONJOB-PROCESSING]');

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const subscriptions = await this.subscriptionRepository.find({
        where: {
          isExpired: false,
          status: SubscriptionStatusEnum.ACTIVE,
          expirationDate: LessThanOrEqual(endOfToday),
        },
      });

      console.log('[SUBSCRIPTION-CRONJOB-DATA] :: ', subscriptions.length);

      await Promise.all(
        subscriptions.map(async (subscription) => {
          try {
            this.logger.log(
              '[PROCESS-EXPIRED-SUBSCRIPTION-MANAGER-PROCESSING]',
            );

            Object.assign(subscription, {
              isExpired: true,
              status: SubscriptionStatusEnum.EXPIRED,
            });

            await this.subscriptionRepository.save(subscription);

            this.logger.log('[PROCESS-EXPIRED-SUBSCRIPTION-MANAGER-SUCCESS]');
          } catch (error) {
            this.logger.error(
              `[PROCESS-EXPIRED-SUBSCRIPTION-MANAGER-ERROR] ${error}`,
            );
          }
        }),
      );

      this.logger.log('[PROCESS-EXPIRED-SUBSCRIPTIONS-CRONJOB-SUCCESS]');
    } catch (error) {
      this.logger.error('[PROCESS-EXPIRED-SUBSCRIPTIONS-CRONJOB-ERROR]', error);
      throw error;
    }
  }
}
