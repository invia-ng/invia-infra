import axios from 'axios';
import { VerifyBankPaymentTransferQuery } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import { PaymentService } from '../../services/payment.service';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { ProcessPremiumSubscriptionEvent } from '../../events/impl';
import { QueryHandler, IQueryHandler, EventBus } from '@nestjs/cqrs';
import { VerifyPaymentSessionResponse } from '../../interface/schema';

@QueryHandler(VerifyBankPaymentTransferQuery)
export class VerifyBankPaymentTransferQueryHandler implements IQueryHandler<
  VerifyBankPaymentTransferQuery,
  VerifyPaymentSessionResponse
> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly paymentService: PaymentService,
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  async execute(query: VerifyBankPaymentTransferQuery) {
    try {
      const { paymentReference, secureUser } = query;

      this.logger.log(
        `[VERIFY-PRODUCT-UPLOAD-TRANSFER-QUERY-HANDLER-PROCESSING]: ${JSON.stringify(query)}`,
      );

      const { data } = await axios.get(
        `https://api.paystack.co/charge/${paymentReference}`,
        {
          headers: this.paymentService.getPaystackHeaders(),
        },
      );

      if (data.data.status === 'failed') {
        throw new NotFoundException(
          'Payment is pending, please try again after making transaction.',
        );
      }

      const customerEmail = data.data?.customer?.email;

      if (
        data.data?.metadata?.custom_fields.some(
          (field) => field.value === 'PREMIUM_SUBSCRIPTION',
        )
      ) {
        console.log('HANDLE-PREMIUM_SUBSCRIPTION-PAYMENT');

        this.eventBus.publish(
          new ProcessPremiumSubscriptionEvent(
            false,
            data?.data?.channel === 'bank_transfer',
            customerEmail,
            data.data?.amount,
            data.data.reference,
          ),
        );
      }

      this.logger.log(`[VERIFY-PRODUCT-UPLOAD-TRANSFER-QUERY-HANDLER-SUCCESS]`);

      return {
        status: true,
        channel: data.data.channel,
        paid_at: new Date().toString().slice(0, 10),
      } as VerifyPaymentSessionResponse;
    } catch (error) {
      this.logger.log(
        `[VERIFY-PRODUCT-UPLOAD-TRANSFER-QUERY-HANDLER-ERROR]: ${error}`,
      );

      throw error;
    }
  }
}
