import { CreateEventHandler } from "./CreateEventHandler";
import { AddEventGuestsHandler } from "./AddEventGuestsHandler";
import { DeleteEventGuestHandler } from "./DeleteEventGuestHandler";

export const EventServiceCommandHandlers = [
    CreateEventHandler,
    AddEventGuestsHandler,
    DeleteEventGuestHandler,
];
