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
import { FollowupMessageTemplate, MessageTemplate, MessageTemplateInfo } from '@app/common/src/models/message.template.model';

@CommandHandler(UpdateMessageTemplateCommand)
export class UpdateMessageTemplateHandler
  implements ICommandHandler<UpdateMessageTemplateCommand, MessageTemplateInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(MessageTemplate)
    private readonly messageTemplateRepository: Repository<MessageTemplate>,
    @InjectRepository(FollowupMessageTemplate)
    private readonly followupMessageTemplateRepository: Repository<FollowupMessageTemplate>,
  ) { }

  async execute(command: UpdateMessageTemplateCommand) {
    try {
      this.logger.log(`[UPDATE-EVENT-GUESTS-HANDLER-PROCESSING]`);

      const { messageId, payload, secureUser } = command;

      const followupInvitations: FollowupMessageTemplate[] = [];

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

      await Promise.all(payload.followupInvitations.map(async (followupInvitation) => {
        try {
          this.logger.log(`[UPDATE-EVENT-GUESTS-MANAGER-PROCESSING]`);

          const followupInvitationInstance = await this.followupMessageTemplateRepository.findOne({
            where: {
              id: followupInvitation.id,
            },
          });

          if (!followupInvitationInstance) {
            throw new NotFoundException(`Followup message tem not allowed`);
          }

          Object.assign(followupInvitationInstance, {
            message: followupInvitation.message,
            interval: followupInvitation.interval,
            condition: followupInvitation.condition,
          });

          const _instance = await this.followupMessageTemplateRepository.save(followupInvitationInstance);

          this.logger.log(`[UPDATE-EVENT-GUESTS-MANAGER-SUCCESS]`);

          return followupInvitations.push(_instance);
        } catch (error) {
          this.logger.log(`[UPDATE-EVENT-GUESTS-MANAGER-ERROR] :: ${error}`);
        }
      }));

      this.logger.log(`[UPDATE-EVENT-GUESTS-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatMessageTemplateInfo(instance, followupInvitations);
    } catch (error) {
      this.logger.log(`[UPDATE-EVENT-GUESTS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
