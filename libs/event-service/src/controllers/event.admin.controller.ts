import {
  Get,
  Req,
  Post,
  Body,
  Query,
  Delete,
  Controller,
  UseGuards,
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
import { JwtAuthGuard } from '@app/common/src/auth/jwt-auth.guard';
import { GenerateShareFormPasscodeInfo } from '../interface/schema';
import { GenerateShareFormPasscodeCommand } from '../commands/impl';
import { SecureUser } from '@app/common/src/decorator/user.decorator';

@ApiTags('event-admin')
@Controller({ path: '' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class EventAdminController {
  constructor(
    public queryBus: QueryBus,
    public command: CommandBus,
    public readonly eventService: EventService,
  ) {}

  @Post('share-form/generate-passcode')
  @ApiQuery({
    type: Number,
    required: true,
    example: 1,
    name: 'eventId',
    description: 'Event Primary ID',
  })
  @ApiOkResponse({ type:  GenerateShareFormPasscodeInfo })
  @ApiInternalServerErrorResponse()
  async generateShareFormPasscode(
    @Query('eventId') eventId: number,
    @SecureUser() secureUser: SecureUserPayload,
  ): Promise<GenerateShareFormPasscodeInfo> {
    return await this.command.execute(
      new GenerateShareFormPasscodeCommand(
        eventId,
        secureUser,
      ),
    );
  }
}
