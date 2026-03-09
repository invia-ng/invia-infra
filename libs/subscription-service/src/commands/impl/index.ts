import { SecureUserPayload } from '@app/common/src/interface';
import { ProcessInviteEventGuestsBillingDTO } from '../../interface';

export class PaystackWebhookCallbackCommand {
  constructor(public readonly payload: any) { }
}

export class InitializePremiumSubscriptionPaymentCommand {
  constructor(
    public readonly planId: number,
    public readonly secureUser: SecureUserPayload,
  ) { }
}

export class VerifyPremiumSubscriptionPaymentTransferCommand {
  constructor(
    public readonly paymentReference: string,
    public readonly secureUser: SecureUserPayload,
  ) { }
}

export class ProcessInviteEventGuestsBillingCommand {
  constructor(
    public readonly eventId: number,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: ProcessInviteEventGuestsBillingDTO,
  ) { }
}

export class VerifyInvitationPaymentTransferCommand {
  constructor(
    public readonly paymentReference: string,
    public readonly secureUser: SecureUserPayload,
  ) { }
}