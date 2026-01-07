import {
  ApiTags,
  ApiQuery,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AcceptBusinessInvitationDTO } from '../interface';
import { AccountService } from '../services/account.service';
import { BusinessInvitationInfo } from '../interface/schema';
import { AcceptBusinessInvitationCommand } from '../commands/impl';
import { FetchBusinessInvitationInfoQuery } from '../queries/impl';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SigninResponsePayload } from '@app/auth-service/src/interface';

@ApiTags('member')
@Controller({ path: 'member' })
@ApiBearerAuth()
export class ManageMemberController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly accountService: AccountService,
  ) {}

  @Get('invitations/info')
  @ApiQuery({
    type: String,
    required: true,
    example: '1234567890',
    name: 'invitationHash',
    description: 'Invitation Hash',
  })
  @ApiOkResponse({ type: BusinessInvitationInfo })
  @ApiInternalServerErrorResponse()
  async fetchBusinessInvitationInfo(
    @Query('invitationHash') invitationHash: string,
  ): Promise<BusinessInvitationInfo> {
    return await this.queryBus.execute(
      new FetchBusinessInvitationInfoQuery(invitationHash),
    );
  }

  @Post('invitations/accept')
  @ApiQuery({
    type: String,
    required: true,
    example: '1234567890',
    name: 'invitationHash',
    description: 'Invitation Hash',
  })
  @ApiOkResponse({ type: SigninResponsePayload })
  @ApiInternalServerErrorResponse()
  async acceptBusinessInvitation(
    @Query('invitationHash') invitationHash: string,
    @Body() payload: AcceptBusinessInvitationDTO,
  ): Promise<SigninResponsePayload> {
    return await this.command.execute(
      new AcceptBusinessInvitationCommand(invitationHash, payload),
    );
  }
}
