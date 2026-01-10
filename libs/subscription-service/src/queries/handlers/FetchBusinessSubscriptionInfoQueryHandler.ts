import {
  Subscription,
  SubscriptionInfo,
} from '@app/common/src/models/subscription.model';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not, Repository } from 'typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { FetchBusinessSubscriptionInfoQuery } from '../impl';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { SubscriptionStatusEnum } from '@app/common/src/constants/enums';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchBusinessSubscriptionInfoQuery)
export class FetchBusinessSubscriptionInfoQueryHandler implements IQueryHandler<
  FetchBusinessSubscriptionInfoQuery,
  SubscriptionInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async execute(query: FetchBusinessSubscriptionInfoQuery) {
    try {
      this.logger.log('[FETCH-BUSINESS-SUBSCRIPTION-INFO-QUERY-PROCESSING]');

      const { secureUser } = query;

      const business = await this.businessRepository.findOne({
        where: [
          {
            members: {
              id: secureUser.id,
            },
          },
          {
            account: {
              id: secureUser.id,
            },
          },
        ],
      });

      if (!business) {
        throw new NotFoundException(`Business record not found for user`);
      }

      const subscription = await this.subscriptionRepository.findOne({
        where: {
          status: Not(SubscriptionStatusEnum.DEFAULT),
          business: {
            id: business.id,
          },
          expirationDate: MoreThan(new Date()),
        },
      });

      if (!subscription) {
        const _subscription = await this.subscriptionRepository.findOne({
          where: {
            business: {
              id: business.id,
            },
            status: SubscriptionStatusEnum.DEFAULT,
          },
        });

        return modelsFormatter.FormatSubscriptionInfo(_subscription);
      }

      this.logger.log('[FETCH-BUSINESS-SUBSCRIPTION-INFO-QUERY-SUCCESS]');

      return modelsFormatter.FormatSubscriptionInfo(subscription);
    } catch (error) {
      this.logger.error(
        '[FETCH-BUSINESS-SUBSCRIPTION-INFO-QUERY-ERROR]',
        error,
      );

      throw error;
    }
  }
}
