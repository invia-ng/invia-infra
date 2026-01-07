import { FetchBusinessInfoQueryHandler } from './FetchBusinessInfoQueryHandler';
import { FetchBusinessMembersQueryHandler } from './FetchBusinessMembersQueryHandler';
import { FetchBusinessMemberRolesQueryHandler } from './FetchBusinessMemberRolesQueryHandler';
import { FetchDetailedAccountInfoQueryHandler } from './FetchDetailedAccountInfoQueryHandler';
import { FetchBusinessInvitationInfoQueryHandler } from './FetchBusinessInvitationInfoQueryHandler';

export const AccountServiceQueryHandlers = [
  FetchBusinessInfoQueryHandler,
  FetchBusinessMembersQueryHandler,
  FetchDetailedAccountInfoQueryHandler,
  FetchBusinessMemberRolesQueryHandler,
  FetchBusinessInvitationInfoQueryHandler,
];
