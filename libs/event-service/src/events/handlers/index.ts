import { InviteEventGuestsEventHandler } from './InviteEventGuestsEventHandler';
import { ReplaceEventGuestPartyEventHandler } from './ReplaceEventGuestPartyEventHandler';
import { EventAuthorInviteEventGuestEventHandler } from './EventAuthorInviteEventGuestEventHandler';
import { EventAuthorInviteEventGuestsEventHandler } from './EventAuthorInviteEventGuestsEventHandler';

export const EventServiceEventHandlers = [
  InviteEventGuestsEventHandler,
  ReplaceEventGuestPartyEventHandler,
  EventAuthorInviteEventGuestEventHandler,
  EventAuthorInviteEventGuestsEventHandler,
];
