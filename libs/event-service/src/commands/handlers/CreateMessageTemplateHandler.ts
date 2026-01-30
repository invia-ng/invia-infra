import {
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MessageTemplate,
  MessageTemplateInfo,
  FollowupMessageTemplate,
} from '@app/common/src/models/message.template.model';
import { CreateMessageTemplateCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';

@CommandHandler(CreateMessageTemplateCommand)
export class CreateMessageTemplateHandler implements ICommandHandler<
  CreateMessageTemplateCommand,
  MessageTemplateInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(MessageTemplate)
    private readonly messageTemplateRepository: Repository<MessageTemplate>,
    @InjectRepository(FollowupMessageTemplate)
    private readonly followupMessageTemplateRepository: Repository<FollowupMessageTemplate>,
  ) { }

  async execute(command: CreateMessageTemplateCommand) {
    try {
      this.logger.log(`[CREATE-MESSAGE-TEMPLATE-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const followupTemplates: FollowupMessageTemplate[] = [];

      const business = await this.businessRepository.findOne({
        where: [
          {
            members: {
              id: secureUser.id,
            },
          },
          {
            account: {
              id: secureUser.id,
            },
          },
        ],
      });

      if (!business) {
        throw new UnauthorizedException(`Action not allowed`);
      }

      const instance = await this.messageTemplateRepository.create({
        business,
        name: payload.name,
        eventType: payload.eventType,
        message: payload.message,
        sendFollowup: payload.sendFollowup,
        followupInterval: payload.followupInterval,
        followupCondition: payload.followupCondition,
      });

      const template = await this.messageTemplateRepository.save(instance);

      if (payload.followupInvitations.length > 0) {
        await Promise.all(payload.followupInvitations.map(async (followup) => {
          try {
            this.logger.log(`[CREATE-FOLLOWUPMESSAGE-TEMPLATE-MANAGER-PROCESSING]`);

            const instance = this.followupMessageTemplateRepository.create({
              messageTemplate: template,
              message: followup.message,
              interval: followup.interval,
              condition: followup.condition,
            });

            const followupTemplate = await this.followupMessageTemplateRepository.save(instance);

            followupTemplates.push(followupTemplate);

            this.logger.log(`[CREATE-FOLLOWUPMESSAGE-TEMPLATE-MANAGER-SUCCESS]`);
          } catch (error) {
            this.logger.error(`[CREATE-FOLLOWUPMESSAGE-TEMPLATE-MANAGER-ERROR] :: ${error}`);
          }
        }));
      }

      this.logger.log(`[CREATE-MESSAGE-TEMPLATE-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatMessageTemplateInfo(template, followupTemplates);
    } catch (error) {
      this.logger.log(`[CREATE-MESSAGE-TEMPLATE-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
