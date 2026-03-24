import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  Guest,
  GuestTimeline,
  GuestProfileInfo,
} from '@app/common/src/models/guest.model';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import authUtils from '@app/common/src/security/auth.utils';
import { EventAuthorFetchEventGuestInfoQuery } from '../../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Invitation } from '@app/common/src/models/invitation.model';

@QueryHandler(EventAuthorFetchEventGuestInfoQuery)
export class EventAuthorFetchEventGuestInfoQueryHandler implements IQueryHandler<
  EventAuthorFetchEventGuestInfoQuery,
  GuestProfileInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(GuestTimeline)
    private readonly guestTimelineRepository: Repository<GuestTimeline>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) { }

  async execute(query: EventAuthorFetchEventGuestInfoQuery) {
    try {
      this.logger.log('[FETCH-EVENT-GUEST-INFO-QUERY-PROCESSING]');

      const { eventId, guestId, accessToken } = query;

      const isTokenExpired = authUtils.isAccessTokenExpired(accessToken);

      // console.log('[TOKEN] :: ', accessToken, isTokenExpired)

      if (isTokenExpired) {
        this.logger.log('[EVENT-AUTHOR-INVITE-EVENT-GUESTS-HANDLER-ERROR]');

        throw new UnauthorizedException('Invalid access token');
      }

      const guest = await this.guestRepository.findOne({
        where: {
          id: guestId,
          event: {
            id: eventId,
          },
        },
      });

      if (!guest) {
        throw new NotFoundException('Guest not found');
      }

      const guestTimelines = await this.guestTimelineRepository.find({
        where: {
          guest: {
            id: guestId,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });

      const formattedGuestTimelines = guestTimelines.map(
        modelsFormatter.FormatGuestTimelineInfo,
      );

      const invitation = await this.invitationRepository.findOne({
        where: { guest: { id: guest.id }, event: { id: eventId } },
        order: { createdAt: 'DESC' },
      });

      const formattedGuest = modelsFormatter.FormatGuestInfo(guest, invitation);

      this.logger.log('[FETCH-EVENT-GUEST-INFO-QUERY-SUCCESS]');

      return {
        profile: formattedGuest,
        timelines: formattedGuestTimelines,
      } as GuestProfileInfo;
    } catch (error) {
      this.logger.error('[FETCH-EVENT-GUEST-INFO-QUERY-ERROR]', error);

      throw error;
    }
  }
}
