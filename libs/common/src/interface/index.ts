export interface AccessTokenPayload {
  eventHash: string;
  eventId: number;
  expiresAt: Date;
}

export interface SecureUserPayload {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
}