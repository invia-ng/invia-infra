import { ProcessPaystackWebhookCallbackHandler } from './ProcessPaystackWebhookCallbackHandler';
import { VerifyInvitationPaymentTransferHandler } from './VerifyInvitationPaymentTransfeHandler';
import { ProcessInviteEventGuestsBillingHandler } from './ProcessInviteEventGuestsBillingHandler';
import { InitializePremiumSubscriptionPaymentHandler } from './InitializePremiumSubscriptionPaymentHandler';
import { VerifyPremiumSubscriptionPaymentTransferHandler } from './VerifyPremiumSubscriptionPaymentTransferHandler';

export const SubscriptionServiceCommandHandlers = [
  ProcessPaystackWebhookCallbackHandler,
  ProcessInviteEventGuestsBillingHandler,
  VerifyInvitationPaymentTransferHandler,
  InitializePremiumSubscriptionPaymentHandler,
  VerifyPremiumSubscriptionPaymentTransferHandler,
];
