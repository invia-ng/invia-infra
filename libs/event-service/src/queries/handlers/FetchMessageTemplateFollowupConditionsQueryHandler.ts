import { Inject } from '@nestjs/common';
import { FetchMessageTemplateFollowupConditionsQuery } from '../impl';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { FollowupConditionEnum } from '@app/common/src/constants/enums';
import { MessageTemplateFollowupConditionInfo } from '../../interface/schema';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchMessageTemplateFollowupConditionsQuery)
export class FetchMessageTemplateFollowupConditionsQueryHandler implements IQueryHandler<
  FetchMessageTemplateFollowupConditionsQuery,
  MessageTemplateFollowupConditionInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  async execute(query: FetchMessageTemplateFollowupConditionsQuery) {
    try{
			this.logger.log('[FETCH-MESSAGE-TEMPLATE-FOLLOWUP-CONDITIONS-QUERY-PROCESSING]');

			const categories = Object.values(FollowupConditionEnum);

			this.logger.log('[FETCH-MESSAGE-TEMPLATE-FOLLOWUP-CONDITIONS-QUERY-SUCCESS]');

			return modelsFormatter.FormatMessageFollowupConditionInfo(categories);
    }catch(error){
			this.logger.error('[FETCH-MESSAGE-TEMPLATE-FOLLOWUP-CONDITIONS-QUERY-ERROR]', error);

			throw error;
    }
  }
}
