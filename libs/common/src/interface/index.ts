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
  email: string;
  firstName: string;
  lastName: string;
  status: string;
}