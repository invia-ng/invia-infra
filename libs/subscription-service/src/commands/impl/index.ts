import { SecureUserPayload } from '@app/common/src/interface';

export class PaystackWebhookCallbackCommand {
  constructor(public readonly payload: any) {}
}

export class InitializePremiumSubscriptionPaymentCommand {
  constructor(
    public readonly planId: number,
    public readonly secureUser: SecureUserPayload,
  ) {}
}
