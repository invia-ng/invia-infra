import {
  InviteBusinessMemberDTO,
  UpdateAccountNameDTO,
  UpdateBusinessNameDTO,
  UpdateProfileImageDTO,
} from '../interface';
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
  DeleteBusinessProfileImageCommand,
  InviteBusinessMemberCommand,
  RemoveBusinessMemberCommand,
  UpdateAccountNameCommand,
  UpdateBusinessNameCommand,
  UpdateBusinessProfileImageCommand,
  UpdateProfileImageCommand,
} from '../commands/impl';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  FetchBusinessInfoQuery,
  FetchBusinessMemberInfoQuery,
  FetchBusinessMemberRolesQuery,
} from '../queries/impl';
import { AccountService } from '../services/account.service';
import { SecureUserPayload } from '@app/common/src/interface';
import { AccountInfo } from '@app/common/src/models/account.model';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { BusinessInfo } from '@app/common/src/models/business.model';
import { SecureUser } from '@app/common/src/decorator/user.decorator';

@ApiTags('manage-business-info')
@Controller({ path: 'manage-business' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ManageBusinessController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly accountService: AccountService,
  ) {}

  @Get('business-info')
  @ApiOkResponse({ type: BusinessInfo })
  @ApiInternalServerErrorResponse()
  async getBusinessInfo(
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessInfo> {
    return await this.queryBus.execute(new FetchBusinessInfoQuery(secureUser));
  }

  @Get('members/roles')
  @ApiOkResponse({ type: AccountInfo })
  @ApiInternalServerErrorResponse()
  async getBusinessMembersRoles(
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo[]> {
    return await this.queryBus.execute(
      new FetchBusinessMemberRolesQuery(secureUser),
    );
  }

  @Get('members')
  @ApiOkResponse({ type: AccountInfo })
  @ApiInternalServerErrorResponse()
  async getBusinessMembers(
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<AccountInfo[]> {
    return await this.queryBus.execute(
      new FetchBusinessMemberInfoQuery(secureUser),
    );
  }

  @Post('members/invite')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async inviteBusinessMember(
    @Body() body: InviteBusinessMemberDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<void> {
    return await this.command.execute(
      new InviteBusinessMemberCommand(body, secureUser),
    );
  }

  @Delete('members/remove')
  @ApiQuery({
    type: Number,
    required: true,
    example: '5',
    name: 'accountId',
    description: 'Account ID',
  })
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async removeBusinessMember(
    @Query('accountId') accountId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<void> {
    return await this.command.execute(
      new RemoveBusinessMemberCommand(accountId, secureUser),
    );
  }

  @Patch('update-name')
  @ApiOkResponse({ type: BusinessInfo })
  @ApiInternalServerErrorResponse()
  async updateBusinessName(
    @Req() req: Request,
    @Body() body: UpdateBusinessNameDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessInfo> {
    return await this.command.execute(
      new UpdateBusinessNameCommand(secureUser, body),
    );
  }

  @Patch('update-profile-image')
  @ApiOkResponse({ type: BusinessInfo })
  @ApiInternalServerErrorResponse()
  async updateBusinessProfileImage(
    @Req() req: Request,
    @Body() body: UpdateProfileImageDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessInfo> {
    return await this.command.execute(
      new UpdateBusinessProfileImageCommand(secureUser, body),
    );
  }

  @Delete('delete-profile-image')
  @ApiOkResponse({ type: BusinessInfo })
  @ApiInternalServerErrorResponse()
  async deleteBusinessProfileImage(
    @Req() req: Request,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessInfo> {
    return await this.command.execute(
      new DeleteBusinessProfileImageCommand(secureUser),
    );
  }
}
