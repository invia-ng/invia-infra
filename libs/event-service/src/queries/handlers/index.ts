import { FetchEventsQueryHandler } from "./FetchEventsQueryHandler";
import { FetchEventGuestsQueryHandler } from "./FetchEventGuestsQueryHandler";
import { FetchGuestPartiesQueryHandler } from "./FetchGuestPartiesQueryHandler";
import { FetchEventCategoriesQueryHandler } from "./FetchEventCategoriesQueryHandler";

export const EventServiceQueryHandlers = [
    FetchEventsQueryHandler,
    FetchEventGuestsQueryHandler,
    FetchGuestPartiesQueryHandler,
    FetchEventCategoriesQueryHandler,
];
