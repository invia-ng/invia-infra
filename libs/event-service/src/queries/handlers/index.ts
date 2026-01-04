import { FetchEventsQueryHandler } from "./FetchEventsQueryHandler";
import { FetchEventGuestsQueryHandler } from "./FetchEventGuestsQueryHandler";
import { FetchGuestPartiesQueryHandler } from "./FetchGuestPartiesQueryHandler";
import { FetchEventCategoriesQueryHandler } from "./FetchEventCategoriesQueryHandler";
import { FetchMessageTemplatesQueryHandler } from "./FetchMessageTemplatesQueryHandler";
import { FetchEventAuthorGuestsQueryHandler } from "./author/FetchEventAuthorGuestsQuery";
import { FetchMessageTemplateVariablesQueryHandler } from "./FetchMessageTemplateVariablesQueryHandler";
import { FetchMessageTemplateFollowupIntervalsQueryHandler } from "./FetchMessageTemplateFollowupIntervalsQueryHandler";
import { FetchMessageTemplateFollowupConditionsQueryHandler } from "./FetchMessageTemplateFollowupConditionsQueryHandler";

export const EventServiceQueryHandlers = [
    FetchEventsQueryHandler,
    FetchEventGuestsQueryHandler,
    FetchGuestPartiesQueryHandler,
    FetchEventCategoriesQueryHandler,
    FetchMessageTemplatesQueryHandler,
    FetchEventAuthorGuestsQueryHandler,
    FetchMessageTemplateVariablesQueryHandler,
    FetchMessageTemplateFollowupIntervalsQueryHandler,
    FetchMessageTemplateFollowupConditionsQueryHandler,
];
