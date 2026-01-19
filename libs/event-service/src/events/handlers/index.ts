import { InviteEventGuestsEventHandler } from './InviteEventGuestsEventHandler';
import { CreateNewEventPartyEventHandler } from './CreateNewEventPartyEventHandler';
import { ReplaceEventGuestPartyEventHandler } from './ReplaceEventGuestPartyEventHandler';
import { EventAuthorInviteEventGuestEventHandler } from './EventAuthorInviteEventGuestEventHandler';
import { EventAuthorInviteEventGuestsEventHandler } from './EventAuthorInviteEventGuestsEventHandler';

export const EventServiceEventHandlers = [
  InviteEventGuestsEventHandler,
  CreateNewEventPartyEventHandler,
  ReplaceEventGuestPartyEventHandler,
  EventAuthorInviteEventGuestEventHandler,
  EventAuthorInviteEventGuestsEventHandler,
];
