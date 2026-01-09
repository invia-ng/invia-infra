import {
  UpdateEventDTO,
  CreateEventDTO,
  AddEventGuestsDTO,
  InviteEventGuestsDTO,
  CreateEventPartyDTO,
} from '../interface';
import {
  FetchEventsQuery,
  FetchEventInfoQuery,
  FetchEventGuestsQuery,
  FetchEventPartiesQuery,
  SearchEventGuestsQuery,
} from '../queries/impl';
import {
  Get,
  Req,
  Post,
  Body,
  Query,
  Delete,
  UseGuards,
  Controller,
  Patch,
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
  InviteEventGuestsCommand,
  RemoveMultipleEventGuestsCommand,
} from '../commands/impl';
import {
  EventInfo,
  EventPartyInfo,
  EventsResponse,
} from '@app/common/src/models/event.model';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventService } from '../services/event.service';
import { DeleteDataInstanceInfo } from '../interface/schema';
import { SecureUserPayload } from '@app/common/src/interface';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { SecureUser } from '@app/common/src/decorator/user.decorator';
import { GuestInfo, GuestsResponse } from '@app/common/src/models/guest.model';

@ApiTags('event')
@Controller({ path: '' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly eventService: EventService,
  ) {}

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
  @ApiOkResponse({ type: DeleteDataInstanceInfo })
  @ApiInternalServerErrorResponse()
  async deleteEventParty(
    @Query('eventId') eventId: number,
    @Query('partyId') partyId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DeleteDataInstanceInfo> {
    return await this.command.execute(
      new DeleteEventPartyCommand(eventId, partyId, secureUser),
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
  @ApiOkResponse({ type: EventsResponse })
  @ApiInternalServerErrorResponse()
  async fetchEvents(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<EventsResponse> {
    return await this.queryBus.execute(
      new FetchEventsQuery(page, pageSize, secureUser),
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
    type: String,
    required: true,
    example: 'John Doe',
    name: 'searchQuery',
    description: 'Query',
  })
  @ApiQuery({
    type: String,
    required: true,
    name: 'guestParty',
    example: 'John Doe',
    description: "Guest party e.g Groom's family",
  })
  @ApiQuery({
    type: Boolean,
    required: true,
    example: true,
    name: 'rsvpStatus',
    description: 'RSVP Status',
  })
  @ApiQuery({
    type: Boolean,
    required: true,
    example: true,
    name: 'invited',
    description: 'Invited',
  })
  @ApiOkResponse({ type: GuestsResponse })
  @ApiInternalServerErrorResponse()
  async searchEventGuests(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('eventId') eventId: number,
    @Query('guestParty') guestParty: string,
    @Query('invited') invited: boolean,
    @Query('rsvpStatus') rsvpStatus: boolean,
    @Query('searchQuery') searchQuery: string,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<GuestsResponse> {
    return await this.queryBus.execute(
      new SearchEventGuestsQuery(
        eventId,
        guestParty,
        searchQuery,
        invited,
        rsvpStatus,
        page,
        pageSize,
        secureUser,
      ),
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

  @Post('guests/invite')
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
