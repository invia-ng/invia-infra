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
  InviteBusinessMemberDTO,
  AcceptBusinessInvitationDTO,
} from '../../interface';
import { AccountRole } from '@app/common/src/constants/enums';

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
    public readonly password: string,
    public readonly secureUser: SecureUserPayload,
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
    public readonly emailVerificationHash: string,
    public readonly secureUser: SecureUserPayload,
    public readonly payload: VerifyNewAccountEmailDTO,
  ) {}
}

export class UpdateBusinessEmailCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAccountEmailDTO,
  ) {}
}

export class VerifyNewBusinessEmailCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: VerifyNewAccountEmailDTO,
  ) {}
}

export class UpdateBusinessPhoneCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAccountPhoneDTO,
  ) {}
}

export class UpdateAccountPhoneCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: UpdateAccountPhoneDTO,
  ) {}
}

export class InviteBusinessMemberCommand {
  constructor(
    public readonly payload: InviteBusinessMemberDTO,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class UpdateBusinessMemberRoleCommand {
  constructor(
    public readonly member: number,
    public readonly role: AccountRole,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class RemoveBusinessMemberCommand {
  constructor(
    public readonly accountId: number,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class AcceptBusinessInvitationCommand {
  constructor(
    public readonly invitationHash: string,
    public readonly payload: AcceptBusinessInvitationDTO,
  ) {}
}
