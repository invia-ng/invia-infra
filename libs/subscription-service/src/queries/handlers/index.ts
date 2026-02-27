import { FetchSubscriptionPlansQueryHandler } from './FetchSubscriptionPlansQueryHandler';
import { VerifyBankPaymentTransferQueryHandler } from './VerifyBankPaymentTransferQueryHandler';
import { FetchBusinessSubscriptionInfoQueryHandler } from './FetchBusinessSubscriptionInfoQueryHandler';
import { VerifyInvitationPaymentTransferQueryHandler } from './VerifyInvitationPaymentTransferQueryHandler';

export const SubscriptionServiceQueryHandlers = [
  FetchSubscriptionPlansQueryHandler,
  VerifyBankPaymentTransferQueryHandler,
  FetchBusinessSubscriptionInfoQueryHandler,
  VerifyInvitationPaymentTransferQueryHandler,
];
