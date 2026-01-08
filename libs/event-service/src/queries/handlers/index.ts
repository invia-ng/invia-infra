import { FetchEventsQueryHandler } from "./FetchEventsQueryHandler";
import { FetchEventInfoQueryHandler } from "./FetchEventInfoQueryHandler";
import { FetchEventGuestsQueryHandler } from "./FetchEventGuestsQueryHandler";
import { FetchEventPartiesQueryHandler } from "./FetchEventPartiesQueryHandler";
import { FetchGuestPartiesQueryHandler } from "./FetchGuestPartiesQueryHandler";
import { FetchEventCategoriesQueryHandler } from "./FetchEventCategoriesQueryHandler";
import { FetchMessageTemplatesQueryHandler } from "./FetchMessageTemplatesQueryHandler";
import { FetchEventAuthorGuestsQueryHandler } from "./author/FetchEventAuthorGuestsQuery";
import { FetchMessageTemplateVariablesQueryHandler } from "./FetchMessageTemplateVariablesQueryHandler";
import { FetchMessageTemplateFollowupIntervalsQueryHandler } from "./FetchMessageTemplateFollowupIntervalsQueryHandler";
import { FetchMessageTemplateFollowupConditionsQueryHandler } from "./FetchMessageTemplateFollowupConditionsQueryHandler";

export const EventServiceQueryHandlers = [
    FetchEventsQueryHandler,
    FetchEventInfoQueryHandler,
    FetchEventGuestsQueryHandler,
    FetchEventPartiesQueryHandler,
    FetchGuestPartiesQueryHandler,
    FetchEventCategoriesQueryHandler,
    FetchMessageTemplatesQueryHandler,
    FetchEventAuthorGuestsQueryHandler,
    FetchMessageTemplateVariablesQueryHandler,
    FetchMessageTemplateFollowupIntervalsQueryHandler,
    FetchMessageTemplateFollowupConditionsQueryHandler,
];
