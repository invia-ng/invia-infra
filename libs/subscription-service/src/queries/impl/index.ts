import { SecureUserPayload } from '@app/common/src/interface';

export class FetchSubscriptionPlansQuery {
  constructor(public readonly secureUser: SecureUserPayload) { }
}

export class FetchBusinessSubscriptionInfoQuery {
  constructor(public readonly secureUser: SecureUserPayload) { }
}

export class VerifyPremiumSubscriptionPaymentTransferQuery {
  constructor(
    public readonly paymentReference: string,
    public readonly secureUser: SecureUserPayload,
  ) { }
}

export class VerifyInvitationPaymentTransferQuery {
  constructor(
    public readonly paymentReference: string,
    public readonly secureUser: SecureUserPayload,
  ) { }
}
