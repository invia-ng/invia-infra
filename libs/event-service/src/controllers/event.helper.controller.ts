import {
  Get,
  Controller,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventService } from '../services/event.service';
import { EventCategoryInfo, GuestPartyInfo } from '../interface/schema';
import { FetchEventCategoriesQuery, FetchGuestPartyQuery } from '../queries/impl';

@ApiTags('event-helper')
@Controller({ path: '' })
@ApiBearerAuth()
export class EventHelperController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly eventService: EventService,
  ) {}

  @Get('categories')
  @ApiOkResponse({ type:  EventCategoryInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async fetchEventCategories(): Promise<EventCategoryInfo[]> {
    return await this.queryBus.execute(
      new FetchEventCategoriesQuery(),
    );
  }

  @Get('guest-party-categories')
  @ApiOkResponse({ type:  GuestPartyInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async fetchGuestPartyCategories(): Promise<GuestPartyInfo[]> {
    return await this.queryBus.execute(
      new FetchGuestPartyQuery(),
    );
  }
}
