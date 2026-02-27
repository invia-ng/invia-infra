import { ProcessPaystackWebhookCallbackHandler } from './ProcessPaystackWebhookCallbackHandler';
import { ProcessInviteEventGuestsBillingHandler } from './ProcessInviteEventGuestsBillingHandler';
import { InitializePremiumSubscriptionPaymentHandler } from './InitializePremiumSubscriptionPaymentHandler';

export const SubscriptionServiceCommandHandlers = [
  ProcessPaystackWebhookCallbackHandler,
  ProcessInviteEventGuestsBillingHandler,
  InitializePremiumSubscriptionPaymentHandler,
];
