import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { Event } from '@app/common/src/models/event.model';
import authUtils from '@app/common/src/security/auth.utils';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptRejectEventInvitationCommand } from '../../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Guest, GuestTimeline } from '@app/common/src/models/guest.model';
import { Invitation } from '@app/common/src/models/invitation.model';
import { GuestTimelineActionEnum } from '@app/common/src/constants/enums';
import { AcceptRejectEventInvitationInfo } from '@app/event-service/src/interface/schema';
import { EventEmailNotificationService } from '@app/notification-service/src/services/email/event.email.notification.service';

@CommandHandler(AcceptRejectEventInvitationCommand)
export class AcceptRejectEventInvitationHandler implements ICommandHandler<
  AcceptRejectEventInvitationCommand,
  AcceptRejectEventInvitationInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(GuestTimeline)
    private readonly guestTimelineRepository: Repository<GuestTimeline>,
    private readonly eventEmailNotificationService: EventEmailNotificationService,
  ) {}

  async execute(command: AcceptRejectEventInvitationCommand) {
    try {
      this.logger.log(`[ACCEPT-REJECT-EVENT-INVITATION-HANDLER-PROCESSING]`);

      const { invitationHash, acceptInvite, payload } = command;

      const decodedEventInvitationHash =
        authUtils.decodeEventInvitationHash(invitationHash);

      const event = await this.eventRepository.findOne({
        where: {
          id: decodedEventInvitationHash.eventId,
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found.');
      }

      const invitation = await this.invitationRepository.findOne({
        where: {
          guest: {
            id: decodedEventInvitationHash.guestId,
          },
          event: {
            id: decodedEventInvitationHash.eventId,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });

      if (!invitation) {
        throw new NotFoundException('Invitation not found.');
      }

      Object.assign(invitation, {
        isRSVP: acceptInvite,
        rejectionNote: acceptInvite ? '' : payload?.rejectionNote,
      });

      await this.invitationRepository.save(invitation);

      Object.assign(invitation.guest, {
        isInviteRSVP: true,
      });

      await this.guestRepository.save(invitation.guest);

      await this.guestTimelineRepository.save({
        guest: invitation.guest,
        description: acceptInvite
          ? 'Guest accepts the invitation.'
          : 'Guest rejects the invitation.',
        note: acceptInvite ? '' : payload?.rejectionNote,
        action: acceptInvite
          ? GuestTimelineActionEnum.GUEST_ACCEPTED_INVITE
          : GuestTimelineActionEnum.GUEST_REJECTED_INVITE,
      });

      this.eventEmailNotificationService.eventGuestAcceptRejectInvitationEmailNotification(
        {
          invitation,
          isAccept: acceptInvite,
        },
      );

      this.logger.log(`[ACCEPT-REJECT-EVENT-INVITATION-HANDLER-SUCCESS]`);

      return {
        inviteStatus: acceptInvite,
      };
    } catch (error) {
      this.logger.log(
        `[ACCEPT-REJECT-EVENT-INVITATION-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
