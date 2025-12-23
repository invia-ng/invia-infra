import { SecureUserPayload } from '@app/common/src/interface';
import {
  SigninDTO,
  OAuthSigninDTO,
  ResetPasswordDTO,
  CreateAccountDTO,
  ForgotPasswordDTO,
  InitializeNewAccountDTO,
  ResetPasswordVerificationDTO,
  CompleteSignupVerificationDTO,
  CreateAccountPasswordDTO,
  InitializeBusinessProfileDTO,
} from '../../interface';

export class SignInCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: SigninDTO,
  ) {}
}

export class OAuthSignInCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: OAuthSigninDTO,
  ) {}
}

export class CreateAccountCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: CreateAccountDTO,
  ) {}
}

export class InitializeNewAccountCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: InitializeNewAccountDTO,
  ) {}
}

export class CreateAccountVerificationCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: CompleteSignupVerificationDTO,
  ) {}
}

export class CreateAccountPasswordCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: CreateAccountPasswordDTO,
  ) {}
}

export class InitializeBusinessProfileCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: InitializeBusinessProfileDTO,
  ) {}
}

export class ForgotPasswordCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: ForgotPasswordDTO,
  ) {}
}

export class ResetPasswordCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: ResetPasswordDTO,
  ) {}
}

export class ResetPasswordOTpVerificationCommand {
  constructor(
    public readonly origin: string,
    public readonly payload: ResetPasswordVerificationDTO,
  ) {}
}
