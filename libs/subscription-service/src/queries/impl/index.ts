import { SecureUserPayload } from '@app/common/src/interface';

export class FetchSubscriptionPlansQuery {
  constructor(public readonly secureUser: SecureUserPayload) {}
}

export class FetchBusinessSubscriptionInfoQuery {
  constructor(public readonly secureUser: SecureUserPayload) {}
}

export class VerifyBankPaymentTransferQuery {
  constructor(
    public readonly paymentReference: string,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class VerifyInvitationPaymentTransferQuery {
  constructor(
    public readonly paymentReference: string,
    public readonly secureUser: SecureUserPayload,
  ) {}
}
