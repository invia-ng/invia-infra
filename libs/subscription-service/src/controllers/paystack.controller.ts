import { Request } from 'express';
import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { Req, Post, Controller } from '@nestjs/common';
import { PaystackWebhookCallbackCommand } from '../commands/impl';

@ApiTags('paystack-webhook')
@Controller({ path: 'paystack' })
export class PaystackController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('callback-session')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async paystackWebhookSession(@Req() req: Request): Promise<void> {
    return this.commandBus.execute(
      new PaystackWebhookCallbackCommand(req.body?.data),
    );
  }
}
