import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { EventAuthorFetchGuestTimelineEnumsQuery } from '../../impl';
import { GuestTimelineActionEnum } from '@app/common/src/constants/enums';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { GuestTimelineActionEnumInfo } from '@app/event-service/src/interface/schema';

@QueryHandler(EventAuthorFetchGuestTimelineEnumsQuery)
export class EventAuthorFetchGuestTimelineEnumsQueryHandler implements IQueryHandler<
  EventAuthorFetchGuestTimelineEnumsQuery,
  GuestTimelineActionEnumInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
  ) { }

  async execute(query: EventAuthorFetchGuestTimelineEnumsQuery) {
    try {
      this.logger.log('[EVENT-AUTHOR-FETCH-GUEST-TIMELINE-ENUMS-HANDLER-PROCESSING]');

      const result = Object.values(GuestTimelineActionEnum)

      this.logger.log('[EVENT-AUTHOR-FETCH-GUEST-TIMELINE-ENUMS-HANDLER-SUCCESS]');

      return modelsFormatter.FormatGuestTimelineActionEnumInfo(result);
    } catch (error) {
      this.logger.error('[EVENT-AUTHOR-FETCH-GUEST-TIMELINE-ENUMS-HANDLER-ERROR]', error);

      throw error;
    }
  }
}
