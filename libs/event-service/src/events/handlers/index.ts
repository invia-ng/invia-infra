import { InviteEventGuestEventHandler } from './InviteEventGuestEventHandler';
import { InviteEventGuestsEventHandler } from './InviteEventGuestsEventHandler';
import { CreateNewEventPartyEventHandler } from './CreateNewEventPartyEventHandler';
import { ReplaceEventGuestPartyEventHandler } from './ReplaceEventGuestPartyEventHandler';
import { EventAuthorInviteEventGuestEventHandler } from './EventAuthorInviteEventGuestEventHandler';
import { EventAuthorInviteEventGuestsEventHandler } from './EventAuthorInviteEventGuestsEventHandler';
import { ProcessGuestEventInvitationAsSeenEventHandler } from './ProcessGuestEventInvitationAsSeenEventHandler';

export const EventServiceEventHandlers = [
  InviteEventGuestEventHandler,
  InviteEventGuestsEventHandler,
  CreateNewEventPartyEventHandler,
  ReplaceEventGuestPartyEventHandler,
  EventAuthorInviteEventGuestEventHandler,
  EventAuthorInviteEventGuestsEventHandler,
  ProcessGuestEventInvitationAsSeenEventHandler,
];
