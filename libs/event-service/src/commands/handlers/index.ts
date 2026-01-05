import { CreateEventHandler } from "./CreateEventHandler";
import { AddEventGuestsHandler } from "./AddEventGuestsHandler";
import { RemoveEventGuestHandler } from "./RemoveEventGuestHandler";
import { InviteEventGuestsHandler } from "./InviteEventGuestsHandler";
import { CreateMessageTemplateHandler } from "./CreateMessageTemplateHandler";
import { UpdateMessageTemplateHandler } from "./UpdateMessageTemplateHandler";
import { DeleteMessageTemplateHandler } from "./DeleteMessageTemplateHandler";
import { AddEventAuthorGuestsHandler } from "./author/AddEventAuthorGuestsHandler";
import { RemoveMultipleEventGuestsHandler } from "./RemoveMultipleEventGuestsHandler";
import { RemoveEventAuthorGuestHandler } from "./author/RemoveEventAuthorGuestHandler";
import { GenerateShareFormPasscodeHandler } from "./admin/GenerateShareFormPasscodeHandler";
import { AcceptRejectEventInvitationHandler } from "./guest/AcceptRejectEventInvitationHandler";
import { AuthenticateShareFormPasscodeHandler } from "./author/AuthenticateShareFormPasscodeHandler";
import { RemoveMultipleEventAuthorGuestsHandler } from "./author/RemoveMultipleEventAuthorGuestsHandler";

export const EventServiceCommandHandlers = [
    CreateEventHandler,
    AddEventGuestsHandler,
    RemoveEventGuestHandler,
    InviteEventGuestsHandler,
    AddEventAuthorGuestsHandler,
    DeleteMessageTemplateHandler,
    CreateMessageTemplateHandler,
    UpdateMessageTemplateHandler,
    RemoveEventAuthorGuestHandler,
    RemoveMultipleEventGuestsHandler,
    GenerateShareFormPasscodeHandler,
    AcceptRejectEventInvitationHandler,
    AuthenticateShareFormPasscodeHandler,
    RemoveMultipleEventAuthorGuestsHandler,
];
