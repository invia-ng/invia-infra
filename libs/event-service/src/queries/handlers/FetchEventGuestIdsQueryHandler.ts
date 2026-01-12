import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { FetchEventGuestIdsQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { EventGuestIdInfo } from '../../interface/schema';
import { Guest } from '@app/common/src/models/guest.model';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchEventGuestIdsQuery)
export class FetchEventGuestIdsQueryHandler implements IQueryHandler<
  FetchEventGuestIdsQuery,
  EventGuestIdInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}

  async execute(query: FetchEventGuestIdsQuery) {
    try {
      this.logger.log('[FETCH-EVENT-GUEST-INFO-QUERY-PROCESSING]');

      const { eventId, secureUser } = query;

      const guests = await this.guestRepository.find({
        where: {
          event: {
            id: eventId,
          },
        },
        select: {
          id: true,
          party: true,
        },
      });

      this.logger.log('[FETCH-EVENT-GUEST-INFO-QUERY-SUCCESS]');

      return guests.map(modelsFormatter.FormatEventGuestIdInfo);
    } catch (error) {
      this.logger.error('[FETCH-EVENT-GUEST-INFO-QUERY-ERROR]', error);

      throw error;
    }
  }
}
