import { UpdateEventHandler } from "./UpdateEventHandler";
import { CreateEventHandler } from "./CreateEventHandler";
import { DeleteEventHandler } from "./DeleteEventHandler";
import { AddEventGuestsHandler } from "./AddEventGuestsHandler";
import { CreateEventPartyHandler } from "./CreateEventPartyHandler";
import { RemoveEventGuestHandler } from "./RemoveEventGuestHandler";
import { DeleteEventPartyHandler } from "./DeleteEventPartyHandler";
import { InviteEventGuestsHandler } from "./InviteEventGuestsHandler";
import { ExportGuestListHandler } from "./admin/ExportGuestListHandler";
import { CreateMessageTemplateHandler } from "./CreateMessageTemplateHandler";
import { UpdateMessageTemplateHandler } from "./UpdateMessageTemplateHandler";
import { DeleteMessageTemplateHandler } from "./DeleteMessageTemplateHandler";
import { AddEventAuthorGuestsHandler } from "./author/AddEventAuthorGuestsHandler";
import { RemoveMultipleEventGuestsHandler } from "./RemoveMultipleEventGuestsHandler";
import { RemoveEventAuthorGuestHandler } from "./author/RemoveEventAuthorGuestHandler";
import { GenerateShareFormPasscodeHandler } from "./admin/GenerateShareFormPasscodeHandler";
import { AcceptRejectEventInvitationHandler } from "./guest/AcceptRejectEventInvitationHandler";
import { EventAuthorInviteEventGuestsHandler } from "./author/EventAuthorInviteEventGuestsHandler";
import { AuthenticateShareFormPasscodeHandler } from "./author/AuthenticateShareFormPasscodeHandler";
import { RemoveMultipleEventAuthorGuestsHandler } from "./author/RemoveMultipleEventAuthorGuestsHandler";

export const EventServiceCommandHandlers = [
    CreateEventHandler,
    DeleteEventHandler,
    UpdateEventHandler,
    AddEventGuestsHandler,
    ExportGuestListHandler,
    DeleteEventPartyHandler,
    RemoveEventGuestHandler,
    CreateEventPartyHandler,
    InviteEventGuestsHandler,
    AddEventAuthorGuestsHandler,
    DeleteMessageTemplateHandler,
    CreateMessageTemplateHandler,
    UpdateMessageTemplateHandler,
    RemoveEventAuthorGuestHandler,
    RemoveMultipleEventGuestsHandler,
    GenerateShareFormPasscodeHandler,
    AcceptRejectEventInvitationHandler,
    EventAuthorInviteEventGuestsHandler,
    AuthenticateShareFormPasscodeHandler,
    RemoveMultipleEventAuthorGuestsHandler,
];
