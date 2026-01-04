import { Inject, UnauthorizedException } from '@nestjs/common';
import { Raw, Repository } from 'typeorm';
import { FetchEventAuthorGuestsQuery } from '../../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Guest, GuestsResponse } from '@app/common/src/models/guest.model';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import authUtils from '@app/common/src/security/auth.utils';
import { Event } from '@app/common/src/models/event.model';

@QueryHandler(FetchEventAuthorGuestsQuery)
export class FetchEventAuthorGuestsQueryHandler implements IQueryHandler<
  FetchEventAuthorGuestsQuery,
  GuestsResponse
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}

  async execute(query: FetchEventAuthorGuestsQuery) {
    try{
			this.logger.log('[FETCH-EVENT-AUTHOR-GUESTS-QUERY-PROCESSING]');

      const { page, pageSize, accessToken } = query;

			const isTokenExpired = authUtils.isAccessTokenExpired(accessToken);

			console.log('[TOKEN] :: ', accessToken, isTokenExpired)

			if(isTokenExpired){
				this.logger.log('[FETCH-EVENT-GUESTS-QUERY-ERROR]');

				throw new UnauthorizedException('Invalid access token');
			}

			const decodedToken = authUtils.decodeAccessToken(accessToken);

			const event = await this.eventRepository.findOne({
				where: {
					hash: decodedToken.eventHash
				}
			});

			if(!event){
				this.logger.log('[FETCH-EVENT-GUESTS-QUERY-ERROR]');

				throw new UnauthorizedException('Invalid access token');
			}

      const [guests, totalCount] = await this.guestRepository.findAndCount({
        where: {
          event: {
            id: decodedToken.eventId,
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
				guestParties: guests.map((guest) => guest.party),
				guests: guests.map((guest) => modelsFormatter.FormatGuestInfo(guest)),
			} as unknown as GuestsResponse;
    } catch(error) {
			this.logger.error('[FETCH-EVENT-GUESTS-QUERY-ERROR]', error);

			throw error;
    }
  }
}
