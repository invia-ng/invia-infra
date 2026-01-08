import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { FetchEventPartiesQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { EventParty, EventPartyInfo } from '@app/common/src/models/event.model';

@QueryHandler(FetchEventPartiesQuery)
export class FetchEventPartiesQueryHandler implements IQueryHandler<
  FetchEventPartiesQuery,
  EventPartyInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(EventParty)
    private readonly eventPartyRepository: Repository<EventParty>,
  ) {}

  async execute(query: FetchEventPartiesQuery) {
    try {
      this.logger.log('[FETCH-EVENT-GUESTS-QUERY-PROCESSING]');

      const { eventId, secureUser } = query;

      const parties = await this.eventPartyRepository.find({
        where: {
          event: {
            id: eventId,
          },
        },
      });

      this.logger.log('[FETCH-EVENT-GUESTS-QUERY-SUCCESS]');

      return parties.map(modelsFormatter.FormatEventPartyInfo);
    } catch (error) {
      this.logger.error('[FETCH-EVENT-GUESTS-QUERY-ERROR]', error);

      throw error;
    }
  }
}
