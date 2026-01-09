import { SecureUserPayload } from '@app/common/src/interface';

export class FetchSubscriptionPlansQuery {
  constructor(public readonly secureUser: SecureUserPayload) {}
}
