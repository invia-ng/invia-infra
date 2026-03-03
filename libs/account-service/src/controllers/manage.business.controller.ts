import {
  InviteBusinessMemberDTO,
  UpdateAccountEmailDTO,
  UpdateAccountNameDTO,
  UpdateAccountPhoneDTO,
  UpdateBusinessNameDTO,
  UpdateProfileImageDTO,
  VerifyNewAccountEmailDTO,
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
  ApiQuery,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  UpdateBusinessNameCommand,
  InviteBusinessMemberCommand,
  RemoveBusinessMemberCommand,
  DeleteBusinessProfileImageCommand,
  UpdateBusinessProfileImageCommand,
  UpdateBusinessEmailCommand,
  VerifyNewBusinessEmailCommand,
  UpdateBusinessPhoneCommand,
  UpdateBusinessMemberRoleCommand,
} from '../commands/impl';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  FetchBusinessInfoQuery,
  FetchBusinessMembersInfoQuery,
  FetchBusinessMemberRolesQuery,
} from '../queries/impl';
import { AccountService } from '../services/account.service';
import { SecureUserPayload } from '@app/common/src/interface';
import { AccountInfo, BusinessMemberInfo } from '@app/common/src/models/account.model';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { BusinessInfo } from '@app/common/src/models/business.model';
import { SecureUser } from '@app/common/src/decorator/user.decorator';
import { BusinessMemberRoleInfo } from '../interface/schema';
import { AccountRole } from '@app/common/src/constants/enums';

@ApiTags('manage-business-info')
@Controller({ path: 'manage-business' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ManageBusinessController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly accountService: AccountService,
  ) { }

  @Get('business-info')
  @ApiOkResponse({ type: BusinessInfo })
  @ApiInternalServerErrorResponse()
  async getBusinessInfo(
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessInfo> {
    return await this.queryBus.execute(new FetchBusinessInfoQuery(secureUser));
  }

  @Get('members/roles')
  @ApiOkResponse({ type: BusinessMemberRoleInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async getBusinessMembersRoles(
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessMemberRoleInfo[]> {
    return await this.queryBus.execute(
      new FetchBusinessMemberRolesQuery(secureUser),
    );
  }

  @Get('members')
  @ApiOkResponse({ type: BusinessMemberInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async getBusinessMembers(
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessMemberInfo[]> {
    return await this.queryBus.execute(
      new FetchBusinessMembersInfoQuery(secureUser),
    );
  }

  @Post('members/invite')
  @ApiOkResponse({ type: BusinessMemberInfo })
  @ApiInternalServerErrorResponse()
  async inviteBusinessMember(
    @Body() body: InviteBusinessMemberDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessMemberInfo> {
    return await this.command.execute(
      new InviteBusinessMemberCommand(body, secureUser),
    );
  }

  @Patch('members/update-role')
  @ApiQuery({
    name: 'role',
    required: true,
    enum: AccountRole,
    description: 'Account Role',
    example: AccountRole.MEMBER,
  })
  @ApiQuery({
    example: 5,
    type: Number,
    required: true,
    name: 'memberId',
    description: 'Business Member ID',
  })
  @ApiOkResponse({ type: BusinessMemberInfo })
  @ApiInternalServerErrorResponse()
  async updateBusinessMemberRole(
    @Query('role') role: AccountRole,
    @Query('memberId') accountId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessMemberInfo> {
    return await this.command.execute(
      new UpdateBusinessMemberRoleCommand(accountId, role, secureUser),
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

  @Post('update-email')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async updateAccountEmail(
    @Req() req: Request,
    @Body() body: UpdateAccountEmailDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ) {
    return await this.command.execute(
      new UpdateBusinessEmailCommand(
        secureUser,
        body,
      ),
    );
  }

  @Patch('verify-new-email')
  @ApiOkResponse({ type: BusinessInfo })
  @ApiInternalServerErrorResponse()
  async verifyNewAccountEmail(
    @Req() req: Request,
    @Body() body: VerifyNewAccountEmailDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessInfo> {
    return await this.command.execute(
      new VerifyNewBusinessEmailCommand(
        secureUser,
        body,
      ),
    );
  }

  @Patch('update-phone')
  @ApiOkResponse({ type: BusinessInfo })
  @ApiInternalServerErrorResponse()
  async updatePhoneContact(
    @Body() body: UpdateAccountPhoneDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<BusinessInfo> {
    return await this.command.execute(
      new UpdateBusinessPhoneCommand(
        secureUser,
        body,
      ),
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
