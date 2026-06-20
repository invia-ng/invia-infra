/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessMetaWhatsappWebhookCommand } from '../impl';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { EventBus, ICommandHandler, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(ProcessMetaWhatsappWebhookCommand)
export class ProcessMetaWhatsappWebhookHandler implements ICommandHandler<
  ProcessMetaWhatsappWebhookCommand,
  void
> {
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  async execute(query: ProcessMetaWhatsappWebhookCommand): Promise<void> {
    try {
      this.logger.log(`[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-PROCESSING]`);

      const { payload } = query;

      console.log('[PROCESS-META-WHATSAPP-WEBHOOK-PAYLOAD::-1] :: ');

      console.log(JSON.stringify(payload, null, 2));
      console.log(payload);

      console.log('[PROCESS-META-WHATSAPP-WEBHOOK-PAYLOAD::-2] :: ');

      this.logger.log(`[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(
        `[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
