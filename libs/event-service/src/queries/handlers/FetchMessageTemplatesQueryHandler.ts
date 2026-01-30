import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FetchMessageTemplatesQuery } from '../impl';
import {
  MessageTemplate,
  MessageTemplateInfo,
  FollowupMessageTemplate,
  MessageTemplatesResponse,
} from '@app/common/src/models/message.template.model';
import { Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchMessageTemplatesQuery)
export class FetchMessageTemplatesQueryHandler implements IQueryHandler<
  FetchMessageTemplatesQuery,
  MessageTemplatesResponse
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

  async execute(query: FetchMessageTemplatesQuery) {
    try {
      this.logger.log('[FETCH-MESSAGE-TEMPLATES-QUERY-PROCESSING]');

      const { page, pageSize, secureUser } = query;

      const messages: MessageTemplateInfo[] = [];

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
        throw new NotFoundException(`Business record not found for user`);
      }

      const [_messages, totalCount] =
        await this.messageTemplateRepository.findAndCount({
          where: {
            business: {
              id: business.id,
            },
          },
          order: {
            createdAt: 'DESC',
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
        });

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNext = page < totalPages;

      this.logger.log('[FETCH-MESSAGE-TEMPLATES-QUERY-SUCCESS]');

      await Promise.all(_messages.map(async (message) => {
        try {
          this.logger.log(`[FETCH-FOLLOWUPMESSAGE-TEMPLATE-MANAGER-PROCESSING]`);

          const followupTemplates = await this.followupMessageTemplateRepository.find({
            where: {
              messageTemplate: {
                id: message.id,
              },
            },
          });

          this.logger.log(`[FETCH-FOLLOWUPMESSAGE-TEMPLATE-MANAGER-SUCCESS]`);

          return messages.push(modelsFormatter.FormatMessageTemplateInfo(message, followupTemplates));
        } catch (error) {
          this.logger.error(`[FETCH-MESSAGE-TEMPLATES-QUERY-ERROR] :: ${error}`);
        }
      }));


      return {
        hasNext,
        messages,
        totalPages,
      } as unknown as MessageTemplatesResponse;
    } catch (error) {
      this.logger.error('[FETCH-MESSAGE-TEMPLATES-QUERY-ERROR]', error);

      throw error;
    }
  }
}
