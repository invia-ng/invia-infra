import {
  Get,
  Post,
  Body,
  Query,
  Controller,
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
import { AcceptRejectEventInvitationDTO } from '../interface';
import { GuestFetchEventInvitationInfoQuery } from '../queries/impl';
import { AcceptRejectEventInvitationInfo, GuestEventInvitationInfo } from '../interface/schema';
import { AcceptRejectEventInvitationCommand, SendEventGuestInvitationRSVPCommand } from '../commands/impl';

@ApiTags('event-guest')
@Controller({ path: 'guest' })
@ApiBearerAuth()
export class EventGuestController {
  constructor(
    public queryBus: QueryBus,
    public commandBus: CommandBus,
    public readonly eventService: EventService,
  ) { }

  @Get('fetch-invitation-info')
  @ApiQuery({
    type: String,
    required: true,
    example: '315890',
    name: 'invitationHash',
    description: 'Invitation Hash',
  })
  @ApiOkResponse({ type: GuestEventInvitationInfo })
  @ApiInternalServerErrorResponse()
  async fetchInvitationInfo(
    @Query('invitationHash') invitationHash: string,
  ): Promise<GuestEventInvitationInfo> {
    return await this.queryBus.execute(
      new GuestFetchEventInvitationInfoQuery(
        invitationHash,
      ),
    );
  }

  @Post('send-guest-rsvp')
  @ApiQuery({
    type: String,
    required: true,
    name: 'guestEmail',
    description: 'Guest email',
    example: 'bioduno@gmail.com',
  })
  @ApiQuery({
    type: String,
    required: true,
    example: '315890',
    name: 'invitationHash',
    description: 'Invitation Hash',
  })
  @ApiOkResponse({ type: Boolean })
  @ApiInternalServerErrorResponse()
  async sendGuestRSVP(
    @Query('guestEmail') guestEmail: string,
    @Query('invitationHash') invitationHash: string,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new SendEventGuestInvitationRSVPCommand(
        guestEmail,
        invitationHash,
      ),
    );
  }

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
  @ApiOkResponse({ type: AcceptRejectEventInvitationInfo })
  @ApiInternalServerErrorResponse()
  async acceptRejectEventInvitation(
    @Body() payload: AcceptRejectEventInvitationDTO,
    @Query('acceptInvite') acceptInvite: boolean,
    @Query('invitationHash') invitationHash: string,
  ): Promise<AcceptRejectEventInvitationInfo> {
    return await this.commandBus.execute(
      new AcceptRejectEventInvitationCommand(
        invitationHash,
        acceptInvite,
        payload
      ),
    );
  }
}
