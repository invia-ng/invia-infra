import { FetchSubscriptionPlansQueryHandler } from './FetchSubscriptionPlansQueryHandler';
import { FetchBusinessSubscriptionInfoQueryHandler } from './FetchBusinessSubscriptionInfoQueryHandler';
import { VerifyInvitationPaymentTransferQueryHandler } from './VerifyInvitationPaymentTransferQueryHandler';
import { VerifyPremiumSubscriptionPaymentTransferQueryHandler } from './VerifyPremiumSubscriptionPaymentTransferQueryHandler';

export const SubscriptionServiceQueryHandlers = [
  FetchSubscriptionPlansQueryHandler,
  FetchBusinessSubscriptionInfoQueryHandler,
  VerifyInvitationPaymentTransferQueryHandler,
  VerifyPremiumSubscriptionPaymentTransferQueryHandler,
];
