import { Repository } from 'typeorm';
import {
  Event,
  EventInfo,
} from '@app/common/src/models/event.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from '@app/common/src/models/guest.model';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { EventAuthorFetchEventInfoQuery } from '../../impl';
import authUtils from '@app/common/src/security/auth.utils';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Invitation } from '@app/common/src/models/invitation.model';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(EventAuthorFetchEventInfoQuery)
export class EventAuthorFetchEventInfoQueryHandler implements IQueryHandler<
  EventAuthorFetchEventInfoQuery,
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

  async execute(query: EventAuthorFetchEventInfoQuery) {
    try {
      this.logger.log('[EVENT-AUTHOR-FETCH-EVENT-INFO-QUERY-PROCESSING]');

      const { eventId, accessToken } = query;

      const isTokenExpired = authUtils.isAccessTokenExpired(accessToken);

      // console.log('[TOKEN] :: ', accessToken, isTokenExpired)

      if (isTokenExpired) {
        this.logger.log('[EVENT-AUTHOR-INVITE-EVENT-GUESTS-HANDLER-ERROR]');

        throw new UnauthorizedException('Invalid access token');
      }

      const event = await this.eventRepository.findOne({
        where: {
          id: eventId,
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
        (invite) => invite.isEmailInviteSent === false || invite.isWhatsAppInviteSent === false,
      ).length;
      const failedInvites = invitations.filter(
        (invite) => invite.isEmailInviteDelivered === false || invite.isWhatsAppInviteDelivered === false,
      ).length;

      this.logger.log('[EVENT-AUTHOR-FETCH-EVENT-INFO-QUERY-SUCCESS]');

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
      this.logger.error('[EVENT-AUTHOR-FETCH-EVENT-INFO-QUERY-ERROR]', error);

      throw error;
    }
  }
}
