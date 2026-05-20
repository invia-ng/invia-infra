import { Repository } from 'typeorm';
import {
  Guest,
  GuestProfileInfo,
  GuestTimeline,
} from '@app/common/src/models/guest.model';
import { FetchEventGuestInfoQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { EventGuestIdInfo } from '../../interface/schema';
import { Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AccountRole } from '@app/common/src/constants/enums';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Invitation } from '@app/common/src/models/invitation.model';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchEventGuestInfoQuery)
export class FetchEventGuestInfoQueryHandler implements IQueryHandler<
  FetchEventGuestInfoQuery,
  GuestProfileInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(GuestTimeline)
    private readonly guestTimelineRepository: Repository<GuestTimeline>,
  ) {}

  async execute(query: FetchEventGuestInfoQuery) {
    try {
      this.logger.log('[FETCH-EVENT-GUEST-INFO-QUERY-PROCESSING]');

      const { eventId, guestId, secureUser } = query;

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

      const invitation = await this.invitationRepository.findOne({
        where: {
          guest: {
            id: guest.id,
          },
          event: {
            id: eventId,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });

      const formattedGuestTimelines = guestTimelines.map(
        modelsFormatter.FormatGuestTimelineInfo,
      );

      const formattedGuest = modelsFormatter.FormatGuestInfo(
        guest,
        invitation ?? null,
        secureUser.role === AccountRole.MEMBER,
      );

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
