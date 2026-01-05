import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { In, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '@app/common/src/models/event.model';
import authUtils from '@app/common/src/security/auth.utils';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptRejectEventInvitationCommand } from '../../impl';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Guest, GuestInfo } from '@app/common/src/models/guest.model';
import { AcceptRejectEventInvitationInfo } from '@app/event-service/src/interface/schema';
import { Invitation } from '@app/common/src/models/invitation.model';

@CommandHandler(AcceptRejectEventInvitationCommand)
export class AcceptRejectEventInvitationHandler
  implements ICommandHandler<AcceptRejectEventInvitationCommand, AcceptRejectEventInvitationInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  async execute(command: AcceptRejectEventInvitationCommand) {
    try {
      this.logger.log(`[ACCEPT-REJECT-EVENT-INVITATION-HANDLER-PROCESSING]`);
      
      const { invitationHash, acceptInvite } = command;

      const decodedEventInvitationHash = authUtils.decodeEventInvitationHash(invitationHash);

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
            id: decodedEventInvitationHash.guestId
          },
          event: {
            id: decodedEventInvitationHash.eventId
          }
        },
      });

      if (!invitation) {
        throw new NotFoundException('Invitation not found.');
      }

      Object.assign(invitation, {
        isRSVP: acceptInvite,
      });

      await this.invitationRepository.save(invitation);

      this.logger.log(`[ACCEPT-REJECT-EVENT-INVITATION-HANDLER-SUCCESS]`);

      return {
        inviteStatus: acceptInvite,
      };
    } catch (error) {
      this.logger.log(`[ACCEPT-REJECT-EVENT-INVITATION-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
