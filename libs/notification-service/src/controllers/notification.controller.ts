import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { Get, Req, Post, Controller, Body, Query, Res } from '@nestjs/common';
import { ProcessMetaWhatsappWebhookQuery } from '../queries/impl';

@ApiTags('notification')
@Controller({ path: 'notification' })
export class NotificationController {
  constructor(private readonly commandBus: CommandBus) { }

  @Get('webhook/meta-whatsapp')
  verifyMetaWhatsappWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: any,
  ) {
    const expectedToken = process.env.META_WHATSAPP_VERIFY_TOKEN || 'ABCD';
    
    if (mode === 'subscribe' && token === expectedToken) {
      console.log('Webhook Verified!');
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  @Post('webhook/meta-whatsapp')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async webhookMetaWhatsapp(@Body() body: any) {
    return await this.commandBus.execute(new ProcessMetaWhatsappWebhookQuery(body));
  }
}
