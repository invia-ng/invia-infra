import { Repository } from 'typeorm';
import {
  Event,
  EventInfo,
  EventsResponse,
} from '@app/common/src/models/event.model';
import { FetchEventInfoQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { Guest } from '@app/common/src/models/guest.model';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Invitation } from '@app/common/src/models/invitation.model';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchEventInfoQuery)
export class FetchEventInfoQueryHandler implements IQueryHandler<
  FetchEventInfoQuery,
  EventInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) { }

  async execute(query: FetchEventInfoQuery) {
    try {
      this.logger.log('[FETCH-EVENT=INFO-QUERY-PROCESSING]');

      const { eventId, secureUser } = query;

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

      const event = await this.eventRepository.findOne({
        where: {
          id: eventId,
          business: {
            id: business.id,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });

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
      const sentInvites = invitations.filter((invite) => invite.isEmailInviteSent || invite.isWhatsAppInviteSent).length;
      const acceptedInvites = invitations.filter(
        (invite) => invite.isRSVP === true,
      ).length;
      const pendingInvites = invitations.filter(
        (invite) => invite.isEmailInviteSent === false && invite.isWhatsAppInviteSent === false,
      ).length;
      const failedInvites = invitations.filter(
        (invite) => invite.isEmailInviteDelivered === false && invite.isWhatsAppInviteDelivered === false,
      ).length;

      this.logger.log('[FETCH-EVENT=INFO-QUERY-SUCCESS]');

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
      this.logger.error('[FETCH-EVENT=INFO-QUERY-ERROR]', error);

      throw error;
    }
  }
} 
