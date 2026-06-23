/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ProcessResendWebhookCommand } from '../impl';
import { Inject } from '@nestjs/common';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { EventBus, ICommandHandler, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(ProcessResendWebhookCommand)
export class ProcessResendWebhookHandler implements ICommandHandler<
  ProcessResendWebhookCommand,
  void
> {
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  async execute(query: ProcessResendWebhookCommand): Promise<void> {
    try {
      this.logger.log(`[PROCESS-RESEND-WEBHOOK-HANDLER-PROCESSING]`);

      const { payload } = query;

      console.log('[PROCESS-RESEND-WEBHOOK-PAYLOAD::-1] :: ');

      console.log(JSON.stringify(payload, null, 2));
      console.log(payload);

      console.log('[PROCESS-RESEND-WEBHOOK-PAYLOAD::-2] :: ');

      this.logger.log(`[PROCESS-RESEND-WEBHOOK-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[PROCESS-RESEND-WEBHOOK-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
