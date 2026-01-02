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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventService } from '../services/event.service';
import { SecureUserPayload } from '@app/common/src/interface';
import { AddEventGuestsDTO, AddMessageTemplateDTO, CreateEventDTO } from '../interface';
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { SecureUser } from '@app/common/src/decorator/user.decorator';
import { FetchMessageTemplatesQuery, FetchMessageTemplateVariablesQuery } from '../queries/impl';
import { CreateMessageTemplateCommand, DeleteMessageTemplateCommand, UpdateMessageTemplateCommand } from '../commands/impl';
import { MessageTemplateInfo } from '@app/common/src/models/message.template.model';
import { DeleteDataInstanceInfo } from '../interface/schema';

@ApiTags('messages')
@Controller({ path: '' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class EventMessageController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly eventService: EventService,
  ) {}

  @Get('message-templates')
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
  @ApiOkResponse({ type: MessageTemplateInfo, isArray: true })
  @ApiInternalServerErrorResponse()
  async fetchMessageTemplates(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<MessageTemplateInfo[]> {
    return await this.queryBus.execute(
      new FetchMessageTemplatesQuery(
        page,
        pageSize,
        secureUser,
      ),
    );
  }

  @Post('message-templates/add')
  @ApiOkResponse({ type: MessageTemplateInfo })
  @ApiInternalServerErrorResponse()
  async addMessageTemplate(
    @Body() body: AddMessageTemplateDTO,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<MessageTemplateInfo> {
    return await this.command.execute(
      new CreateMessageTemplateCommand(
        secureUser,
        body,
      ),
    );
  }

  @Patch('message-templates/update')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'messageId',
    description: 'Message Primary ID',
  })
  @ApiOkResponse({ type: MessageTemplateInfo})
  @ApiInternalServerErrorResponse()
  async updateMessageTemplate(
    @Body() body: AddMessageTemplateDTO,
    @Query('messageId') messageId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<MessageTemplateInfo> {
    return await this.command.execute(
      new UpdateMessageTemplateCommand(
        secureUser,
        messageId,
        body,
      ),
    );
  }

  @Delete('message-templates/delete')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'messageId',
    description: 'Message Primary ID',
  })
  @ApiOkResponse({ type:  DeleteDataInstanceInfo, })
  @ApiInternalServerErrorResponse()
  async deleteMessageTemplate(
    @Query('messageId') messageId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<DeleteDataInstanceInfo> {
    return await this.command.execute(
      new DeleteMessageTemplateCommand(
        messageId,
        secureUser,
      ),
    );
  }
}
