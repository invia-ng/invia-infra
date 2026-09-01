import { SignInHandler } from './SigninHandler';
import { OAuthSignInHandler } from './OAuthSigninHandler';
import { ResetPasswordHandler } from './ResetPasswordHandler';
import { ForgotPasswordHandler } from './ForgotPasswordHandler';
import { InitializeNewAccountHandler } from './InitializeNewAccountHandler';
import { CreateAccountPasswordHandler } from './CreateAccountPasswordHandler';
import { InitializeBusinessProfileHandler } from './InitializeBusinessProfileHandler';
import { CreateAccountVerificationHandler } from './CreateAccountVerificationHandler';
import { ResetPasswordOtpVerificationHandler } from './ResetPasswordOtpVerificationHandler';

export const AuthServiceCommandHandlers = [
  SignInHandler,
  OAuthSignInHandler,
  ResetPasswordHandler,
  ForgotPasswordHandler,
  InitializeNewAccountHandler,
  CreateAccountPasswordHandler,
  InitializeBusinessProfileHandler,
  CreateAccountVerificationHandler,
  ResetPasswordOtpVerificationHandler,
];
