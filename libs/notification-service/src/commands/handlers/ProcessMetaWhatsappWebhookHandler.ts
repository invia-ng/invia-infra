import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import authUtils from 'libs/common/src/security/auth.utils';
import { ProcessMetaWhatsappWebhookCommand } from '../impl';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(ProcessMetaWhatsappWebhookCommand)
export class ProcessMetaWhatsappWebhookHandler implements ICommandHandler<
	ProcessMetaWhatsappWebhookCommand,
	void
> {
	constructor(
		private readonly eventBus: EventBus,
		@Inject('Logger') private readonly logger: AppLogger,
	) { }

	async execute(command: ProcessMetaWhatsappWebhookCommand) {
		try {
			this.logger.log(`[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-PROCESSING]`);

			const { payload } = command;

			console.log('[PROCESS-META-WHATSAPP-WEBHOOK-PAYLOAD] :: ', payload);

			this.logger.log(`[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-SUCCESS]`);
		} catch (error) {
			this.logger.log(`[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-ERROR] :: ${error}`);

			throw error;
		}
	}
}
