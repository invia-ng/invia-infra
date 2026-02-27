import axios from 'axios';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Invitation
} from '@app/common/src/models/invitation.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from '@app/common/src/models/guest.model';
import { Billing } from '@app/common/src/models/billing.model';
import { ProcessInviteEventGuestsBillingCommand } from '../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Subscription } from '@app/common/src/models/subscription.model';
import { TransactionRefHelpers } from '@app/common/src/helpers/reference';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { InvitationChargeResponse } from '@app/subscription-service/src/interface/schema';

@CommandHandler(ProcessInviteEventGuestsBillingCommand)
export class ProcessInviteEventGuestsBillingHandler implements ICommandHandler<ProcessInviteEventGuestsBillingCommand, InvitationChargeResponse> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    private readonly configService: ConfigService,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Billing)
    private readonly billingRepository: Repository<Billing>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) { }

  async execute(command: ProcessInviteEventGuestsBillingCommand) {
    try {
      this.logger.log(`[INVITE-EVENT-GUESTS-HANDLER-PROCESSING]`);

      const { eventId, payload, secureUser } = command;

      const guests: Guest[] = [];

      const billing = await this.billingRepository.findOne({
        where: {
          isEnabled: true,
        },
      });

      const subscription = await this.subscriptionRepository.findOne({
        where: {
          business: {
            account: {
              id: secureUser.id,
            },
          },
          isExpired: false,
        },
      });

      let amountToCharge = 0;
      let totalEmailCharge = 0;
      let totalWhatsappCharge = 0;
      const isPayAsYouGo = !subscription || subscription.plan?.name.includes('Pay as you go');
      const isProOrStudio = subscription && (subscription.plan?.name.includes('Pro') || subscription.plan?.name.includes('Studio'));

      await Promise.all(
        payload.guestIds.map(async (guestId) => {
          try {
            this.logger.log('[FETCH-GUEST-MANAGER-PROCESSING]');

            const guest = await this.guestRepository.findOne({
              where: {
                id: guestId,
              },
            });

            if (!guest) {
              return;
            }

            guests.push(guest);

            let guestEmailCharge = 0;
            let guestWhatsappCharge = 0;

            if (payload.sendEmailInvite) guestEmailCharge += Number(billing?.pricePerEmail || 0);
            if (payload.sendWhatsAppInvite) guestWhatsappCharge += Number(billing?.pricePerWhatsappMessage || 0);
            if (payload.followupInvitations && payload.followupInvitations.length > 0) {
              guestEmailCharge += payload.followupInvitations.length * Number(billing?.pricePerEmail || 0);
            }

            const guestCharge = guestEmailCharge + guestWhatsappCharge;

            if (isPayAsYouGo) {
              amountToCharge += guestCharge;
              totalEmailCharge += guestEmailCharge;
              totalWhatsappCharge += guestWhatsappCharge;
            } else if (isProOrStudio) {
              const hasBeenInvited = await this.invitationRepository.findOne({
                where: {
                  event: { id: eventId },
                  guest: { id: guest.id },
                },
              });

              if (hasBeenInvited) {
                amountToCharge += guestCharge;
                totalEmailCharge += guestEmailCharge;
                totalWhatsappCharge += guestWhatsappCharge;
              }
            }

            this.logger.log('[FETCH-GUEST-MANAGER-SUCCESS]');
          } catch (error) {
            this.logger.log(`[FETCH-GUEST-MANAGER-ERROR] :: ${error}`);
          }
        }),
      );

      this.logger.log(`[INVITE-EVENT-GUESTS-HANDLER-SUCCESS]`);

      if (amountToCharge > 0) {
        const reference = TransactionRefHelpers.makeTransactionReference('invite_guests_billing');
        const payloadData = {
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
                display_name: 'Event ID',
                variable_name: 'EVENT_ID',
                value: eventId,
              },
              {
                display_name: 'Payment Type',
                variable_name: 'PAYMENT_TYPE',
                value: 'INVITE_GUESTS_BILLING',
              },
              {
                display_name: 'Guest IDs',
                variable_name: 'GUEST_IDS',
                value: payload.guestIds.join(','),
              },
              {
                display_name: 'Send Email Invite',
                variable_name: 'SEND_EMAIL_INVITE',
                value: payload.sendEmailInvite,
              },
              {
                display_name: 'Send WhatsApp Invite',
                variable_name: 'SEND_WHATSAPP_INVITE',
                value: payload.sendWhatsAppInvite,
              },
              {
                display_name: 'Followup Invitations',
                variable_name: 'FOLLOWUP_INVITATIONS',
                value: JSON.stringify(payload.followupInvitations),
              },
              {
                display_name: 'Image',
                variable_name: 'IMAGE',
                value: payload.image,
              },
              {
                display_name: 'Message',
                variable_name: 'MESSAGE',
                value: payload.message,
              },
              {
                display_name: 'Secure User',
                variable_name: 'SECURE_USER',
                value: JSON.stringify(secureUser),
              }
            ],
          },
          amount: (amountToCharge * 100).toString(),
        };

        const { data } = await axios.post(
          'https://api.paystack.co/charge',
          payloadData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_TOKEN')}`,
            },
          },
        );

        if (!data.status) {
          throw new Error('Failed to create payment session');
        }

        return modelsFormatter.FormatInvitationChargeResponse(data, amountToCharge, totalEmailCharge, totalWhatsappCharge, 0);
      }

      return {
        message: 'No charge required',
        status: true,
        data: {
          status: 'success',
          amount: 0,
        } as any,
        emailCharge: 0,
        whatsAppCharge: 0,
        discount: 0,
      };
    } catch (error) {
      this.logger.log(`[INVITE-EVENT-GUESTS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
