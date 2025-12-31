import { Raw, Repository } from 'typeorm';
import { FetchEventGuestsQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Guest, GuestsResponse } from '@app/common/src/models/guest.model';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchEventGuestsQuery)
export class FetchEventGuestsQueryHandler implements IQueryHandler<
  FetchEventGuestsQuery,
  GuestsResponse
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async execute(query: FetchEventGuestsQuery) {
    try{
			this.logger.log('[FETCH-EVENT-GUESTS-QUERY-PROCESSING]');

      const { page, pageSize, eventId, secureUser } = query;

      const [guests, totalCount] = await this.guestRepository.findAndCount({
        where: {
          event: {
            id: eventId,
          },
        },
        order: {
          createdAt: 'DESC',
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNext = page < totalPages;

			this.logger.log('[FETCH-EVENT-GUESTS-QUERY-SUCCESS]');

			return {
        hasNext,
        totalPages,
        totalInvites: totalCount,
				guests: guests.map((guest) => modelsFormatter.FormatGuestInfo(guest)),
			} as unknown as GuestsResponse;
    }catch(error){
			this.logger.error('[FETCH-EVENT-GUESTS-QUERY-ERROR]', error);

			throw error;
    }
  }
}
