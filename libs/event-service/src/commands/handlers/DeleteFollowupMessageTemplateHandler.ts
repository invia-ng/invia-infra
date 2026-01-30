import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteFollowupMessageTemplateCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDataInstanceInfo } from '../../interface/schema';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { FollowupMessageTemplate } from '@app/common/src/models/message.template.model';

@CommandHandler(DeleteFollowupMessageTemplateCommand)
export class DeleteFollowupMessageTemplateHandler
  implements ICommandHandler<DeleteFollowupMessageTemplateCommand, DeleteDataInstanceInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(FollowupMessageTemplate)
    private readonly followupMessageTemplateRepository: Repository<FollowupMessageTemplate>,
  ) { }

  async execute(command: DeleteFollowupMessageTemplateCommand) {
    try {
      this.logger.log(`[DELETE-FOLLOWUP-MESSAGE-TEMPLATE-HANDLER-PROCESSING]`);

      const { messageId, followupMessageId, secureUser } = command;

      const template = await this.followupMessageTemplateRepository.findOne({
        where: {
          id: followupMessageId,
          messageTemplate: {
            id: messageId,
          }
        },
      });

      if (!template) {
        throw new NotFoundException('Message template not found.');
      }

      await this.followupMessageTemplateRepository.remove(template);

      this.logger.log(`[DELETE-FOLLOWUP-MESSAGE-TEMPLATE-HANDLER-SUCCESS]`);

      return {
        status: true,
        message: 'Message template deleted successfully.',
      };
    } catch (error) {
      this.logger.log(`[DELETE-FOLLOWUP-MESSAGE-TEMPLATE-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
