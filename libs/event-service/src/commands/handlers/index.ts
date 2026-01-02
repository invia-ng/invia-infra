import { CreateEventHandler } from "./CreateEventHandler";
import { AddEventGuestsHandler } from "./AddEventGuestsHandler";
import { RemoveEventGuestHandler } from "./RemoveEventGuestHandler";
import { CreateMessageTemplateHandler } from "./CreateMessageTemplateHandler";
import { UpdateMessageTemplateHandler } from "./UpdateMessageTemplateHandler";
import { DeleteMessageTemplateHandler } from "./DeleteMessageTemplateHandler";
import { RemoveMultipleEventGuestsHandler } from "./RemoveMultipleEventGuestsHandler";

export const EventServiceCommandHandlers = [
    CreateEventHandler,
    AddEventGuestsHandler,
    RemoveEventGuestHandler,
    DeleteMessageTemplateHandler,
    CreateMessageTemplateHandler,
    UpdateMessageTemplateHandler,
    RemoveMultipleEventGuestsHandler,
];
