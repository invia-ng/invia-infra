import { FetchBusinessInfoQueryHandler } from './FetchBusinessInfoQueryHandler';
import { FetchAccountSummaryQueryHandler } from './FetchAccountSummaryQueryHandler';
import { FetchBusinessMembersQueryHandler } from './FetchBusinessMembersQueryHandler';
import { FetchBusinessMemberRolesQueryHandler } from './FetchBusinessMemberRolesQueryHandler';
import { FetchDetailedAccountInfoQueryHandler } from './FetchDetailedAccountInfoQueryHandler';
import { FetchBusinessInvitationInfoQueryHandler } from './FetchBusinessInvitationInfoQueryHandler';

export const AccountServiceQueryHandlers = [
  FetchBusinessInfoQueryHandler,
  FetchAccountSummaryQueryHandler,
  FetchBusinessMembersQueryHandler,
  FetchDetailedAccountInfoQueryHandler,
  FetchBusinessMemberRolesQueryHandler,
  FetchBusinessInvitationInfoQueryHandler,
];
