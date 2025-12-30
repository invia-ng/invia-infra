import { DeleteAccountHandler } from './DeleteAccountHandler';
import { UpdateAccountNameHandler } from './UpdateAccountNameHandler';
import { UpdateAccountEmailHandler } from './UpdateAccountEmailHandler';
import { UpdateAccountPhoneHandler } from './UpdateAccountPhoneHandler';
import { UpdateProfileImageHandler } from './UpdateProfileImageHandler';
import { UpdateBusinessNameHandler } from './UpdateBusinessNameHandler';
import { UpdateAccountPasswordHandler } from './UpdateAccountPasswordHandler';
import { VerifyNewAccountEmailHandler } from './VerifyNewAccountEmailHandler';
import { UpdateBusinessProfileImageHandler } from './UpdateBusinessProfileImageHandler';
import { DeleteBusinessProfileImageHandler } from './DeleteBusinessProfileImageHandler';

export const AccountServiceCommandHandlers = [
  DeleteAccountHandler,
  UpdateAccountNameHandler,
  UpdateAccountEmailHandler,
  UpdateBusinessNameHandler,
  UpdateAccountPhoneHandler,
  UpdateProfileImageHandler,
  UpdateAccountPasswordHandler,
  VerifyNewAccountEmailHandler,
  DeleteBusinessProfileImageHandler,
  UpdateBusinessProfileImageHandler,
];
