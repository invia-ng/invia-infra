import { LessThan, MoreThan, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import {
  SubscriptionStatusEnum,
  SubscriptionIntervalEnum,
  SubscriptionItemLimitEnum,
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
  ) { }

  async handle(event: ProcessPremiumSubscriptionEvent) {
    try {
      this.logger.log(`[PROCESS-PREMIUM-SUBSCRIPTION-HANDLER-PROCESSING]`);

      const {
        planId,
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

      const subscriptionPlan = await this.subscriptionPlanRepository.findOneBy({
        id: planId,
      });

      const business = await this.businessRepository.findOne({
        where: {
          account: {
            email: customerEmail,
          },
        },
      });

      const existingSubscriptionWithSameRef = await this.subscriptionRepository.findOne({
        where: {
          paymentReference,
        },
      });

      if (existingSubscriptionWithSameRef) {
        this.logger.log(
          `[PROCESS-PREMIUM-SUBSCRIPTION-HANDLER-IGNORED] :: Subscription with payment reference ${paymentReference} already exists.`,
        );
        return;
      }

      const subscriptionExists = await this.subscriptionRepository.findOne({
        where: {
          isExpired: false,
          business: {
            id: business.id,
          },
          status: SubscriptionStatusEnum.ACTIVE,
          // subscriptionDate: LessThan(new Date()),
        },
      });

      if (subscriptionExists) {
        await this.subscriptionRepository.save({
          ...subscriptionExists,
          isExpired: true,
          status: SubscriptionStatusEnum.EXPIRED,
        })
      }

      const duration =
        subscriptionPlan.interval === SubscriptionIntervalEnum.MONTHLY
          ? 30
          : 365;

      const expiration_date = calculateSubscriptionExpirationDate(duration, 0);

      await this.subscriptionRepository.save({
        amountPaid: amountPaid / 100,
        paymentReference,
        status: SubscriptionStatusEnum.ACTIVE,
        subscriptionDate: new Date(),
        expirationDate: expiration_date,
        plan: subscriptionPlan,
        eventLimit: subscriptionPlan.name.includes('Pro') ? 3 : subscriptionPlan.name.includes('Studio') ? 5 : 3,
        guestLimit: subscriptionPlan.name.includes('Pro') ? 500 : subscriptionPlan.name.includes('Studio') ? 1000 : 200,
        guestLimitStatus:
          subscriptionPlan.name.includes('Pro')
            ? SubscriptionItemLimitEnum.LIMITED : subscriptionPlan.name.includes('Studio')
              ? SubscriptionItemLimitEnum.LIMITED
              : SubscriptionItemLimitEnum.UNLIMITED,
        eventLimitStatus: subscriptionPlan.name.includes('Pro')
          ? SubscriptionItemLimitEnum.LIMITED : subscriptionPlan.name.includes('Studio')
            ? SubscriptionItemLimitEnum.LIMITED
            : SubscriptionItemLimitEnum.UNLIMITED,
        reusableMessageTemplates: subscriptionPlan.name.includes('Pro')
          ? true : subscriptionPlan.name.includes('Studio')
            ? true
            : false,
        invitationCoverImage: subscriptionPlan.name.includes('Pro')
          ? true : subscriptionPlan.name.includes('Studio')
            ? true
            : false,
        guestActivityTimeline: subscriptionPlan.name.includes('Pro')
          ? true : subscriptionPlan.name.includes('Studio')
            ? true
            : false,
        advancedGuestActivityTimeline:
          subscriptionPlan.name.includes('Studio')
            ? true
            : false,
        followupMessages: subscriptionPlan.name.includes('Pro')
          ? true : subscriptionPlan.name.includes('Studio')
            ? true
            : false,
        manageTeamMembers:
          subscriptionPlan.name.includes('Studio')
            ? true
            : false,
        secureGuestDataAccess:
          subscriptionPlan.name.includes('Studio')
            ? true
            : false,
        flexibleDataExport:
          subscriptionPlan.name.includes('Studio')
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
            amount: subscriptionPlan.priceNGN.toString(),
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
