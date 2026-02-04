import { DeleteAccountHandler } from './DeleteAccountHandler';
import { UpdateAccountNameHandler } from './UpdateAccountNameHandler';
import { UpdateAccountEmailHandler } from './UpdateAccountEmailHandler';
import { UpdateAccountPhoneHandler } from './UpdateAccountPhoneHandler';
import { UpdateProfileImageHandler } from './UpdateProfileImageHandler';
import { UpdateBusinessNameHandler } from './UpdateBusinessNameHandler';
import { UpdateBusinessEmailHandler } from './UpdateBusinessEmailHandler';
import { UpdateBusinessPhoneHandler } from './UpdateBusinessPhoneHandler';
import { RemoveBusinessMemberHandler } from './RemoveBusinessMemberHandler';
import { InviteBusinessMemberHandler } from './InviteBusinessMemberHandler';
import { UpdateAccountPasswordHandler } from './UpdateAccountPasswordHandler';
import { VerifyNewAccountEmailHandler } from './VerifyNewAccountEmailHandler';
import { VerifyNewBusinessEmailHandler } from './VerifyNewBusinessEmailHandler';
import { AcceptBusinessInvitationHandler } from './AcceptBusinessInvitationHandler';
import { UpdateBusinessProfileImageHandler } from './UpdateBusinessProfileImageHandler';
import { DeleteBusinessProfileImageHandler } from './DeleteBusinessProfileImageHandler';

export const AccountServiceCommandHandlers = [
  DeleteAccountHandler,
  UpdateAccountNameHandler,
  UpdateAccountEmailHandler,
  UpdateBusinessNameHandler,
  UpdateAccountPhoneHandler,
  UpdateProfileImageHandler,
  UpdateBusinessEmailHandler,
  UpdateBusinessPhoneHandler,
  InviteBusinessMemberHandler,
  RemoveBusinessMemberHandler,
  UpdateAccountPasswordHandler,
  VerifyNewAccountEmailHandler,
  VerifyNewBusinessEmailHandler,
  AcceptBusinessInvitationHandler,
  DeleteBusinessProfileImageHandler,
  UpdateBusinessProfileImageHandler,
];
