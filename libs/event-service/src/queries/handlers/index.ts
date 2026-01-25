import { FetchEventsQueryHandler } from './FetchEventsQueryHandler';
import { FetchEventInfoQueryHandler } from './FetchEventInfoQueryHandler';
import { FetchEventGuestsQueryHandler } from './FetchEventGuestsQueryHandler';
import { FetchEventPartiesQueryHandler } from './FetchEventPartiesQueryHandler';
import { FetchGuestPartiesQueryHandler } from './FetchGuestPartiesQueryHandler';
import { SearchEventGuestsQueryHandler } from './SearchEventGuestsQueryHandler';
import { FetchEventGuestIdsQueryHandler } from './FetchEventGuestIdsQueryHandler';
import { FetchEventGuestInfoQueryHandler } from './FetchEventGuestInfoQueryHandler';
import { FetchEventCategoriesQueryHandler } from './FetchEventCategoriesQueryHandler';
import { FetchMessageTemplatesQueryHandler } from './FetchMessageTemplatesQueryHandler';
import { FetchEventAuthorGuestsQueryHandler } from './author/FetchEventAuthorGuestsQuery';
import { FetchShareFormPasscodeQueryHandler } from './admin/FetchShareFormPasscodeQueryHandler';
import { EventAuthorFetchEventInfoQueryHandler } from './author/EventAuthorFetchEventInfoQueryHandler';
import { FetchMessageTemplateVariablesQueryHandler } from './FetchMessageTemplateVariablesQueryHandler';
import { EventAuthorFetchEventPartiesQueryHandler } from './author/EventAuthorFetchEventPartiesQueryHandler';
import { EventAuthorSearchEventGuestsQueryHandler } from './author/EventAuthorSearchEventGuestsQueryHandler';
import { EventAuthorFetchEventGuestIdsQueryHandler } from './author/EventAuthorFetchEventGuestIdsQueryHandler';
import { EventAuthorFetchEventGuestInfoQueryHandler } from './author/EventAuthorFetchEventGuestInfoQueryHandler';
import { FetchMessageTemplateFollowupIntervalsQueryHandler } from './FetchMessageTemplateFollowupIntervalsQueryHandler';
import { EventAuthorFetchGuestTimelineEnumsQueryHandler } from './author/EventAuthorFetchGuestTimelineEnumsQueryHandler';
import { FetchMessageTemplateFollowupConditionsQueryHandler } from './FetchMessageTemplateFollowupConditionsQueryHandler';

export const EventServiceQueryHandlers = [
  FetchEventsQueryHandler,
  FetchEventInfoQueryHandler,
  FetchEventGuestsQueryHandler,
  FetchEventPartiesQueryHandler,
  SearchEventGuestsQueryHandler,
  FetchGuestPartiesQueryHandler,
  FetchEventGuestIdsQueryHandler,
  FetchEventGuestInfoQueryHandler,
  FetchEventCategoriesQueryHandler,
  FetchMessageTemplatesQueryHandler,
  FetchShareFormPasscodeQueryHandler,
  FetchEventAuthorGuestsQueryHandler,
  EventAuthorFetchEventInfoQueryHandler,
  EventAuthorFetchEventPartiesQueryHandler,
  EventAuthorSearchEventGuestsQueryHandler,
  EventAuthorFetchEventGuestIdsQueryHandler,
  FetchMessageTemplateVariablesQueryHandler,
  EventAuthorFetchEventGuestInfoQueryHandler,
  EventAuthorFetchGuestTimelineEnumsQueryHandler,
  FetchMessageTemplateFollowupIntervalsQueryHandler,
  FetchMessageTemplateFollowupConditionsQueryHandler,
];
