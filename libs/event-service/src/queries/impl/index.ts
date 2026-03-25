import { SecureUserPayload } from '@app/common/src/interface';

export class FetchShareFormPasscodeQuery {
  constructor(
    public readonly eventId: number,
    public readonly secureUser: SecureUserPayload,
  ) { }
}

export class FetchShareFormPasscodeViaEmailQuery {
  constructor(
    public readonly eventId: number,
    public readonly guestEmail: string,
    public readonly secureUser: SecureUserPayload,
  ) { }
}

export class FetchGuestPartyQuery {
  constructor() { }
}

export class FetchEventCategoriesQuery {
  constructor() { }
}

export class FetchEventsQuery {
  constructor(
    public readonly page: number,
    public readonly pageSize: number,
    public readonly isActive: boolean,
    public readonly secureUser: SecureUserPayload,
  ) { }
}

export class FetchEventGuestIdsQuery {
  constructor(
    public readonly eventId: number,
    public readonly secureUser: SecureUserPayload,
  ) { }
}

export class EventAuthorFetchEventGuestIdsQuery {
  constructor(
    public readonly eventId: number,
    public readonly accessToken: string,
  ) { }
}

export class EventAuthorFetchGuestTimelineEnumsQuery {
  constructor() { }
}

export class FetchEventPartiesQuery {
  constructor(
    public readonly eventId: number,
    public readonly secureUser: SecureUserPayload,
  ) { }
}

export class EventAuthorFetchEventPartiesQuery {
  constructor(
    public readonly eventId: number,
    public readonly accessToken: string,
  ) { }
}

export class FetchEventInfoQuery {
  constructor(
    public readonly eventId: number,
    public readonly secureUser: SecureUserPayload,
  ) { }
}

export class GuestFetchEventInvitationInfoQuery {
  constructor(
    public readonly invitationHash: string,
  ) { }
}

export class GuestFetchEventFollowupInvitationInfoQuery {
  constructor(
    public readonly followupInvitationHash: string,
  ) { }
}

export class EventAuthorFetchEventInfoQuery {
  constructor(
    public readonly eventId: number,
    public readonly accessToken: string,
  ) { }
}

export class FetchEventGuestsQuery {
  constructor(
    public readonly eventId: number,
    public readonly page: number,
    public readonly pageSize: number,
    public readonly secureUser: SecureUserPayload,
  ) { }
}

export class FetchMessageTemplateVariablesQuery {
  constructor() { }
}

export class FetchMessageTemplatesQuery {
  constructor(
    public readonly page: number,
    public readonly pageSize: number,
    public readonly secureUser: SecureUserPayload,
  ) { }
}

export class FetchMessageTemplateFollowupConditionsQuery {
  constructor() { }
}

export class FetchMessageTemplateFollowupIntervalsQuery {
  constructor() { }
}

export class FetchEventAuthorGuestsQuery {
  constructor(
    public readonly page: number,
    public readonly pageSize: number,
    public readonly accessToken: string,
  ) { }
}

export class SearchEventGuestsQuery {
  constructor(
    public readonly eventId: number,
    public readonly guestParty: string,
    public readonly searchQuery: string,
    public readonly inviteStatus: string,
    public readonly rsvpStatus: string,
    public readonly page: number,
    public readonly pageSize: number,
    public readonly secureUser: SecureUserPayload,
  ) { }
}

export class EventAuthorSearchEventGuestsQuery {
  constructor(
    public readonly eventId: number,
    public readonly guestParty: string,
    public readonly searchQuery: string,
    public readonly inviteStatus: string,
    public readonly rsvpStatus: string,
    public readonly page: number,
    public readonly pageSize: number,
    public readonly accessToken: string,
  ) { }
}

export class FetchEventGuestInfoQuery {
  constructor(
    public readonly eventId: number,
    public readonly guestId: number,
    public readonly secureUser: SecureUserPayload,
  ) { }
}
export class EventAuthorFetchEventGuestInfoQuery {
  constructor(
    public readonly eventId: number,
    public readonly guestId: number,
    public readonly accessToken: string,
  ) { }
}
