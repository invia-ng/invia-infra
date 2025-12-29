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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  DeleteAccountDTO,
  UpdateAccountEmailDTO,
  UpdateAccountNameDTO,
  UpdateAccountPasswordDTO,
  UpdateAccountPhoneDTO,
  UpdateProfileImageDTO,
  VerifyNewAccountEmailDTO,
} from '../interface';
import authUtils from 'libs/common/src/security/auth.utils';
import { AccountService } from '../services/account.service';
import { SecureUserPayload } from '@app/common/src/interface';
import { AccountInfo } from '@app/common/src/models/account.model';
import {
  DeleteAccountCommand,
  UpdateProfileImageCommand,
  UpdateAccountPasswordCommand,
} from '../commands/impl';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { SecureUser } from '@app/common/src/decorator/user.decorator';
import { FetchDetailedAccountInfoQuery } from '../queries/impl';

@ApiTags('me')
@Controller({ path: 'me' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly accountService: AccountService,
  ) {}

  @Get('detailed')
  @ApiOkResponse({ type: AccountInfo })
  @ApiInternalServerErrorResponse()
  async getDetailedAccountInfo(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.queryBus.execute(
      new FetchDetailedAccountInfoQuery(secureUser),
    );
  }
}
