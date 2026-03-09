import axios from 'axios';
import { AccountRole } from '@app/common/src/constants/enums';
import { PaymentService } from '../../services/payment.service';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { ProcessPremiumSubscriptionEvent } from '../../events/impl';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { VerifyPaymentSessionResponse } from '../../interface/schema';
import { VerifyPremiumSubscriptionPaymentTransferCommand } from '../impl';
import { Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';

@CommandHandler(VerifyPremiumSubscriptionPaymentTransferCommand)
export class VerifyPremiumSubscriptionPaymentTransferHandler implements ICommandHandler<
  VerifyPremiumSubscriptionPaymentTransferCommand,
  VerifyPaymentSessionResponse
> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly paymentService: PaymentService,
    @Inject('Logger') private readonly logger: AppLogger,
  ) { }

  async execute(command: VerifyPremiumSubscriptionPaymentTransferCommand) {
    try {
      const { paymentReference, secureUser } = command;

      this.logger.log(
        `[VERIFY-PREMIUM-SUBSCRIPTION-PAYMENT-TRANSFER-COMMAND-HANDLER-PROCESSING]: ${JSON.stringify(command)}`,
      );

      if (secureUser.role !== AccountRole.OWNER) {
        throw new UnauthorizedException(
          'You do not have permission to verify this payment.',
        );
      }

      const { data } = await axios.get(
        `https://api.paystack.co/charge/${paymentReference}`,
        {
          headers: this.paymentService.getPaystackHeaders(),
        },
      );

      const customerEmail = data.data?.customer?.email;

      if (
        data.data?.metadata?.custom_fields.some(
          (field) => field.value === 'PREMIUM_SUBSCRIPTION',
        )
      ) {
        console.log('HANDLE-PREMIUM_SUBSCRIPTION-PAYMENT');

        const planId = data.data?.metadata?.custom_fields.find(
          (field) => field.variable_name === 'PLAN_ID',
        ).value;

        this.eventBus.publish(
          new ProcessPremiumSubscriptionEvent(
            planId,
            true,
            data?.data?.channel === 'bank_transfer',
            customerEmail,
            data.data?.amount,
            data.data.reference,
          ),
        );
      }

      this.logger.log(`[VERIFY-PREMIUM-SUBSCRIPTION-PAYMENT-TRANSFER-COMMAND-HANDLER-SUCCESS]`);

      return {
        status: true,
        channel: data.data.channel,
        paid_at: new Date().toString().slice(0, 10),
      } as VerifyPaymentSessionResponse;
    } catch (error) {
      this.logger.log(
        `[VERIFY-PREMIUM-SUBSCRIPTION-PAYMENT-TRANSFER-COMMAND-HANDLER-ERROR]: ${error}`,
      );

      return {
        status: false,
        channel: 'NONE',
        paid_at: new Date().toString().slice(0, 10),
      } as VerifyPaymentSessionResponse;

      // throw error;
    }
  }
}
