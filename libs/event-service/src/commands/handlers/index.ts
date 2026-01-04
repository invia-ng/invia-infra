import { CreateEventHandler } from "./CreateEventHandler";
import { AddEventGuestsHandler } from "./AddEventGuestsHandler";
import { RemoveEventGuestHandler } from "./RemoveEventGuestHandler";
import { CreateMessageTemplateHandler } from "./CreateMessageTemplateHandler";
import { UpdateMessageTemplateHandler } from "./UpdateMessageTemplateHandler";
import { DeleteMessageTemplateHandler } from "./DeleteMessageTemplateHandler";
import { AddEventAuthorGuestsHandler } from "./author/AddEventAuthorGuestsHandler";
import { RemoveMultipleEventGuestsHandler } from "./RemoveMultipleEventGuestsHandler";
import { RemoveEventAuthorGuestHandler } from "./author/RemoveEventAuthorGuestHandler";
import { GenerateShareFormPasscodeHandler } from "./admin/GenerateShareFormPasscodeHandler";
import { AuthenticateShareFormPasscodeHandler } from "./author/AuthenticateShareFormPasscodeHandler";
import { RemoveMultipleEventAuthorGuestsHandler } from "./author/RemoveMultipleEventAuthorGuestsHandler";

export const EventServiceCommandHandlers = [
    CreateEventHandler,
    AddEventGuestsHandler,
    RemoveEventGuestHandler,
    AddEventAuthorGuestsHandler,
    DeleteMessageTemplateHandler,
    CreateMessageTemplateHandler,
    UpdateMessageTemplateHandler,
    RemoveEventAuthorGuestHandler,
    RemoveMultipleEventGuestsHandler,
    GenerateShareFormPasscodeHandler,
    AuthenticateShareFormPasscodeHandler,
    RemoveMultipleEventAuthorGuestsHandler,
];
