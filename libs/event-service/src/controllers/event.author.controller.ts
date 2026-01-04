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
  ApiHeader,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AddEventGuestsDTO } from '../interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventService } from '../services/event.service';
import { FetchEventAuthorGuestsQuery,} from '../queries/impl';
import { GuestInfo, GuestsResponse } from '@app/common/src/models/guest.model';
import { AuthenticateShareFormInfo, DeleteDataInstanceInfo } from '../interface/schema';
import { AddEventAuthorGuestsCommand, AuthenticateShareFormPasscodeCommand, RemoveEventAuthorGuestCommand, RemoveMultipleEventAuthorGuestsCommand } from '../commands/impl';

@ApiTags('event-author')
@Controller({ path: 'author' })
@ApiBearerAuth()
export class EventAuthorController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly eventService: EventService,
  ) {}

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
  @ApiOkResponse({ type:  AuthenticateShareFormInfo })
  @ApiInternalServerErrorResponse()
  async authenticateShareForm(
    @Query('passcode') passcode: string,
    @Query('eventHash') eventHash: string,
  ): Promise<AuthenticateShareFormInfo> {
    return await this.command.execute(
      new AuthenticateShareFormPasscodeCommand(
        eventHash,
        passcode,
      ),
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
  @ApiOkResponse({ type:  GuestsResponse })
  @ApiInternalServerErrorResponse()
  async fetchEventGuests(
    @Query('page') page: number,
    @Headers('AccessToken') accessToken: string,
    @Query('pageSize') pageSize: number,
  ): Promise<GuestsResponse> {
    return await this.queryBus.execute(
      new FetchEventAuthorGuestsQuery(
        page,
        pageSize,
        accessToken,
      ),
    );
  }

  @Post('guests/add')
  @ApiHeader({
    required: true,
    example: '<access_token>',
    name: 'AccessToken',
    description: 'Access Token',  
  })
  @ApiOkResponse({ type:  GuestInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async addEventGuests(
    @Body() body: AddEventGuestsDTO,
    @Headers('AccessToken') accessToken: string,
  ): Promise<GuestInfo[]> {
    return await this.command.execute(
      new AddEventAuthorGuestsCommand(
        body,
        accessToken,
      ),
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
  @ApiOkResponse({ type:  DeleteDataInstanceInfo, })
  @ApiInternalServerErrorResponse()
  async deleteEventGuest(
    @Query('guestId') guestId: number,
    @Headers('AccessToken') accessToken: string,
  ): Promise<DeleteDataInstanceInfo> {
    return await this.command.execute(
      new RemoveEventAuthorGuestCommand(
        guestId,
        accessToken,
      ),
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
  @ApiOkResponse({ type:  DeleteDataInstanceInfo, })
  @ApiInternalServerErrorResponse()
  async deleteMultipleEventGuests(
    @Query('guestIds') guestIds: number[],
    @Query('eventId') eventId: number,
    @Headers('AccessToken') accessToken: string,
  ): Promise<DeleteDataInstanceInfo> {
    return await this.command.execute(
      new RemoveMultipleEventAuthorGuestsCommand(
        guestIds,
        accessToken,
      ),
    );
  }
}
