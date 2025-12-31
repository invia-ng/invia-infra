import { In, Repository, Raw } from 'typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { FetchBusinessInfoQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { BusinessInfo, Business } from '@app/common/src/models/business.model';

@QueryHandler(FetchBusinessInfoQuery)
export class FetchBusinessInfoQueryHandler implements IQueryHandler<
  FetchBusinessInfoQuery,
  BusinessInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async execute(query: FetchBusinessInfoQuery) {
    try {
      this.logger.log('[FETCH-BUSINESS-INFO-PROCESSING]');
      
      const { secureUser } = query;
      
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

      this.logger.log('[FETCH-BUSINESS-INFO-SUCCESS]');

      return modelsFormatter.FormatBusinessInfo(business);
    } catch (error) {
      this.logger.log(`[FETCH-BUSINESS-INFO-HANDLER]: ${error}`);
      throw error;
    }
  }
}
