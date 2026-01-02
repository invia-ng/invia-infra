import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMessageTemplateCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { MessageTemplate, MessageTemplateInfo } from '@app/common/src/models/message.template.model';

@CommandHandler(UpdateMessageTemplateCommand)
export class UpdateMessageTemplateHandler
  implements ICommandHandler<UpdateMessageTemplateCommand, MessageTemplateInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(MessageTemplate)
    private readonly messageTemplateRepository: Repository<MessageTemplate>,
  ) {}

  async execute(command: UpdateMessageTemplateCommand) {
    try {
      this.logger.log(`[UPDATE-EVENT-GUESTS-HANDLER-PROCESSING]`);

      const { messageId, payload, secureUser } = command;

      const template = await this.messageTemplateRepository.findOne({
        where: {
          id: messageId,
        },
      });

      if (!template) {
        throw new NotFoundException(`Action not allowed`);
      }

      Object.assign(template, {
        name: payload.name,
        eventType: payload.eventType,
        message: payload.message,
        sendFollowup: payload.sendFollowup,
        followupInterval: payload.followupInterval,
        followupCondition: payload.followupCondition,
      });

      const instance = await this.messageTemplateRepository.save(template);
			
      this.logger.log(`[UPDATE-EVENT-GUESTS-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatMessageTemplateInfo(instance);
    } catch (error) {
      this.logger.log(`[UPDATE-EVENT-GUESTS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
