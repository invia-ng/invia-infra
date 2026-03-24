import { AccountRole, AccountStatus, FollowupIntervalEnum } from "../constants/enums";

export interface AccessTokenPayload {
  eventHash: string;
  eventId: number;
  expiresAt: Date;
  guestEmail: string;
}

export interface EventInvitationHashPayload {
  eventHash: string;
  eventId: number;
  guestId: number;
}

export interface EventFollowupInvitationHashPayload {
  eventHash: string;
  eventId: number;
  guestId: number;
  followupId: string;
  date: Date;
  interval: FollowupIntervalEnum;
}

export interface SecureUserPayload {
  id: number;
  name: string;
  email: string;
  role: AccountRole;
  status: AccountStatus;
}