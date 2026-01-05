import {
  Get,
  Req,
  Post,
  Body,
  Query,
  Delete,
  Controller,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventService } from '../services/event.service';
import { AcceptRejectEventInvitationCommand } from '../commands/impl';
import { AcceptRejectEventInvitationInfo } from '../interface/schema';

@ApiTags('event-guest')
@Controller({ path: 'guest' })
@ApiBearerAuth()
export class EventGuestController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly eventService: EventService,
  ) {}

  @Post('accept-reject-invitation')
  @ApiQuery({
    type: String,
    required: true,
    example: '315890',
    name: 'invitationHash',
    description: 'Invitation Hash',
  })
  @ApiQuery({
    type: Boolean,
    required: true,
    example: false,
    name: 'acceptInvite',
    description: 'Accept Invite',
  })
  @ApiOkResponse({ type:  AcceptRejectEventInvitationInfo })
  @ApiInternalServerErrorResponse()
  async acceptRejectEventInvitation(
    @Query('invitationHash') invitationHash: string,
    @Query('acceptInvite') acceptInvite: boolean,
  ): Promise<AcceptRejectEventInvitationInfo> {
    return await this.command.execute(
      new AcceptRejectEventInvitationCommand(
        invitationHash,
        acceptInvite,
      ),
    );
  }
}
