import axios from 'axios';
import { Inject, NotFoundException } from '@nestjs/common';
import { VerifyInvitationPaymentTransferQuery } from '../impl';
import { PaymentService } from '../../services/payment.service';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { VerifyPaymentSessionResponse } from '../../interface/schema';
import { QueryHandler, IQueryHandler, CommandBus } from '@nestjs/cqrs';
import { InviteEventGuestsAfterPaymentCommand } from '@app/event-service/src/commands/impl';

@QueryHandler(VerifyInvitationPaymentTransferQuery)
export class VerifyInvitationPaymentTransferQueryHandler implements IQueryHandler<
  VerifyInvitationPaymentTransferQuery,
  VerifyPaymentSessionResponse
> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly paymentService: PaymentService,
    @Inject('Logger') private readonly logger: AppLogger,
  ) { }

  async execute(query: VerifyInvitationPaymentTransferQuery) {
    try {
      const { paymentReference, secureUser } = query;

      this.logger.log(
        `[VERIFY-PREMIUM-SUBSCRIPTION-PAYMENT-TRANSFER-QUERY-HANDLER-PROCESSING]: ${JSON.stringify(query)}`,
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

      if (
        data.data?.metadata?.custom_fields.some(
          (field) => field.value === 'INVITE_GUESTS_BILLING',
        )
      ) {
        console.log('HANDLE-INVITE_GUESTS_BILLING-PAYMENT');

        const planId = data?.data?.metadata?.custom_fields.find(
          (field) => field.variable_name === 'PLAN_ID',
        ).value;

        const eventId = Number(data?.data?.metadata?.custom_fields.find(
          (field: any) => field.variable_name === 'EVENT_ID',
        )?.value);

        const guestIdsStr = data?.data?.metadata?.custom_fields.find(
          (field: any) => field.variable_name === 'GUEST_IDS',
        )?.value;
        const guestIds = guestIdsStr ? String(guestIdsStr).split(',').map((id: string) => Number(id)) : [];

        const sendEmailInviteValue = data?.data?.metadata?.custom_fields.find(
          (field: any) => field.variable_name === 'SEND_EMAIL_INVITE',
        )?.value;
        const sendEmailInvite = sendEmailInviteValue === true || String(sendEmailInviteValue) === 'true';

        const sendWhatsAppInviteValue = data?.data?.metadata?.custom_fields.find(
          (field: any) => field.variable_name === 'SEND_WHATSAPP_INVITE',
        )?.value;
        const sendWhatsAppInvite = sendWhatsAppInviteValue === true || String(sendWhatsAppInviteValue) === 'true';

        const followupInvitationsStr = data?.data?.metadata?.custom_fields.find(
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

        const image = data?.data?.metadata?.custom_fields.find(
          (field: any) => field.variable_name === 'IMAGE',
        )?.value;

        const message = data?.data?.metadata?.custom_fields.find(
          (field: any) => field.variable_name === 'MESSAGE',
        )?.value;

        this.commandBus.execute(
          new InviteEventGuestsAfterPaymentCommand(
            eventId,
            data?.data?.amount,
            data?.data?.reference,
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

      this.logger.log(`[VERIFY-PREMIUM-SUBSCRIPTION-PAYMENT-TRANSFER-QUERY-HANDLER-SUCCESS]`);

      return {
        status: true,
        channel: data.data.channel,
        paid_at: new Date().toString().slice(0, 10),
      } as VerifyPaymentSessionResponse;
    } catch (error) {
      this.logger.log(
        `[VERIFY-PREMIUM-SUBSCRIPTION-PAYMENT-TRANSFER-QUERY-HANDLER-ERROR]: ${error}`,
      );

      throw error;
    }
  }
}
