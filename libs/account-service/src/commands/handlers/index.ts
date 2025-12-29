import { DeleteAccountHandler } from './DeleteAccountHandler';
import { UpdateAccountNameHandler } from './UpdateAccountNameHandler';
import { UpdateAccountEmailHandler } from './UpdateAccountEmailHandler';
import { UpdateAccountPhoneHandler } from './UpdateAccountPhoneHandler';
import { UpdateProfileImageHandler } from './UpdateProfileImageHandler';
import { UpdateAccountPasswordHandler } from './UpdateAccountPasswordHandler';
import { VerifyNewAccountEmailHandler } from './VerifyNewAccountEmailHandler';

export const AccountServiceCommandHandlers = [
  DeleteAccountHandler,
  UpdateAccountNameHandler,
  UpdateAccountEmailHandler,
  UpdateAccountPhoneHandler,
  UpdateProfileImageHandler,
  UpdateAccountPasswordHandler,
  VerifyNewAccountEmailHandler,
];
