import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessMetaWhatsappWebhookQuery } from '../impl';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { EventBus, ICommandHandler, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(ProcessMetaWhatsappWebhookQuery)
export class ProcessMetaWhatsappWebhookQueryHandler implements IQueryHandler<
	ProcessMetaWhatsappWebhookQuery,
	void
> {
	constructor(
		private readonly eventBus: EventBus,
		@Inject('Logger') private readonly logger: AppLogger,
	) { }

	async execute(query: ProcessMetaWhatsappWebhookQuery): Promise<void> {
		try {
			this.logger.log(`[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-PROCESSING]`);

			const { payload } = query;

			console.log('[PROCESS-META-WHATSAPP-WEBHOOK-PAYLOAD] :: ', payload);

			this.logger.log(`[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-SUCCESS]`);
		} catch (error) {
			this.logger.log(`[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-ERROR] :: ${error}`);

			throw error;
		}
	}
}
