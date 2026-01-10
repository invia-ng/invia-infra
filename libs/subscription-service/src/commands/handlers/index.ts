import { ProcessPaystackWebhookCallbackHandler } from './ProcessPaystackWebhookCallbackHandler';
import { InitializePremiumSubscriptionPaymentHandler } from './InitializePremiumSubscriptionPaymentHandler';

export const SubscriptionServiceCommandHandlers = [
  ProcessPaystackWebhookCallbackHandler,
  InitializePremiumSubscriptionPaymentHandler,
];
