import axios from 'axios';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Invitation
} from '@app/common/src/models/invitation.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from '@app/common/src/models/guest.model';
import { Inject, NotFoundException } from '@nestjs/common';
import { Billing } from '@app/common/src/models/billing.model';
import { ProcessInviteEventGuestsBillingCommand } from '../impl';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Subscription } from '@app/common/src/models/subscription.model';
import { SubscriptionStatusEnum } from '@app/common/src/constants/enums';
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
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) { }

  async execute(command: ProcessInviteEventGuestsBillingCommand) {
    try {
      this.logger.log(`[INVITE-EVENT-GUESTS-HANDLER-PROCESSING]`);

      const { eventId, payload, secureUser } = command;

      console.log('[INVITE-EVENT-GUESTS-HANDLER-PAYLOAD] :: ', payload);

      const guests: Guest[] = [];

      const billing = await this.billingRepository.findOne({
        where: {
          isEnabled: true,
        },
      });

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

      let subscription: Subscription;

      subscription = await this.subscriptionRepository.findOne({
        where: {
          business: {
            id: business.id,
          },
          isExpired: false,
          status: SubscriptionStatusEnum.ACTIVE,
        },
      });

      if (!subscription) {
        subscription = await this.subscriptionRepository.findOne({
          where: {
            business: {
              id: business.id,
            },
            status: SubscriptionStatusEnum.DEFAULT,
          },
        });
      }

      let emailCount = 0;             // total messages to send (display)
      let whatsappCount = 0;          // total messages to send (display)
      let chargeableEmailCount = 0;   // messages to charge for
      let chargeableWhatsappCount = 0;
      let hasPreviouslyInvitedGuests = false;
      const isPayAsYouGo = !subscription || Boolean(subscription.plan?.name?.toLowerCase().includes('pay as you go'));
      const isProOrStudio = Boolean(subscription && (subscription.plan?.name?.toLowerCase().includes('pro') || subscription.plan?.name?.toLowerCase().includes('studio')));

      // console.table({isPayAsYouGo, isProOrStudio })

      await Promise.all(
        payload.guestIds.map(async (guestId) => {
          try {
            this.logger.log('[FETCH-GUEST-MANAGER-PROCESSING]');

            const guest = await this.guestRepository.findOne({
              where: { id: guestId },
            });

            if (!guest) return;

            guests.push(guest);

            // Count messages per guest
            const guestEmailCount =
              (payload.sendEmailInvite ? 1 : 0) +
              (payload.followupInvitations?.length || 0);
            const guestWhatsappCount = payload.sendWhatsAppInvite ? 1 : 0;

            emailCount += guestEmailCount;
            whatsappCount += guestWhatsappCount;

            const hasBeenInvited = await this.invitationRepository.findOne({
              where: {
                event: { id: eventId },
                guest: { id: guestId },
              },
            });

            if (hasBeenInvited) hasPreviouslyInvitedGuests = true;

            // Only accrue chargeable counts based on plan
            if (isPayAsYouGo) {
              chargeableEmailCount += guestEmailCount;
              chargeableWhatsappCount += guestWhatsappCount;
            } else if (isProOrStudio) {
              if (hasBeenInvited) {
                // Pro/Studio: charge for re-invited guests
                chargeableEmailCount += guestEmailCount;
                chargeableWhatsappCount += guestWhatsappCount;
              } else {
                // Pro/Studio: first invite is free. Only charge for follow-up invitations
                chargeableEmailCount += (payload.followupInvitations?.length || 0);
              }
            }

            this.logger.log('[FETCH-GUEST-MANAGER-SUCCESS]');
          } catch (error) {
            this.logger.log(`[FETCH-GUEST-MANAGER-ERROR] :: ${error}`);
          }
        }),
      );

      // Calculate charges once after counting
      const emailDiscount = Number(billing?.emailDiscount || 0);
      const whatsappDiscount = Number(billing?.whatsAppDiscount || 0);
      const effectiveEmailPrice = Number(billing?.pricePerEmail || 0) * (1 - emailDiscount / 100);
      const effectiveWhatsappPrice = Number(billing?.pricePerWhatsappMessage || 0) * (1 - whatsappDiscount / 100);

      const emailRaw = effectiveEmailPrice * chargeableEmailCount;
      const whatsappRaw = effectiveWhatsappPrice * chargeableWhatsappCount;

      const totalEmailCharge = emailRaw > 0 && emailRaw < 100 ? 100 : emailRaw;
      const totalWhatsappCharge = whatsappRaw > 0 && whatsappRaw < 100 ? 100 : whatsappRaw;
      const amountToCharge = totalEmailCharge + totalWhatsappCharge;

      this.logger.log(`[INVITE-EVENT-GUESTS-HANDLER-SUCCESS]`);

      console.log('[BILLING-AMOUNTS]', {
        amountToCharge,
        totalEmailCharge,
        totalWhatsappCharge,
        emailCount,
        whatsappCount,
        chargeableEmailCount,
        chargeableWhatsappCount,
      });

      if (amountToCharge > 0) {
        const reference = TransactionRefHelpers.makeTransactionReference('invite_guests_billing');

        const payloadData = {
          reference,
          email: secureUser.email,
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
                value: String(payload.sendEmailInvite),
              },
              {
                display_name: 'Send WhatsApp Invite',
                variable_name: 'SEND_WHATSAPP_INVITE',
                value: String(payload.sendWhatsAppInvite),
              },
              {
                display_name: 'Followup Invitations',
                variable_name: 'FOLLOWUP_INVITATIONS',
                value: JSON.stringify(payload.followupInvitations ?? []),
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
          amount: Math.round(amountToCharge * 100),
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

        return modelsFormatter.FormatInvitationChargeResponse(
          data,
          amountToCharge,
          totalEmailCharge,
          totalWhatsappCharge,
          0,
          billing.emailDiscount,
          billing.whatsAppDiscount,
          emailCount,
          whatsappCount,
          hasPreviouslyInvitedGuests,
          chargeableEmailCount,
          chargeableWhatsappCount,
        );
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
        emailDiscount: 0,
        whatsAppDiscount: 0,
        emailCount,
        whatsappCount,
        hasPreviouslyInvitedGuests,
        chargeableEmailCount,
        chargeableWhatsappCount,
      };
    } catch (error) {
      this.logger.log(`[INVITE-EVENT-GUESTS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
