import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from '@app/common/src/models/guest.model';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import authUtils from '@app/common/src/security/auth.utils';
import { EventGuestIdInfo } from '../../../interface/schema';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { EventAuthorFetchEventGuestIdsQuery } from '../../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(EventAuthorFetchEventGuestIdsQuery)
export class EventAuthorFetchEventGuestIdsQueryHandler implements IQueryHandler<
  EventAuthorFetchEventGuestIdsQuery,
  EventGuestIdInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}

  async execute(query: EventAuthorFetchEventGuestIdsQuery) {
    try {
      this.logger.log('[FETCH-EVENT-GUEST-INFO-QUERY-PROCESSING]');

      const { eventId, accessToken } = query;

      const isTokenExpired = authUtils.isAccessTokenExpired(accessToken);

      // console.log('[TOKEN] :: ', accessToken, isTokenExpired)

      if (isTokenExpired) {
        this.logger.log('[EVENT-AUTHOR-INVITE-EVENT-GUESTS-HANDLER-ERROR]');

        throw new UnauthorizedException('Invalid access token');
      }

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
