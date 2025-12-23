import { CommandBus } from '@nestjs/cqrs';
import {
  SigninDTO,
  SigninResponsePayload,
  SignupResponsePayload,
  SignupVerificationResponsePayload,
  ResetPasswordOTPVerificationResponsePayload,
  InitializeNewAccountDTO,
  CreateAccountPasswordDTO,
  InitializeBusinessProfileDTO,
} from '../interface';
import { AuthService } from '../services/auth.service';
import { Body, Controller, Post, Query, Req } from '@nestjs/common';
import {
  OAuthSigninDTO,
  CreateAccountDTO,
  ResetPasswordDTO,
  ForgotPasswordDTO,
  ResetPasswordVerificationDTO,
  CompleteSignupVerificationDTO,
} from '../interface';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  SignInCommand,
  OAuthSignInCommand,
  CreateAccountCommand,
  ResetPasswordCommand,
  ForgotPasswordCommand,
  InitializeNewAccountCommand,
  CreateAccountVerificationCommand,
  ResetPasswordOTpVerificationCommand,
  CreateAccountPasswordCommand,
  InitializeBusinessProfileCommand,
} from '../commands/impl';
import authUtils from 'libs/common/src/security/auth.utils';
import { AccountInfo } from '@app/common/src/models/account.model';
import { SecureUserPayload } from '@app/common/src/interface';
import { SecureUser } from '@app/common/src/decorator/user.decorator';

@ApiTags('auth')
@Controller({ path: '' })
export class AuthController {
  constructor(
    public command: CommandBus,
    public readonly authService: AuthService,
  ) {}

  @Post('initialize-signup')
  @ApiOkResponse({ type: SignupResponsePayload })
  @ApiConflictResponse()
  async initializeSignUp(
    @Body() body: InitializeNewAccountDTO,
    @Req() req: Request,
  ): Promise<SignupResponsePayload> {
    return await this.command.execute(
      new InitializeNewAccountCommand(
        authUtils.getOriginHeader(req),
        body,
      ),
    );
  }

  @Post('signup-verification')
  @ApiOkResponse({ type: SignupVerificationResponsePayload })
  @ApiConflictResponse()
  async signupVerification(
    @Body() body: CompleteSignupVerificationDTO,
    @Req() req: Request,
  ): Promise<SignupVerificationResponsePayload> {
    return await this.command.execute(
      new CreateAccountVerificationCommand(
        authUtils.getOriginHeader(req),
        body,
      ),
    );
  }

  @Post('initialize-account-password')
  @ApiOkResponse({ type: AccountInfo })
  @ApiConflictResponse()
  async initializeAccountPassword(
    @Body() body: CreateAccountPasswordDTO,
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.command.execute(
      new CreateAccountPasswordCommand(
        secureUser,
        body,
      ),
    );
  }

  @Post('initialize-business-profile')
  @ApiOkResponse({ type: AccountInfo })
  @ApiConflictResponse()
  async initializeBusinessProfile(
    @Body() body: InitializeBusinessProfileDTO,
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.command.execute(
      new InitializeBusinessProfileCommand(
        secureUser,
        body,
      ),
    );
  }

  @Post('signin')
  @ApiOkResponse({ type: SigninResponsePayload })
  @ApiConflictResponse()
  async signIn(
    @Body() body: SigninDTO,
    @Req() req: Request,
  ): Promise<SigninResponsePayload> {
    return await this.command.execute(
      new SignInCommand(authUtils.getOriginHeader(req), body),
    );
  }

  @Post('forgot-password')
  @ApiOkResponse()
  @ApiConflictResponse()
  async forgotPassword(@Body() body: ForgotPasswordDTO, @Req() req: Request) {
    return await this.command.execute(
      new ForgotPasswordCommand(authUtils.getOriginHeader(req), body),
    );
  }

  @Post('reset-password')
  @ApiOkResponse()
  @ApiConflictResponse()
  async resetPassword(@Body() body: ResetPasswordDTO, @Req() req: Request) {
    return await this.command.execute(
      new ResetPasswordCommand(authUtils.getOriginHeader(req), body),
    );
  }

  @Post('reset-password-otp-verification')
  @ApiOkResponse({ type: ResetPasswordOTPVerificationResponsePayload })
  @ApiConflictResponse()
  async resetPasswordOtpVerification(
    @Body() body: ResetPasswordVerificationDTO,
    @Req() req: Request,
  ): Promise<ResetPasswordOTPVerificationResponsePayload> {
    return await this.command.execute(
      new ResetPasswordOTpVerificationCommand(
        authUtils.getOriginHeader(req),
        body,
      ),
    );
  }
}
