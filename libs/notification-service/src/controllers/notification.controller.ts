/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ProcessMetaWhatsappWebhookCommand } from '../commands/impl';
import { Get, Post, Controller, Body, Query, Res } from '@nestjs/common';

@ApiTags('notification')
@Controller({ path: 'notification' })
export class NotificationController {
  constructor(private readonly commandBus: CommandBus) {}

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
    return await this.commandBus.execute(
      new ProcessMetaWhatsappWebhookCommand(body),
    );
  }
}
