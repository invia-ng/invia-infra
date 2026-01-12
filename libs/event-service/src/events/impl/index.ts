import { SecureUserPayload } from '@app/common/src/interface';
import { Invitation } from '@app/common/src/models/invitation.model';

export class InviteEventGuestEvent {
  constructor(
    public readonly invitation: Invitation,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class EventAuthorInviteEventGuestEvent {
  constructor(
    public readonly invitation: Invitation,
    public readonly accessToken: string,
  ) {}
}

export class InviteEventGuestsEvent {
  constructor(
    public readonly invitations: Invitation[],
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class EventAuthorInviteEventGuestsEvent {
  constructor(
    public readonly invitations: Invitation[],
    public readonly accessToken: string,
  ) {}
}

export class ReplaceEventGuestPartyEvent {
  constructor(
    public readonly eventId: number,
    public readonly partyName: string,
    public readonly newPartyId: number,
  ) {}
}
