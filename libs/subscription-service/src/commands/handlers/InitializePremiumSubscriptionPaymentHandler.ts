import axios from 'axios';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargeResponse } from '../../interface/schema';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentService } from '../../services/payment.service';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { InitializePremiumSubscriptionPaymentCommand } from '../impl';
import { TransactionRefHelpers } from '@app/common/src/helpers/reference';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { SubscriptionPlan } from '@app/common/src/models/subscription.model';
import { AdminAlertEmailNotificationService } from '@app/notification-service/src/services/email/admin.alert.email.notification.service';
import { AccountRole } from '@app/common/src/constants/enums';

@CommandHandler(InitializePremiumSubscriptionPaymentCommand)
export class InitializePremiumSubscriptionPaymentHandler implements ICommandHandler<
  InitializePremiumSubscriptionPaymentCommand,
  ChargeResponse
> {
  constructor(
    private readonly paymentService: PaymentService,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
    private readonly adminAlertEmailNotificationService: AdminAlertEmailNotificationService,
  ) { }

  async execute(command: InitializePremiumSubscriptionPaymentCommand) {
    const { planId, secureUser } = command;

    try {
      this.logger.log(
        `[INITIALIZE-POST-PRODUCT-TRANSFER-SESSION-HANDLER-PROCESSING]`,
      );

      if (secureUser.role !== AccountRole.OWNER) {
        throw new UnauthorizedException(
          'You do not have permission to initialize premium subscription payment.',
        );
      }

      const plan = await this.subscriptionPlanRepository.findOne({
        where: {
          id: planId,
        },
      });

      if (!plan) {
        throw new Error('Subscription plan not found');
      }

      const reference = TransactionRefHelpers.makeTransactionReference(
        'premium_subscription',
      );

      const payload = {
        reference,
        email: secureUser.email!,
        bank_transfer: {
          account_expires_at: new Date(
            Date.now() + 1000 * 60 * 15,
          ).toISOString(),
        },
        metadata: {
          custom_fields: [
            {
              display_name: 'Plan ID',
              variable_name: 'PLAN_ID',
              value: plan.id,
            },
            {
              display_name: 'Payment Type',
              variable_name: 'PAYMENT_TYPE',
              value: 'PREMIUM_SUBSCRIPTION',
            },
          ],
        },
        amount: (parseInt(plan.priceNGN.toString()) * 100).toString(),
      };

      const { data } = await axios.post(
        'https://api.paystack.co/charge',
        payload,
        {
          headers: this.paymentService.getPaystackHeaders(),
        },
      );

      if (!data.status) {
        throw new Error('Failed to create payment session');
      }

      this.logger.log('[CREATE-POST-PRODUCT-TRANSFER-SESSION-SUCCESS]');

      return modelsFormatter.FormatPaystackChargeResponse(data, plan.priceNGN);
    } catch (error) {
      this.logger.log(
        `[INITIALIZE-POST-PRODUCT-TRANSFER-SESSION-HANDLER-ERROR] :: ${error}`,
      );

      // ! SEND EMAIL TO ADMIN
      //   await this.adminAlertEmailNotificationService.sendInitializeProductUploadPaymentSessionErrorEmailNotification(
      //     error,
      //     secureUser.email!,
      //     planId.toString(),
      //     'PAYSTACK',
      //   );

      //   throw error;
      console.log('[ERROR]  ::  ', error);
    }
  }
}
