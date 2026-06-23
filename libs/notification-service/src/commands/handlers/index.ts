import { ProcessResendWebhookHandler } from './ProcessResendWebhookHandler';
import { ProcessMetaWhatsappWebhookHandler } from './ProcessMetaWhatsappWebhookHandler';

export const NotificationServiceQueryHandlers = [
  ProcessResendWebhookHandler,
  ProcessMetaWhatsappWebhookHandler,
];
