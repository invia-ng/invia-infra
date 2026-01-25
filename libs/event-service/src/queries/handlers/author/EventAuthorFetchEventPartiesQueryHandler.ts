import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import authUtils from '@app/common/src/security/auth.utils';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { EventAuthorFetchEventPartiesQuery } from '../../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { EventParty, EventPartyInfo } from '@app/common/src/models/event.model';

@QueryHandler(EventAuthorFetchEventPartiesQuery)
export class EventAuthorFetchEventPartiesQueryHandler implements IQueryHandler<
  EventAuthorFetchEventPartiesQuery,
  EventPartyInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(EventParty)
    private readonly eventPartyRepository: Repository<EventParty>,
  ) { }

  async execute(query: EventAuthorFetchEventPartiesQuery) {
    try {
      this.logger.log('[EVENT-AUTHOR-FETCH-EVENT-PARTIES-QUERY-PROCESSING]');

      const { eventId, accessToken } = query;

      const isTokenExpired = authUtils.isAccessTokenExpired(accessToken);

      // console.log('[TOKEN] :: ', accessToken, isTokenExpired)

      if (isTokenExpired) {
        this.logger.log('[EVENT-AUTHOR-FETCH-EVENT-PARTIES-QUERY-ERROR]');

        throw new UnauthorizedException('Invalid access token');
      }

      const parties = await this.eventPartyRepository.find({
        where: {
          event: {
            id: eventId,
          },
        },
      });

      this.logger.log('[EVENT-AUTHOR-FETCH-EVENT-PARTIES-QUERY-SUCCESS]');

      return parties.map(modelsFormatter.FormatEventPartyInfo);
    } catch (error) {
      this.logger.error('[EVENT-AUTHOR-FETCH-EVENT-PARTIES-QUERY-ERROR]', error);

      throw error;
    }
  }
}
