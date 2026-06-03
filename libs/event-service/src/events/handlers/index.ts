import { InviteEventGuestsEventHandler } from './InviteEventGuestsEventHandler';
import { CreateNewEventPartyEventHandler } from './CreateNewEventPartyEventHandler';
import { ReplaceEventGuestPartyEventHandler } from './ReplaceEventGuestPartyEventHandler';
import { EventAuthorInviteEventGuestEventHandler } from './EventAuthorInviteEventGuestEventHandler';
import { EventAuthorInviteEventGuestsEventHandler } from './EventAuthorInviteEventGuestsEventHandler';
import { InviteEventGuestEventHandler } from './InviteEventGuestEventHandler';

export const EventServiceEventHandlers = [
  InviteEventGuestEventHandler,
  InviteEventGuestsEventHandler,
  CreateNewEventPartyEventHandler,
  ReplaceEventGuestPartyEventHandler,
  EventAuthorInviteEventGuestEventHandler,
  EventAuthorInviteEventGuestsEventHandler,
];
