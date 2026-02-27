import { Inject } from '@nestjs/common';
import { PaystackWebhookCallbackCommand } from '../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { ProcessPremiumSubscriptionEvent } from '../../events/impl';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InviteEventGuestsAfterPaymentCommand, InviteEventGuestsCommand } from '@app/event-service/src/commands/impl';

@CommandHandler(PaystackWebhookCallbackCommand)
export class ProcessPaystackWebhookCallbackHandler implements ICommandHandler<PaystackWebhookCallbackCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
    @Inject('Logger') private readonly logger: AppLogger,
  ) { }

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

          const planId = payload?.metadata?.custom_fields.find(
            (field) => field.variable_name === 'PLAN_ID',
          ).value;

          this.eventBus.publish(
            new ProcessPremiumSubscriptionEvent(
              planId,
              true,
              payload?.channel === 'bank_transfer',
              customerEmail,
              payload?.amount / 100,
              payload.reference,
            ),
          );
        }
        else if (
          payload?.metadata?.custom_fields.some(
            (field) => field.value === 'INVITE_GUESTS_BILLING',
          )
        ) {
          console.log('HANDLE-INVITE_GUESTS_BILLING-PAYMENT');

          const planId = payload?.metadata?.custom_fields.find(
            (field) => field.variable_name === 'PLAN_ID',
          ).value;

          const eventId = Number(payload?.metadata?.custom_fields.find(
            (field: any) => field.variable_name === 'EVENT_ID',
          )?.value);

          const guestIdsStr = payload?.metadata?.custom_fields.find(
            (field: any) => field.variable_name === 'GUEST_IDS',
          )?.value;
          const guestIds = guestIdsStr ? String(guestIdsStr).split(',').map((id: string) => Number(id)) : [];

          const sendEmailInviteValue = payload?.metadata?.custom_fields.find(
            (field: any) => field.variable_name === 'SEND_EMAIL_INVITE',
          )?.value;
          const sendEmailInvite = sendEmailInviteValue === true || String(sendEmailInviteValue) === 'true';

          const sendWhatsAppInviteValue = payload?.metadata?.custom_fields.find(
            (field: any) => field.variable_name === 'SEND_WHATSAPP_INVITE',
          )?.value;
          const sendWhatsAppInvite = sendWhatsAppInviteValue === true || String(sendWhatsAppInviteValue) === 'true';

          const followupInvitationsStr = payload?.metadata?.custom_fields.find(
            (field: any) => field.variable_name === 'FOLLOWUP_INVITATIONS',
          )?.value;
          let followupInvitations = undefined;
          if (followupInvitationsStr && followupInvitationsStr !== 'undefined') {
            try {
              followupInvitations = JSON.parse(followupInvitationsStr);
            } catch (e) {
              this.logger.log(`Failed to parse followup invitations: ${e}`);
            }
          }

          const image = payload?.metadata?.custom_fields.find(
            (field: any) => field.variable_name === 'IMAGE',
          )?.value;

          const message = payload?.metadata?.custom_fields.find(
            (field: any) => field.variable_name === 'MESSAGE',
          )?.value;

          const secureUser = JSON.parse(payload?.metadata?.custom_fields.find(
            (field: any) => field.variable_name === 'SECURE_USER',
          )?.value);

          this.commandBus.execute(
            new InviteEventGuestsAfterPaymentCommand(
              eventId,
              payload.amount / 100,
              payload.reference,
              {
                guestIds,
                sendEmailInvite,
                sendWhatsAppInvite,
                followupInvitations,
                image,
                message,
              },
              secureUser,
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
