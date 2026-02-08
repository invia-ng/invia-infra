import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  DeleteAccountDTO,
  UpdateAccountEmailDTO,
  UpdateAccountNameDTO,
  UpdateAccountPasswordDTO,
  UpdateAccountPhoneDTO,
  UpdateProfileImageDTO,
  VerifyNewAccountEmailDTO,
} from '../interface';
import {
  DeleteAccountCommand,
  UpdateAccountNameCommand,
  UpdateAccountEmailCommand,
  UpdateAccountPhoneCommand,
  UpdateProfileImageCommand,
  VerifyNewAccountEmailCommand,
  UpdateAccountPasswordCommand,
} from '../commands/impl';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AccountSummaryInfo } from '../interface/schema';
import { FetchAccountSummaryQuery } from '../queries/impl';
import { AccountService } from '../services/account.service';
import { SecureUserPayload } from '@app/common/src/interface';
import { AccountInfo } from '@app/common/src/models/account.model';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { SecureUser } from '@app/common/src/decorator/user.decorator';

@ApiTags('manage-account-info')
@Controller({ path: 'manage-info' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ManageAccountController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly accountService: AccountService,
  ) { }

  @Patch('update-name')
  @ApiOkResponse({ type: AccountInfo })
  @ApiInternalServerErrorResponse()
  async updateAccountName(
    @Req() req: Request,
    @Body() body: UpdateAccountNameDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.command.execute(
      new UpdateAccountNameCommand(
        secureUser,
        body,
      ),
    );
  }

  @Post('update-email')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async updateAccountEmail(
    @Req() req: Request,
    @Body() body: UpdateAccountEmailDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new UpdateAccountEmailCommand(
        secureUser,
        body,
      ),
    );
  }

  @Patch('verify-new-email')
  @ApiQuery({
    type: String,
    required: true,
    name: 'emailVerificationHash',
    description: 'Account email verification hash',
  })
  @ApiOkResponse({ type: AccountInfo })
  @ApiInternalServerErrorResponse()
  async verifyNewAccountEmail(
    @Req() req: Request,
    @Body() body: VerifyNewAccountEmailDTO,
    @Query('emailVerificationHash') emailVerificationHash: string,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.command.execute(
      new VerifyNewAccountEmailCommand(
        emailVerificationHash,
        secureUser,
        body,
      ),
    );
  }

  @Patch('update-phone')
  @ApiOkResponse({ type: AccountInfo })
  @ApiInternalServerErrorResponse()
  async updateAccountPhone(
    @Req() req: Request,
    @Body() body: UpdateAccountPhoneDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.command.execute(
      new UpdateAccountPhoneCommand(
        secureUser,
        body,
      ),
    );
  }

  @Patch('update-profile-image')
  @ApiOkResponse({ type: AccountInfo })
  @ApiInternalServerErrorResponse()
  async updateProfileImage(
    @Req() req: Request,
    @Body() body: UpdateProfileImageDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.command.execute(
      new UpdateProfileImageCommand(
        secureUser,
        body,
      ),
    );
  }

  @Patch('update-password')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async updateAccountPassword(
    @Req() req: Request,
    @Body() body: UpdateAccountPasswordDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new UpdateAccountPasswordCommand(
        secureUser,
        body,
      ),
    );
  }

  @Get('summary')
  @ApiOkResponse({ type: AccountSummaryInfo })
  @ApiInternalServerErrorResponse()
  async fetchAccountSummary(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountSummaryInfo> {
    return await this.queryBus.execute(
      new FetchAccountSummaryQuery(
        secureUser,
      ),
    );
  }

  @Delete('delete')
  @ApiOkResponse()
  @ApiQuery({
    type: String,
    name: 'password',
    required: true,
    description: 'Account password',
  })
  @ApiInternalServerErrorResponse()
  async deleteAccount(
    @Query('password') password: string,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new DeleteAccountCommand(
        password,
        secureUser,
      ),
    );
  }
}
