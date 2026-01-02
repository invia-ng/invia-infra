import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteMessageTemplateCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDataInstanceInfo } from '../../interface/schema';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { MessageTemplate } from '@app/common/src/models/message.template.model';

@CommandHandler(DeleteMessageTemplateCommand)
export class DeleteMessageTemplateHandler
  implements ICommandHandler<DeleteMessageTemplateCommand, DeleteDataInstanceInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(MessageTemplate)
    private readonly messageTemplateRepository: Repository<MessageTemplate>,
  ) {}

  async execute(command: DeleteMessageTemplateCommand) {
    try {
      this.logger.log(`[DELETE-MESSAGE-TEMPLATE-HANDLER-PROCESSING]`);

      const { messageId, secureUser } = command;

      const template = await this.messageTemplateRepository.findOne({
        where: {
          id: messageId,
        },
      });

      if (!template) {
        throw new NotFoundException('Message template not found.');
      }

      await this.messageTemplateRepository.remove(template);

      this.logger.log(`[DELETE-MESSAGE-TEMPLATE-HANDLER-SUCCESS]`);

      return {
        status: true,
        message: 'Message template deleted successfully.',
      };
    } catch (error) {
      this.logger.log(`[DELETE-MESSAGE-TEMPLATE-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
