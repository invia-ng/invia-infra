import {
  UpdateEventDTO,
  CreateEventDTO,
  AddEventGuestsDTO,
  CreateEventPartyDTO,
  InviteEventGuestDTO,
  UpdateEventGuestDTO,
  UpdateEventPartyDTO,
  InviteEventGuestsDTO,
} from '../interface';
import {
  FetchEventsQuery,
  FetchEventInfoQuery,
  FetchEventGuestsQuery,
  FetchEventPartiesQuery,
  SearchEventGuestsQuery,
  FetchEventGuestIdsQuery,
  FetchEventGuestInfoQuery,
} from '../queries/impl';
import {
  Get,
  Req,
  Post,
  Body,
  Patch,
  Query,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  CreateEventCommand,
  DeleteEventCommand,
  UpdateEventCommand,
  AddEventGuestsCommand,
  RemoveEventGuestCommand,
  CreateEventPartyCommand,
  DeleteEventPartyCommand,
  InviteEventGuestCommand,
  UpdateEventGuestCommand,
  UpdateEventPartyCommand,
  InviteEventGuestsCommand,
  AddEventGuestsToPartyCommand,
  RemoveMultipleEventGuestsCommand,
} from '../commands/impl';
import {
  EventInfo,
  EventPartyInfo,
  EventsResponse,
} from '@app/common/src/models/event.model';
import {
  GuestInfo,
  GuestsResponse,
  GuestProfileInfo,
} from '@app/common/src/models/guest.model';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventService } from '../services/event.service';
import { SecureUserPayload } from '@app/common/src/interface';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { SecureUser } from '@app/common/src/decorator/user.decorator';
import { DeleteDataInstanceInfo, EventGuestIdInfo } from '../interface/schema';
import { InvitationChargeResponse } from '@app/subscription-service/src/interface/schema';
import { InvitationRSVPEnum, InvitationStatusEnum } from '@app/common/src/constants/enums';

@ApiTags('event')
@Controller({ path: '' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly eventService: EventService,
  ) { }

  @Get('parties')
  @ApiQuery({
    example: 1,
    type: Number,
    required: true,
    name: 'eventId',
    description: 'Event primary ID',
  })
  @ApiOkResponse({ type: EventPartyInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async fetchEventParties(
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<EventPartyInfo> {
    return await this.queryBus.execute(
      new FetchEventPartiesQuery(eventId, secureUser),
    );
  }

  @Post('parties/create')
  @ApiQuery({
    example: 1,
    type: Number,
    required: true,
    name: 'eventId',
    description: 'Event primary ID',
  })
  @ApiOkResponse({ type: EventPartyInfo })
  @ApiInternalServerErrorResponse()
  async createEventParty(
    @Query('eventId') eventId: number,
    @Body() payload: CreateEventPartyDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<EventPartyInfo> {
    return await this.command.execute(
      new CreateEventPartyCommand(eventId, payload, secureUser),
    );
  }

  @Patch('parties/update')
  @ApiQuery({
    example: 1,
    type: Number,
    required: true,
    name: 'eventId',
    description: 'Event primary ID',
  })
  @ApiQuery({
    example: 1,
    type: Number,
    required: true,
    name: 'partyId',
    description: 'Event party primary ID',
  })
  @ApiOkResponse({ type: EventPartyInfo })
  @ApiInternalServerErrorResponse()
  async updateEventParty(
    @Query('eventId') eventId: number,
    @Query('partyId') partyId: number,
    @Body() payload: UpdateEventPartyDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<EventPartyInfo> {
    return await this.command.execute(
      new UpdateEventPartyCommand(eventId, partyId, payload, secureUser),
    );
  }

  @Delete('parties/delete')
  @ApiQuery({
    example: 1,
    type: Number,
    required: true,
    name: 'eventId',
    description: 'Event primary ID',
  })
  @ApiQuery({
    example: 1,
    type: Number,
    required: true,
    name: 'partyId',
    description: 'Event party primary ID',
  })
  @ApiQuery({
    example: 1,
    type: Number,
    required: false,
    name: 'newPartyId',
    description: 'New event party for guests using deleted party',
  })
  @ApiOkResponse({ type: DeleteDataInstanceInfo })
  @ApiInternalServerErrorResponse()
  async deleteEventParty(
    @Query('eventId') eventId: number,
    @Query('partyId') partyId: number,
    @SecureUser() secureUser: SecureUserPayload,
    @Query('newPartyId') newPartyId?: number,
  ): Promise<DeleteDataInstanceInfo> {
    return await this.command.execute(
      new DeleteEventPartyCommand(eventId, partyId, secureUser, newPartyId),
    );
  }

  @Get('fetch')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'page',
    description: 'Page',
  })
  @ApiQuery({
    type: Number,
    required: true,
    example: 10,
    name: 'pageSize',
    description: 'Page Size',
  })
  @ApiQuery({
    type: Boolean,
    required: false,
    name: 'isActive',
    description: 'Is event active?',
  })
  @ApiOkResponse({ type: EventsResponse })
  @ApiInternalServerErrorResponse()
  async fetchEvents(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @SecureUser() secureUser: SecureUserPayload,
    @Query('isActive') isActive?: boolean,
  ): Promise<EventsResponse> {
    return await this.queryBus.execute(
      new FetchEventsQuery(page, pageSize, isActive, secureUser),
    );
  }

  @Get('guest-ids')
  @ApiQuery({
    type: Number,
    required: false,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiOkResponse({ type: EventGuestIdInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async fetchEventGuestIds(
    @Req() req: Request,
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<EventGuestIdInfo[]> {
    return await this.queryBus.execute(
      new FetchEventGuestIdsQuery(eventId, secureUser),
    );
  }

  @Get('info')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiOkResponse({ type: EventsResponse })
  @ApiInternalServerErrorResponse()
  async fetchEventInfo(
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<EventsResponse> {
    return await this.queryBus.execute(
      new FetchEventInfoQuery(eventId, secureUser),
    );
  }

  @Post('create')
  @ApiOkResponse({ type: EventInfo })
  @ApiInternalServerErrorResponse()
  async createEvent(
    @Req() req: Request,
    @Body() body: CreateEventDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<EventInfo> {
    return await this.command.execute(new CreateEventCommand(secureUser, body));
  }

  @Patch('update')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiOkResponse({ type: EventInfo })
  @ApiInternalServerErrorResponse()
  async updateEvent(
    @Body() body: UpdateEventDTO,
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<EventInfo> {
    return await this.command.execute(
      new UpdateEventCommand(eventId, body, secureUser),
    );
  }

  @Delete('delete')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiOkResponse({ type: DeleteDataInstanceInfo })
  @ApiInternalServerErrorResponse()
  async deleteEvent(
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DeleteDataInstanceInfo> {
    return await this.command.execute(
      new DeleteEventCommand(eventId, secureUser),
    );
  }

  @Get('guests/fetch')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'page',
    description: 'Page',
  })
  @ApiQuery({
    type: Number,
    required: true,
    example: 10,
    name: 'pageSize',
    description: 'Page Size',
  })
  @ApiOkResponse({ type: GuestsResponse })
  @ApiInternalServerErrorResponse()
  async fetchEventGuests(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('eventId') eventId: number,
    @Query('pageSize') pageSize: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<GuestsResponse> {
    return await this.queryBus.execute(
      new FetchEventGuestsQuery(eventId, page, pageSize, secureUser),
    );
  }

  @Get('guests/search')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiQuery({
    type: Number,
    required: false,
    example: 1,
    name: 'page',
    description: 'Page',
  })
  @ApiQuery({
    type: Number,
    required: false,
    example: 10,
    name: 'pageSize',
    description: 'Page Size',
  })
  @ApiQuery({
    type: String,
    required: false,
    example: 'John Doe',
    name: 'searchQuery',
    description: 'Query',
  })
  @ApiQuery({
    type: String,
    required: false,
    name: 'guestParty',
    example: 'John Doe',
    description: "Guest party e.g Groom's family",
  })
  @ApiQuery({
    type: String,
    required: false,
    example: InvitationRSVPEnum.AWAITING || '',
    name: 'rsvpStatus',
    description: 'RSVP Status',
  })
  @ApiQuery({
    type: String,
    required: false,
    example: InvitationStatusEnum.PENDING || '',
    name: 'inviteStatus',
    description: 'inviteStatus',
  })
  @ApiOkResponse({ type: GuestsResponse })
  @ApiInternalServerErrorResponse()
  async searchEventGuests(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('eventId') eventId: number,
    @Query('guestParty') guestParty?: string,
    @Query('inviteStatus') inviteStatus?: string,
    @Query('rsvpStatus') rsvpStatus?: string,
    @Query('searchQuery') searchQuery?: string,
    @SecureUser() secureUser?: SecureUserPayload,
  ): Promise<GuestsResponse> {
    return await this.queryBus.execute(
      new SearchEventGuestsQuery(
        eventId,
        guestParty ? guestParty : null,
        searchQuery ? searchQuery : null,
        inviteStatus,
        rsvpStatus,
        page,
        pageSize,
        secureUser,
      ),
    );
  }

  @Get('guests/info')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'guestId',
    description: 'Guest Primary ID',
  })
  @ApiOkResponse({ type: GuestProfileInfo })
  @ApiInternalServerErrorResponse()
  async fetchEventGuestInfo(
    @Query('guestId') guestId: number,
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<GuestProfileInfo> {
    return await this.queryBus.execute(
      new FetchEventGuestInfoQuery(eventId, guestId, secureUser),
    );
  }

  @Patch('guests/update-party')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'partyId',
    description: 'Event Party Primary ID',
  })
  @ApiQuery({
    type: Number,
    isArray: true,
    required: true,
    example: [1],
    name: 'guestIds',
    description: 'Guest Primary IDs',
  })
  @ApiOkResponse({ type: GuestInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async addEventGuestsToParty(
    @Query('eventId') eventId: number,
    @Query('partyId') partyId: number,
    @Query('guestIds') guestIds: number[],
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<GuestInfo[]> {
    return await this.command.execute(
      new AddEventGuestsToPartyCommand(eventId, partyId, guestIds, secureUser),
    );
  }

  @Post('guests/add')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiOkResponse({ type: GuestInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async addEventGuests(
    @Body() body: AddEventGuestsDTO,
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<GuestInfo[]> {
    return await this.command.execute(
      new AddEventGuestsCommand(eventId, body, secureUser),
    );
  }

  @Patch('guests/update')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'guestId',
    description: 'Guest Primary ID',
  })
  @ApiOkResponse({ type: GuestInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async updateEventGuests(
    @Body() body: UpdateEventGuestDTO,
    @Query('eventId') eventId: number,
    @Query('guestId') guestId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<GuestInfo[]> {
    return await this.command.execute(
      new UpdateEventGuestCommand(eventId, guestId, body, secureUser),
    );
  }

  @Post('guests/invite')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'guestId',
    description: 'Guest Primary ID',
  })
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async inviteEventGuest(
    @Body() body: InviteEventGuestDTO,
    @Query('eventId') eventId: number,
    @Query('guestId') guestId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<void> {
    return await this.command.execute(
      new InviteEventGuestCommand(eventId, guestId, body, secureUser),
    );
  }

  @Post('guests/invite-multiple')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async inviteEventGuests(
    @Body() body: InviteEventGuestsDTO,
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<void> {
    return await this.command.execute(
      new InviteEventGuestsCommand(eventId, body, secureUser),
    );
  }

  @Delete('guests/remove')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'guestId',
    description: 'Guest Primary ID',
  })
  @ApiOkResponse({ type: DeleteDataInstanceInfo })
  @ApiInternalServerErrorResponse()
  async deleteEventGuest(
    @Query('guestId') guestId: number,
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DeleteDataInstanceInfo> {
    return await this.command.execute(
      new RemoveEventGuestCommand(eventId, guestId, secureUser),
    );
  }

  @Delete('guests/remove-multiple')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiQuery({
    type: Number,
    isArray: true,
    required: true,
    example: [1],
    name: 'guestIds',
    description: 'Guest Primary IDs',
  })
  @ApiOkResponse({ type: DeleteDataInstanceInfo })
  @ApiInternalServerErrorResponse()
  async deleteMultipleEventGuests(
    @Query('guestIds') guestIds: number[],
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DeleteDataInstanceInfo> {
    return await this.command.execute(
      new RemoveMultipleEventGuestsCommand(eventId, guestIds, secureUser),
    );
  }
}
