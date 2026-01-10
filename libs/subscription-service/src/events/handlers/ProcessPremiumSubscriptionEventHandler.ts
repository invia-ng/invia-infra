import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import {
  PaymentGateway,
  SubscriptionIntervalEnum,
  SubscriptionItemLimitEnum,
  SubscriptionStatusEnum,
} from '@app/common/src/constants/enums';
import {
  Subscription,
  SubscriptionPlan,
} from '@app/common/src/models/subscription.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessPremiumSubscriptionEvent } from '../impl';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Account } from '@app/common/src/models/account.model';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { calculateSubscriptionExpirationDate } from '@app/common/src/helpers/subscriptions';
import { SubscriptionsEmailNotificationService } from '@app/notification-service/src/services/email/subscriptions.email.notification.service';

@EventsHandler(ProcessPremiumSubscriptionEvent)
export class ProcessPremiumSubscriptionEventHandler implements IEventHandler<ProcessPremiumSubscriptionEvent> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
    private subscriptionsEmailNotificationService: SubscriptionsEmailNotificationService,
  ) {}

  async handle(event: ProcessPremiumSubscriptionEvent) {
    try {
      this.logger.log(`[PROCESS-PREMIUM-SUBSCRIPTION-HANDLER-PROCESSING]`);

      const {
        amountPaid,
        customerEmail,
        isBankTransfer,
        sendNotification,
        paymentReference,
      } = event;

      const profile = await this.accountRepository.findOne({
        where: {
          email: customerEmail,
        },
      });

      const premiumSubscriptionPlan =
        await this.subscriptionPlanRepository.findOneBy({
          position: 1,
        });

      if (!premiumSubscriptionPlan) {
        throw new Error('Premium subscription plan not found.');
      }

      const business = await this.businessRepository.findOne({
        where: {
          account: {
            email: customerEmail,
          },
        },
      });

      const subscriptionExists = await this.subscriptionRepository.findOne({
        where: {
          isExpired: false,
          business: {
            id: business.id,
          },
        },
        relations: ['user', 'plan'],
      });

      if (subscriptionExists) {
        if (sendNotification) {
          this.subscriptionsEmailNotificationService.premiumSubscriptionPaymentReceiptNotification(
            {
              recipientEmail: profile.email,
              isBankTransfer: isBankTransfer,
              paymentReference: paymentReference,
              amount: premiumSubscriptionPlan.priceNGN.toString(),
            },
          );
        }

        throw new Error('Account already subscribed to premium.');
      }

      const duration =
        premiumSubscriptionPlan.interval === SubscriptionIntervalEnum.MONTHLY
          ? 30
          : 365;

      const expiration_date = calculateSubscriptionExpirationDate(duration, 0);

      await this.subscriptionRepository.save({
        status: SubscriptionStatusEnum.ACTIVE,
        subscriptionDate: new Date(),
        expirationDate: expiration_date,
        guestLimit: 300,
        guestLimitStatus:
        premiumSubscriptionPlan.interval === SubscriptionIntervalEnum.MONTHLY
        ? SubscriptionItemLimitEnum.LIMITED
        : SubscriptionItemLimitEnum.UNLIMITED,
        eventLimit: 3,
        eventLimitStatus: SubscriptionItemLimitEnum.UNLIMITED,
        reusableMessageTemplates: true,
        invitationCoverImage: true,
        guestActivityTimeline: true,
        advancedGuestActivityTimeline:
          premiumSubscriptionPlan.interval === SubscriptionIntervalEnum.YEARLY
            ? true
            : false,
        followupMessages: true,
        manageTeamMembers:
          premiumSubscriptionPlan.interval === SubscriptionIntervalEnum.YEARLY
            ? true
            : false,
        secureGuestDataAccess:
          premiumSubscriptionPlan.interval === SubscriptionIntervalEnum.YEARLY
            ? true
            : false,
        flexibleDataExport:
          premiumSubscriptionPlan.interval === SubscriptionIntervalEnum.YEARLY
            ? true
            : false,
        isExpired: false,
        business: business,
      });

      this.logger.log(`[PROCESS-PREMIUM-SUBSCRIPTION-HANDLER-SUCCESS]`);

      if (sendNotification) {
        this.subscriptionsEmailNotificationService.premiumSubscriptionPaymentReceiptNotification(
          {
            recipientEmail: profile.email,
            isBankTransfer: isBankTransfer,
            paymentReference: paymentReference,
            amount: premiumSubscriptionPlan.priceNGN.toString(),
          },
        );
      }
    } catch (error) {
      this.logger.log(
        `[PROCESS-PREMIUM-SUBSCRIPTION-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
