import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import {
  SubscriptionPlan,
  SubscriptionPlanInfo,
  SubscriptionPlanFeature,
} from '@app/common/src/models/subscription.model';
import { InjectRepository } from '@nestjs/typeorm';
import { FetchSubscriptionPlansQuery } from '../impl';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchSubscriptionPlansQuery)
export class FetchSubscriptionPlansQueryHandler implements IQueryHandler<
  FetchSubscriptionPlansQuery,
  SubscriptionPlanInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
    @InjectRepository(SubscriptionPlanFeature)
    private readonly subscriptionPlanFeatureRepository: Repository<SubscriptionPlanFeature>,
  ) {}

  async execute(query: FetchSubscriptionPlansQuery) {
    try {
      this.logger.log('[FETCH-SUBSCRIPTION-PLANS-QUERY-PROCESSING]');

      const { secureUser } = query;

      const plans: SubscriptionPlanInfo[] = [];

      const subscriptionPlans = await this.subscriptionPlanRepository.find({
        order: {
          position: 'ASC',
        },
      });

      await Promise.all(
        subscriptionPlans.map(async (plan) => {
          try {
            this.logger.log(
              '[FETCH-SUBSCRIPTION-PLAN-FEATURES-MANAGER-PROCESSING]',
            );

            const features = await this.subscriptionPlanFeatureRepository.find({
              where: {
                subscriptionPlan: {
                  id: plan.id,
                },
              },
            });

            plans.push(
              modelsFormatter.FormatSubscriptionPlanInfo(plan, features),
            );

            this.logger.log(
              '[FETCH-SUBSCRIPTION-PLAN-FEATURES-SUCCESS-PROCESSING]',
            );
          } catch (error) {
            this.logger.error(
              `[FETCH-SUBSCRIPTION-PLAN-FEATURES-ERROR] :: ${error}`,
            );
          }
        }),
      );

      this.logger.log('[FETCH-SUBSCRIPTION-PLANS-QUERY-SUCCESS]');

      return plans;
    } catch (error) {
      this.logger.error('[FETCH-SUBSCRIPTION-PLANS-QUERY-ERROR]', error);

      throw error;
    }
  }
}
