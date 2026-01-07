import { DeleteAccountHandler } from './DeleteAccountHandler';
import { UpdateAccountNameHandler } from './UpdateAccountNameHandler';
import { UpdateAccountEmailHandler } from './UpdateAccountEmailHandler';
import { UpdateAccountPhoneHandler } from './UpdateAccountPhoneHandler';
import { UpdateProfileImageHandler } from './UpdateProfileImageHandler';
import { UpdateBusinessNameHandler } from './UpdateBusinessNameHandler';
import { RemoveBusinessMemberHandler } from './RemoveBusinessMemberHandler';
import { InviteBusinessMemberHandler } from './InviteBusinessMemberHandler';
import { UpdateAccountPasswordHandler } from './UpdateAccountPasswordHandler';
import { VerifyNewAccountEmailHandler } from './VerifyNewAccountEmailHandler';
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
  InviteBusinessMemberHandler,
  RemoveBusinessMemberHandler,
  UpdateAccountPasswordHandler,
  VerifyNewAccountEmailHandler,
  AcceptBusinessInvitationHandler,
  DeleteBusinessProfileImageHandler,
  UpdateBusinessProfileImageHandler,
];
