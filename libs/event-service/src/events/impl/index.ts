import { Invitation } from '@app/common/src/models/invitation.model';

export class InviteEventGuestsEvent {
  constructor(
    public readonly invitations: Invitation[],
  ) {}
}
  