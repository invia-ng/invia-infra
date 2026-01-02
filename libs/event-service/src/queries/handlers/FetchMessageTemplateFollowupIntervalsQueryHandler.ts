import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { FetchMessageTemplateFollowupIntervalsQuery } from '../impl';
import { FollowupIntervalEnum } from '@app/common/src/constants/enums';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { MessageTemplateFollowupIntervalInfo } from '../../interface/schema';

@QueryHandler(FetchMessageTemplateFollowupIntervalsQuery)
export class FetchMessageTemplateFollowupIntervalsQueryHandler implements IQueryHandler<
  FetchMessageTemplateFollowupIntervalsQuery,
  MessageTemplateFollowupIntervalInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  async execute(query: FetchMessageTemplateFollowupIntervalsQuery) {
    try {
			this.logger.log('[FETCH-MESSAGE-TEMPLATE-FOLLOWUP-INTERVALS-QUERY-PROCESSING]');

			const categories = Object.values(FollowupIntervalEnum);

			this.logger.log('[FETCH-MESSAGE-TEMPLATE-FOLLOWUP-INTERVALS-QUERY-SUCCESS]');

			return modelsFormatter.FormatMessageFollowupIntervalInfo(categories);
    } catch(error) {
			this.logger.error('[FETCH-MESSAGE-TEMPLATE-FOLLOWUP-INTERVALS-QUERY-ERROR]', error);

			throw error;
    }
  }
}
