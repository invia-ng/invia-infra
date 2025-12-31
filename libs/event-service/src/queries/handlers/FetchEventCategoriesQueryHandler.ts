import { Inject } from '@nestjs/common';
import { FetchEventCategoriesQuery } from '../impl';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { EventCategoryEnum } from '@app/common/src/constants/enums';
import { EventCategoryInfo } from '../../interface/schema';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchEventCategoriesQuery)
export class FetchEventCategoriesQueryHandler implements IQueryHandler<
  FetchEventCategoriesQuery,
  EventCategoryInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  async execute(query: FetchEventCategoriesQuery) {
    try{
			this.logger.log('[FETCH-EVENT-CATEGORIES-QUERY-PROCESSING]');

			const categories = Object.values(EventCategoryEnum);

			this.logger.log('[FETCH-EVENT-CATEGORIES-QUERY-SUCCESS]');

			return modelsFormatter.FormatEventCategoryInfo(categories);
    }catch(error){
			this.logger.error('[FETCH-EVENT-CATEGORIES-QUERY-ERROR]', error);

			throw error;
    }
  }
}
