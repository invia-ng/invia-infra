import { Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FetchMessageTemplatesQuery } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { MessageTemplate, MessageTemplatesResponse } from '@app/common/src/models/message.template.model';

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
  ) {}

  async execute(query: FetchMessageTemplatesQuery) {
    try{
			this.logger.log('[FETCH-MESSAGE-TEMPLATES-QUERY-PROCESSING]');

      const { page, pageSize, secureUser } = query;

      const business = await this.businessRepository.findOne({
        where: [
          {
            members: Raw((alias) => `${alias} ~ :regex`, {
              regex: `(?:^|\\D)${secureUser.id}(?:\\D|$)`,
            }),
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

      const [messages, totalCount] = await this.messageTemplateRepository.findAndCount({
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

			return {
        hasNext,
        totalPages,
				messages: messages.map((message) => modelsFormatter.FormatMessageTemplateInfo(message)),
      } as unknown as MessageTemplatesResponse;
    }catch(error){
			this.logger.error('[FETCH-MESSAGE-TEMPLATES-QUERY-ERROR]', error);

			throw error;
    }
  }
}
