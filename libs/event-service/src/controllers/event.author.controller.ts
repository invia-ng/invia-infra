import {
  AddEventGuestsDTO,
  InviteEventGuestDTO,
  InviteEventGuestsDTO,
  UpdateEventGuestDTO,
} from '../interface';
import {
  Get,
  Req,
  Post,
  Body,
  Query,
  Delete,
  Controller,
  Headers,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiHeader,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  AddEventAuthorGuestsCommand,
  RemoveEventAuthorGuestCommand,
  EventAuthorInviteEventGuestsCommand,
  AuthenticateShareFormPasscodeCommand,
  RemoveMultipleEventAuthorGuestsCommand,
  EventAuthorInviteEventGuestCommand,
  EventAuthorUpdateEventGuestCommand,
  AuthenticateShareFormPasscodeWithEmailCommand,
} from '../commands/impl';
import {
  DeleteDataInstanceInfo,
  AuthenticateShareFormInfo,
  EventGuestIdInfo,
  GuestTimelineActionEnumInfo,
} from '../interface/schema';
import { InvitationRSVPEnum, InvitationStatusEnum } from '@app/common/src/constants/enums';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventService } from '../services/event.service';
import {
  EventAuthorFetchEventGuestIdsQuery,
  EventAuthorFetchEventGuestInfoQuery,
  EventAuthorFetchEventInfoQuery,
  EventAuthorFetchEventPartiesQuery,
  EventAuthorFetchGuestTimelineEnumsQuery,
  EventAuthorSearchEventGuestsQuery,
  FetchEventAuthorGuestsQuery,
} from '../queries/impl';
import {
  GuestInfo,
  GuestProfileInfo,
  GuestsResponse,
} from '@app/common/src/models/guest.model';
import { EventPartyInfo, EventsResponse } from '@app/common/src/models/event.model';
import { GuestTimelineActionEnum } from '@app/common/src/constants/enums';

@ApiTags('event-author')
@Controller({ path: 'author' })
@ApiBearerAuth()
export class EventAuthorController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly eventService: EventService,
  ) { }

  @Post('authenticate')
  @ApiQuery({
    type: String,
    required: true,
    example: '315890',
    name: 'passcode',
    description: 'Passcode',
  })
  @ApiQuery({
    type: String,
    required: true,
    example: '928991HJA8191MHGA8',
    name: 'eventHash',
    description: 'Event Primary ID',
  })
  @ApiOkResponse({ type: AuthenticateShareFormInfo })
  @ApiInternalServerErrorResponse()
  async authenticateShareForm(
    @Query('passcode') passcode: string,
    @Query('eventHash') eventHash: string,
  ): Promise<AuthenticateShareFormInfo> {
    return await this.command.execute(
      new AuthenticateShareFormPasscodeCommand(eventHash, passcode),
    );
  }

  @Post('authenticate-with-email')
  @ApiQuery({
    type: String,
    required: true,
    example: '315890',
    name: 'passcode',
    description: 'Passcode',
  })
  @ApiQuery({
    type: String,
    required: true,
    example: '928991HJA8191MHGA8',
    name: 'eventHash',
    description: 'Event Primary ID',
  })
  @ApiQuery({
    type: String,
    required: true,
    example: 'tobiasrok24@gmail.com',
    name: 'guestEmail',
    description: 'Guest Email',
  })
  @ApiOkResponse({ type: AuthenticateShareFormInfo })
  @ApiInternalServerErrorResponse()
  async authenticateShareFormWithEmail(
    @Query('passcode') passcode: string,
    @Query('eventHash') eventHash: string,
    @Query('guestEmail') guestEmail: string,
  ): Promise<AuthenticateShareFormInfo> {
    return await this.command.execute(
      new AuthenticateShareFormPasscodeWithEmailCommand(passcode, eventHash, guestEmail),
    );
  }

  @Get('info')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',
  })
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
    @Headers('AccessToken') accessToken: string,
  ): Promise<EventsResponse> {
    return await this.queryBus.execute(
      new EventAuthorFetchEventInfoQuery(eventId, accessToken),
    );
  }

  @Get('parties')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',
  })
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
    @Headers('AccessToken') accessToken: string,
  ): Promise<EventPartyInfo> {
    return await this.queryBus.execute(
      new EventAuthorFetchEventPartiesQuery(eventId, accessToken),
    );
  }

  @Get('guests/fetch')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',
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
    @Query('page') page: number,
    @Headers('AccessToken') accessToken: string,
    @Query('pageSize') pageSize: number,
  ): Promise<GuestsResponse> {
    return await this.queryBus.execute(
      new FetchEventAuthorGuestsQuery(page, pageSize, accessToken),
    );
  }

  @Get('guest-ids')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',
  })
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiOkResponse({ type: EventGuestIdInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async fetchEventGuestIds(
    @Req() req: Request,
    @Query('eventId') eventId: number,
    @Headers('AccessToken') accessToken: string,
  ): Promise<EventGuestIdInfo[]> {
    return await this.queryBus.execute(
      new EventAuthorFetchEventGuestIdsQuery(eventId, accessToken),
    );
  }

  @Get('guests/timeline/enums')
  @ApiOkResponse({ type: GuestTimelineActionEnumInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async fetchGuestTimelineEnums(
  ): Promise<GuestTimelineActionEnumInfo[]> {
    return await this.queryBus.execute(
      new EventAuthorFetchGuestTimelineEnumsQuery(),
    );
  }

  @Get('guests/search')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',
  })
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
    description: 'Invited',
  })
  @ApiOkResponse({ type: GuestsResponse })
  @ApiInternalServerErrorResponse()
  async searchEventGuests(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('eventId') eventId: number,
    @Headers('AccessToken') accessToken: string,
    @Query('guestParty') guestParty?: string,
    @Query('inviteStatus') inviteStatus?: string,
    @Query('rsvpStatus') rsvpStatus?: string,
    @Query('searchQuery') searchQuery?: string,
  ): Promise<GuestsResponse> {
    return await this.queryBus.execute(
      new EventAuthorSearchEventGuestsQuery(
        eventId,
        guestParty ? guestParty : null,
        searchQuery ? searchQuery : null,
        inviteStatus,
        rsvpStatus,
        page,
        pageSize,
        accessToken,
      ),
    );
  }

  @Get('guests/info')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',
  })
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
    @Headers('AccessToken') accessToken: string,
  ): Promise<GuestProfileInfo> {
    return await this.queryBus.execute(
      new EventAuthorFetchEventGuestInfoQuery(eventId, guestId, accessToken),
    );
  }

  @Post('guests/add')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',
  })
  @ApiOkResponse({ type: GuestInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async addEventGuests(
    @Body() body: AddEventGuestsDTO,
    @Headers('AccessToken') accessToken: string,
  ): Promise<GuestInfo[]> {
    return await this.command.execute(
      new AddEventAuthorGuestsCommand(body, accessToken),
    );
  }

  @Patch('guests/update')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',
  })
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
    @Headers('AccessToken') accessToken: string,
  ): Promise<GuestInfo[]> {
    return await this.command.execute(
      new EventAuthorUpdateEventGuestCommand(
        eventId,
        guestId,
        body,
        accessToken,
      ),
    );
  }

  @Post('guests/invite')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',
  })
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
    @Headers('AccessToken') accessToken: string,
  ): Promise<void> {
    return await this.command.execute(
      new EventAuthorInviteEventGuestCommand(
        eventId,
        guestId,
        body,
        accessToken,
      ),
    );
  }

  @Post('guests/invite-multiple')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',
  })
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
    @Headers('AccessToken') accessToken: string,
  ): Promise<void> {
    return await this.command.execute(
      new EventAuthorInviteEventGuestsCommand(eventId, body, accessToken),
    );
  }

  @Delete('guests/remove')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',
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
    @Headers('AccessToken') accessToken: string,
  ): Promise<DeleteDataInstanceInfo> {
    return await this.command.execute(
      new RemoveEventAuthorGuestCommand(guestId, accessToken),
    );
  }

  @Delete('guests/remove-multiple')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',
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
    @Headers('AccessToken') accessToken: string,
  ): Promise<DeleteDataInstanceInfo> {
    return await this.command.execute(
      new RemoveMultipleEventAuthorGuestsCommand(guestIds, accessToken),
    );
  }
}
