import { UpdateEventHandler } from "./UpdateEventHandler";
import { CreateEventHandler } from "./CreateEventHandler";
import { DeleteEventHandler } from "./DeleteEventHandler";
import { AddEventGuestsHandler } from "./AddEventGuestsHandler";
import { CreateEventPartyHandler } from "./CreateEventPartyHandler";
import { RemoveEventGuestHandler } from "./RemoveEventGuestHandler";
import { InviteEventGuestHandler } from "./InviteEventGuestHandler";
import { DeleteEventPartyHandler } from "./DeleteEventPartyHandler";
import { UpdateEventGuestHandler } from "./UpdateEventGuestHandler";
import { UpdateEventPartyHandler } from "./UpdateEventPartyHandler";
import { InviteEventGuestsHandler } from "./InviteEventGuestsHandler";
import { ExportGuestListHandler } from "./admin/ExportGuestListHandler";
import { CreateMessageTemplateHandler } from "./CreateMessageTemplateHandler";
import { UpdateMessageTemplateHandler } from "./UpdateMessageTemplateHandler";
import { DeleteMessageTemplateHandler } from "./DeleteMessageTemplateHandler";
import { AddEventAuthorGuestsHandler } from "./author/AddEventAuthorGuestsHandler";
import { RemoveMultipleEventGuestsHandler } from "./RemoveMultipleEventGuestsHandler";
import { RemoveEventAuthorGuestHandler } from "./author/RemoveEventAuthorGuestHandler";
import { GenerateShareFormPasscodeHandler } from "./admin/GenerateShareFormPasscodeHandler";
import { AddEventGuestsToPartyCommandHandler } from "./AddEventGuestsToPartyCommandHandler";
import { DeleteFollowupMessageTemplateHandler } from "./DeleteFollowupMessageTemplateHandler";
import { AcceptRejectEventInvitationHandler } from "./guest/AcceptRejectEventInvitationHandler";
import { EventAuthorUpdateEventGuestHandler } from "./author/EventAuthorUpdateEventGuestHandler";
import { EventAuthorInviteEventGuestHandler } from "./author/EventAuthorInviteEventGuestHandler";
import { EventAuthorInviteEventGuestsHandler } from "./author/EventAuthorInviteEventGuestsHandler";
import { AuthenticateShareFormPasscodeHandler } from "./author/AuthenticateShareFormPasscodeHandler";
import { RemoveMultipleEventAuthorGuestsHandler } from "./author/RemoveMultipleEventAuthorGuestsHandler";
import { AuthenticateShareFormPasscodeWithEmailHandler } from "./author/AuthenticateShareFormPasscodeWithEmailHandler";

export const EventServiceCommandHandlers = [
    CreateEventHandler,
    DeleteEventHandler,
    UpdateEventHandler,
    AddEventGuestsHandler,
    ExportGuestListHandler,
    InviteEventGuestHandler,
    DeleteEventPartyHandler,
    UpdateEventGuestHandler,
    RemoveEventGuestHandler,
    UpdateEventPartyHandler,
    CreateEventPartyHandler,
    InviteEventGuestsHandler,
    AddEventAuthorGuestsHandler,
    DeleteMessageTemplateHandler,
    CreateMessageTemplateHandler,
    UpdateMessageTemplateHandler,
    RemoveEventAuthorGuestHandler,
    RemoveMultipleEventGuestsHandler,
    GenerateShareFormPasscodeHandler,
    EventAuthorUpdateEventGuestHandler,
    EventAuthorInviteEventGuestHandler,
    AcceptRejectEventInvitationHandler,
    AddEventGuestsToPartyCommandHandler,
    EventAuthorInviteEventGuestsHandler,
    DeleteFollowupMessageTemplateHandler,
    AuthenticateShareFormPasscodeHandler,
    RemoveMultipleEventAuthorGuestsHandler,
    AuthenticateShareFormPasscodeWithEmailHandler,
];
