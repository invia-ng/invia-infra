import {
  Inject,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { CreateMessageTemplateCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import {
  MessageTemplate,
  MessageTemplateInfo,
} from '@app/common/src/models/message.template.model';

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
  ) {}

  async execute(command: CreateMessageTemplateCommand) {
    try {
      this.logger.log(`[ADD-EVENT-GUESTS-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

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

      this.logger.log(`[ADD-EVENT-GUESTS-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatMessageTemplateInfo(template);
    } catch (error) {
      this.logger.log(`[ADD-EVENT-GUESTS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
