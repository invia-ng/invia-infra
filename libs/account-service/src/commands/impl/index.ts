import { SecureUserPayload } from '@app/common/src/interface';
import {
  UpdateAccountPasswordDTO,
  DeleteAccountDTO,
  UpdateFCMTokenDTO,
  UpdateProfileImageDTO,
  UpdateAccountNameDTO,
  UpdateAccountEmailDTO,
  VerifyNewAccountEmailDTO,
  UpdateAccountPhoneDTO,
  UpdateAccountLocationDTO,
} from '../../interface';

export class UpdateAccountFCMTokenCommand {
  constructor(
    public readonly payload: UpdateFCMTokenDTO,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class UpdateProfileImageCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateProfileImageDTO,
  ) {}
}

export class UpdateBusinessProfileImageCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateProfileImageDTO,
  ) {}
}

export class DeleteBusinessProfileImageCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class UpdateAccountPasswordCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAccountPasswordDTO,
  ) {}
}

export class DeleteAccountCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: DeleteAccountDTO,
  ) {}
}

export class UpdateAccountNameCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAccountNameDTO,
  ) {}
}

export class UpdateBusinessNameCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAccountNameDTO,
  ) {}
}

export class UpdateAccountEmailCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAccountEmailDTO,
  ) {}
}

export class VerifyNewAccountEmailCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: VerifyNewAccountEmailDTO,
  ) {}
}

export class UpdateAccountPhoneCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAccountPhoneDTO,
  ) {}
}
