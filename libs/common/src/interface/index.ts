import { AccountRole, AccountStatus } from "../constants/enums";

export interface AccessTokenPayload {
  eventHash: string;
  eventId: number;
  expiresAt: Date;
}

export interface EventInvitationHashPayload {
  eventHash: string;
  eventId: number;
  guestId: number;
}

export interface SecureUserPayload {
  id: number;
  name: string;
  email: string;
  role: AccountRole;
  status: AccountStatus;
}