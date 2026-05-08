import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { Get, Req, Post, Controller, Body } from '@nestjs/common';
import { ProcessMetaWhatsappWebhookCommand } from '../commands/impl';

@ApiTags('notification')
@Controller({ path: 'notification' })
export class NotificationController {
  constructor(private readonly commandBus: CommandBus) { }

  @Post('webhook/meta-whatsapp')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async webhookMetaWhatsapp(@Req() req: Request, @Body() body: any) {
    return await this.commandBus.execute(new ProcessMetaWhatsappWebhookCommand(body));
  }
}
