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
import { EventCategoryInfo, GuestPartyInfo, MessageTemplateEnumInfo, MessageTemplateFollowupConditionInfo, MessageTemplateFollowupIntervalInfo } from '../interface/schema';
import { FetchEventCategoriesQuery, FetchGuestPartyQuery, FetchMessageTemplateFollowupConditionsQuery, FetchMessageTemplateFollowupIntervalsQuery, FetchMessageTemplateVariablesQuery } from '../queries/impl';

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

  @Get('message-template-variables')
  @ApiOkResponse({ type:  MessageTemplateEnumInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async fetchMessageVariables(): Promise<MessageTemplateEnumInfo[]> {
    return await this.queryBus.execute(
      new FetchMessageTemplateVariablesQuery(),
    );
  }

  @Get('message-template-followup-intervals')
  @ApiOkResponse({ type:  MessageTemplateFollowupIntervalInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async fetchMessageFollowupIntervals(): Promise<MessageTemplateFollowupIntervalInfo[]> {
    return await this.queryBus.execute(
      new FetchMessageTemplateFollowupIntervalsQuery(),
    );
  }

  @Get('message-template-followup-conditions')
  @ApiOkResponse({ type:  MessageTemplateFollowupConditionInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async fetchMessageFollowupConditions(): Promise<MessageTemplateFollowupConditionInfo[]> {
    return await this.queryBus.execute(
      new FetchMessageTemplateFollowupConditionsQuery(),
    );
  }
}
