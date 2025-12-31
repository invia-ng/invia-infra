import { SecureUserPayload } from '@app/common/src/interface';

export class FetchGuestPartyQuery {
	constructor(){}
}

export class FetchEventCategoriesQuery {
	constructor(){}
}

export class FetchEventsQuery {
	constructor(
		public readonly page: number,
		public readonly pageSize: number,
		public readonly secureUser: SecureUserPayload,
	){}
}

export class FetchEventGuestsQuery {
	constructor(
		public readonly eventId: number,
		public readonly page: number,
		public readonly pageSize: number,
		public readonly secureUser: SecureUserPayload,
	){}
}