import { Inject } from '@nestjs/common';
import { FetchMessageTemplateVariablesQuery } from '../impl';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { EventCategoryEnum, MessageTemplateEnum } from '@app/common/src/constants/enums';
import { MessageTemplateEnumInfo } from '../../interface/schema';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchMessageTemplateVariablesQuery)
export class FetchMessageTemplateVariablesQueryHandler implements IQueryHandler<
  FetchMessageTemplateVariablesQuery,
  MessageTemplateEnumInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  async execute(query: FetchMessageTemplateVariablesQuery) {
    try{
			this.logger.log('[FETCH-MESSAGE-TEMPLATE-VARIABLES-QUERY-PROCESSING]');

			const categories = Object.values(MessageTemplateEnum);

			this.logger.log('[FETCH-MESSAGE-TEMPLATE-VARIABLES-QUERY-SUCCESS]');

			return modelsFormatter.FormatMessageTemplateEnumInfo(categories);
    }catch(error){
			this.logger.error('[FETCH-MESSAGE-TEMPLATE-VARIABLES-QUERY-ERROR]', error);

			throw error;
    }
  }
}
