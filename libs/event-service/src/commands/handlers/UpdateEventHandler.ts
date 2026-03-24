import { Repository } from 'typeorm';
import { UpdateEventCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from '@app/common/src/models/guest.model';
import { AccountRole } from '@app/common/src/constants/enums';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Invitation } from '@app/common/src/models/invitation.model';
import { Event, EventInfo } from '@app/common/src/models/event.model';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { ForbiddenException, Inject, UnauthorizedException } from '@nestjs/common';

@CommandHandler(UpdateEventCommand)
export class UpdateEventHandler implements ICommandHandler<
  UpdateEventCommand,
  EventInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) { }

  async execute(command: UpdateEventCommand) {
    try {
      this.logger.log(`[UPDATE-EVENT-HANDLER-PROCESSING]`);

      const { eventId, payload, secureUser } = command;

      if (secureUser.role === AccountRole.MEMBER) {
        throw new ForbiddenException(
          'You do not have permission to update events.',
        );
      }

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
        throw new UnauthorizedException('Business not found.');
      }

      const event = await this.eventRepository.findOne({
        where: {
          id: eventId,
        },
      });

      if (!event) {
        throw new UnauthorizedException('Event not found.');
      }

      Object.assign(event, {
        name: payload.name,
        date: payload.date,
        time: payload.time,
        location: payload.location,
        category: payload.category,
      });

      const updatedEvent = await this.eventRepository.save(event);

      const guests = await this.guestRepository.count({
        where: {
          event: {
            id: eventId,
          },
        },
      });

      const invitations = await this.invitationRepository.find({
        where: {
          event: {
            id: eventId,
          },
        },
      });

      const totalInvites = invitations.length;
      const sentInvites = invitations.filter((invite) => invite.isEmailInviteSent).length;
      const acceptedInvites = invitations.filter(
        (invite) => invite.isRSVP === true,
      ).length;
      const pendingInvites = invitations.filter(
        (invite) => invite.isEmailInviteSent === false,
      ).length;
      const failedInvites = invitations.filter(
        (invite) => invite.isEmailInviteDelivered === false && invite.isWhatsAppInviteDelivered === false,
      ).length;

      this.logger.log(`[UPDATE-EVENT-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatEventInfo(
        event,
        guests,
        totalInvites,
        sentInvites,
        acceptedInvites,
        pendingInvites,
        failedInvites,
      );
    } catch (error) {
      this.logger.log(`[UPDATE-EVENT-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
