import { SecureUserPayload } from '@app/common/src/interface';

export class FetchDetailedAccountInfoQuery {
  constructor(public readonly secureUser: SecureUserPayload) {}
}

export class FetchBusinessInfoQuery {
  constructor(public readonly secureUser: SecureUserPayload) {}
}

export class FetchAccountSummaryQuery {
  constructor(public readonly secureUser: SecureUserPayload) {}
}

export class FetchExistingCommunityUsersQuery {
  constructor(public readonly secureUser: SecureUserPayload) {}
}

export class FetchUserCommunityRecordsQuery {
  constructor(public readonly secureUser: SecureUserPayload) {}
}

export class FetchBusinessMemberInfoQuery {
  constructor(public readonly secureUser: SecureUserPayload) {}
}


export class FetchBusinessMemberRolesQuery {
  constructor(public readonly secureUser: SecureUserPayload) {}
}

export class FetchBusinessInvitationInfoQuery {
  constructor(public readonly invitationHash: string) {}
}
