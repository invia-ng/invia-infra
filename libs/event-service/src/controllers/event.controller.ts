import {
  Get,
  Req,
  UseGuards,
  Controller,
  Post,
  Body,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AddEventGuestsDTO, CreateEventDTO } from '../interface';
import { FetchEventGuestsQuery, FetchEventsQuery } from '../queries/impl';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddEventGuestsCommand, CreateEventCommand, DeleteEventGuestCommand } from '../commands/impl';
import { EventService } from '../services/event.service';
import { SecureUserPayload } from '@app/common/src/interface';
import { EventInfo, EventsResponse } from '@app/common/src/models/event.model';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { SecureUser } from '@app/common/src/decorator/user.decorator';
import { GuestInfo, GuestsResponse } from '@app/common/src/models/guest.model';
import { DeleteDataInstanceInfo } from '../interface/schema';

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

  @Delete('guests/delete')
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
      new DeleteEventGuestCommand(
        guestId,
        eventId,
        secureUser,
      ),
    );
  }
}
