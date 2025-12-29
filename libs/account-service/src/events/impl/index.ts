import {
  FollowCommunityUserContactsDTO,
  FollowCommunityUserContactsWithNamesDTO,
} from '../../interface';
import { SecureUserPayload } from '@app/common/src/interface';

export class FollowCommunityUserContactsEvent {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: FollowCommunityUserContactsDTO,
  ) {}
}

export class FollowCommunityUserContactsWithNamesEvent {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: FollowCommunityUserContactsWithNamesDTO,
  ) {}
}
