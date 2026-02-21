import { Repository } from 'typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { FetchEventGuestInfoQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { EventGuestIdInfo } from '../../interface/schema';
import {
  Guest,
  GuestProfileInfo,
  GuestTimeline,
} from '@app/common/src/models/guest.model';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { AccountRole } from '@app/common/src/constants/enums';

@QueryHandler(FetchEventGuestInfoQuery)
export class FetchEventGuestInfoQueryHandler implements IQueryHandler<
  FetchEventGuestInfoQuery,
  GuestProfileInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(GuestTimeline)
    private readonly guestTimelineRepository: Repository<GuestTimeline>,
  ) { }

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
      });

      const formattedGuestTimelines = guestTimelines.map(
        modelsFormatter.FormatGuestTimelineInfo,
      );

      const formattedGuest = modelsFormatter.FormatGuestInfo(guest, null, secureUser.role === AccountRole.MEMBER);

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
