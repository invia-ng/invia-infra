import { Inject } from '@nestjs/common';
import { FetchGuestPartyQuery } from '../impl';
import { GuestPartyInfo } from '../../interface/schema';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GuestPartyEnum } from '@app/common/src/constants/enums';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchGuestPartyQuery)
export class FetchGuestPartiesQueryHandler implements IQueryHandler<
  FetchGuestPartyQuery,
  GuestPartyInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  async execute(query: FetchGuestPartyQuery) {
    try{
			this.logger.log('[FETCH-GUEST-PARTIES-QUERY-PROCESSING]');

			const categories = Object.values(GuestPartyEnum);

			this.logger.log('[FETCH-GUEST-PARTIES-QUERY-SUCCESS]');

			return modelsFormatter.FormatGuestPartyInfo(categories);
    }catch(error){
			this.logger.error('[FETCH-GUEST-PARTIES-QUERY-ERROR]', error);

			throw error;
    }
  }
}
