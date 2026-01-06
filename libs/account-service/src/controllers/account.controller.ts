import {
  Get,
  Req,
  UseGuards,
  Controller,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AccountService } from '../services/account.service';
import { SecureUserPayload } from '@app/common/src/interface';
import { FetchDetailedAccountInfoQuery } from '../queries/impl';
import { AccountInfo } from '@app/common/src/models/account.model';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { SecureUser } from '@app/common/src/decorator/user.decorator';

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
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo> {
    return await this.queryBus.execute(
      new FetchDetailedAccountInfoQuery(secureUser),
    );
  }
}
