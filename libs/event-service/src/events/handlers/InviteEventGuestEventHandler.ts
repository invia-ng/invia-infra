import { Repository } from 'typeorm';
import { InviteEventGuestEvent } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { GuestTimeline } from '@app/common/src/models/guest.model';
import { Invitation } from '@app/common/src/models/invitation.model';
import { GuestTimelineActionEnum } from '@app/common/src/constants/enums';
import { EventEmailNotificationService } from '@app/notification-service/src/services/email/event.email.notification.service';
import { EventWhatsAppNotificationService } from '@app/notification-service/src/services/email/event.whatsapp.notification.service';

@EventsHandler(InviteEventGuestEvent)
export class InviteEventGuestEventHandler implements IEventHandler<InviteEventGuestEvent> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(GuestTimeline)
    private readonly guestTimelineRepository: Repository<GuestTimeline>,
    private readonly eventEmailNotificationService: EventEmailNotificationService,
    private readonly eventWhatsappNotificationService: EventWhatsAppNotificationService,
  ) { }

  async handle(event: InviteEventGuestEvent) {
    try {
      this.logger.log(
        `[INVITE-EVENT-GUEST-EVENT-PROCESSING]: ${JSON.stringify(event)}`,
      );

      const { invitation, secureUser } = event;

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

      if (invitation.sendEmailInvite) {
        //! SEND EMAIL INVITATION
        const emailResponse =
          await this.eventEmailNotificationService.inviteEventGuestEmailNotification(
            invitation,
          );

        await this.guestTimelineRepository.save({
          guest: invitation.guest,
          description:
            secureUser.name === business.account.name
              ? `You sent an invite message.`
              : `${secureUser.name} sent an invite message.`,
          action: GuestTimelineActionEnum.SENT_INVITE_MESSAGE,
        });

        if (emailResponse) {
          Object.assign(invitation, {
            isSent: true,
            isDelivered: true,
          });

          await this.invitationRepository.save(invitation);

          await this.guestTimelineRepository.save({
            guest: invitation.guest,
            description: 'Email was delivered.',
            action: GuestTimelineActionEnum.EMAIL_DELIVERED,
          });
        } else {
          await Promise.all([
            this.invitationRepository.update(invitation.id, {
              isEmailInviteSent: false,
              isEmailInviteDelivered: false,
            }),
            this.guestTimelineRepository.save({
              guest: invitation.guest,
              description: 'Email failed to deliver.',
              action: GuestTimelineActionEnum.EMAIL_DELIVERED,
            }),
          ]);
        }
      }

      if (invitation.sendWhatsAppInvite) {
        //! SEND WHATSAPP INVITATION
        const whatsappResponse =
          await this.eventWhatsappNotificationService.inviteEventGuestWhatsappNotification(
            invitation,
          );

        await this.guestTimelineRepository.save({
          guest: invitation.guest,
          description:
            secureUser.id === business.account.id
              ? `You sent an invite whatsapp message.`
              : `${secureUser.name} sent an invite whatsapp message.`,
          action: GuestTimelineActionEnum.SENT_INVITE_MESSAGE,
        });

        if (whatsappResponse) {
          Object.assign(invitation, {
            isWhatsappInviteSent: true,
            isWhatsappInviteDelivered: true,
          });

          await this.invitationRepository.save(invitation);

          await this.guestTimelineRepository.save({
            guest: invitation.guest,
            description: 'Whatsapp message was delivered.',
            action: GuestTimelineActionEnum.WHATSAPP_DELIVERED,
          });
        } else {
          await Promise.all([
            this.invitationRepository.update(invitation.id, {
              isWhatsAppInviteSent: false,
              isWhatsAppInviteDelivered: false,
            }),
            this.guestTimelineRepository.save({
              guest: invitation.guest,
              description: 'Whatsapp message failed to deliver.',
              action: GuestTimelineActionEnum.WHATSAPP_DELIVERY_FAILED,
            }),
          ]);
        }
      }

      this.logger.log(`[INVITE-EVENT-GUEST-EVENT-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[INVITE-EVENT-GUEST-EVENT-ERROR]: ${error}`);

      throw error;
    }
  }
}
