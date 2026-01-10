import { Inject } from '@nestjs/common';
import { PaystackWebhookCallbackCommand } from '../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { ProcessPremiumSubscriptionEvent } from '../../events/impl';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(PaystackWebhookCallbackCommand)
export class ProcessPaystackWebhookCallbackHandler implements ICommandHandler<PaystackWebhookCallbackCommand> {
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  async execute(command: PaystackWebhookCallbackCommand) {
    try {
      this.logger.log(`[PROCESS-PAYSTACK-WEBHOOK-CALLBACK-HANDLER-PROCESSING]`);

      const { payload } = command;

      const customerEmail = payload?.customer?.email;

      console.log('[PAYSTACK-WEBHOOK] :: ', payload);

      if (payload?.status === 'success') {
        if (
          payload?.metadata?.custom_fields.some(
            (field) => field.value === 'PREMIUM_SUBSCRIPTION',
          )
        ) {
          console.log('HANDLE-PREMIUM_SUBSCRIPTION-PAYMENT');

          this.eventBus.publish(
            new ProcessPremiumSubscriptionEvent(
              true,
              payload?.channel === 'bank_transfer',
              customerEmail,
              payload?.amount / 100,
              payload.reference,
            ),
          );
        }
      }
    } catch (error) {
      this.logger.log(
        `[PROCESS-PAYSTACK-WEBHOOK-CALLBACK-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
