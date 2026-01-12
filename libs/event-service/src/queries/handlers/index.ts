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
import { FetchMessageTemplateVariablesQueryHandler } from './FetchMessageTemplateVariablesQueryHandler';
import { EventAuthorFetchEventGuestIdsQueryHandler } from './author/EventAuthorFetchEventGuestIdsQueryHandler';
import { EventAuthorFetchEventGuestInfoQueryHandler } from './author/EventAuthorFetchEventGuestInfoQueryHandler';
import { FetchMessageTemplateFollowupIntervalsQueryHandler } from './FetchMessageTemplateFollowupIntervalsQueryHandler';
import { FetchMessageTemplateFollowupConditionsQueryHandler } from './FetchMessageTemplateFollowupConditionsQueryHandler';
import { EventAuthorSearchEventGuestsQueryHandler } from './author/EventAuthorSearchEventGuestsQueryHandler';

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
  FetchEventAuthorGuestsQueryHandler,
  EventAuthorSearchEventGuestsQueryHandler,
  EventAuthorFetchEventGuestIdsQueryHandler,
  FetchMessageTemplateVariablesQueryHandler,
  EventAuthorFetchEventGuestInfoQueryHandler,
  FetchMessageTemplateFollowupIntervalsQueryHandler,
  FetchMessageTemplateFollowupConditionsQueryHandler,
];
