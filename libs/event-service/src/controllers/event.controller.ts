import {
  Get,
  Req,
  Post,
  Body,
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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventService } from '../services/event.service';
import { DeleteDataInstanceInfo } from '../interface/schema';
import { SecureUserPayload } from '@app/common/src/interface';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { SecureUser } from '@app/common/src/decorator/user.decorator';
import { FetchEventGuestsQuery, FetchEventsQuery } from '../queries/impl';
import { EventInfo, EventsResponse } from '@app/common/src/models/event.model';
import { GuestInfo, GuestsResponse } from '@app/common/src/models/guest.model';
import { AddEventGuestsDTO, CreateEventDTO, InviteEventGuestsDTO } from '../interface';
import { AddEventGuestsCommand, CreateEventCommand, InviteEventGuestsCommand, RemoveEventGuestCommand, RemoveMultipleEventGuestsCommand } from '../commands/impl';

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
  @ApiOkResponse({ type:  EventsResponse })
  @ApiInternalServerErrorResponse()
  async fetchEvents(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<EventsResponse> {
    return await this.queryBus.execute(
      new FetchEventsQuery(
        page,
        pageSize,
        secureUser,
      ),
    );
  }

  @Post('create')
  @ApiOkResponse({ type:  EventInfo })
  @ApiInternalServerErrorResponse()
  async createEvent(
    @Req() req: Request,
    @Body() body: CreateEventDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<EventInfo> {
    return await this.command.execute(
      new CreateEventCommand(
        secureUser,
        body,
      ),
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
  @ApiOkResponse({ type:  GuestsResponse })
  @ApiInternalServerErrorResponse()
  async fetchEventGuests(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('eventId') eventId: number,
    @Query('pageSize') pageSize: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<GuestsResponse> {
    return await this.queryBus.execute(
      new FetchEventGuestsQuery(
        eventId,
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
  @ApiOkResponse({ type:  GuestInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async addEventGuests(
    @Body() body: AddEventGuestsDTO,
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<GuestInfo[]> {
    return await this.command.execute(
      new AddEventGuestsCommand(
        eventId,
        body,
        secureUser,
      ),
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
      new InviteEventGuestsCommand(
        eventId,
        body,
        secureUser,
      ),
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
  @ApiOkResponse({ type:  DeleteDataInstanceInfo, })
  @ApiInternalServerErrorResponse()
  async deleteEventGuest(
    @Query('guestId') guestId: number,
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DeleteDataInstanceInfo> {
    return await this.command.execute(
      new RemoveEventGuestCommand(
        eventId,
        guestId,
        secureUser,
      ),
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
  @ApiOkResponse({ type:  DeleteDataInstanceInfo, })
  @ApiInternalServerErrorResponse()
  async deleteMultipleEventGuests(
    @Query('guestIds') guestIds: number[],
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DeleteDataInstanceInfo> {
    return await this.command.execute(
      new RemoveMultipleEventGuestsCommand(
        eventId,
        guestIds,
        secureUser,
      ),
    );
  }
}
