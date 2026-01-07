import { In, Repository } from 'typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { FetchBusinessMemberInfoQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { BusinessInfo, Business } from '@app/common/src/models/business.model';
import { AccountInfo } from '@app/common/src/models/account.model';

@QueryHandler(FetchBusinessMemberInfoQuery)
export class FetchBusinessMembersQueryHandler implements IQueryHandler<
  FetchBusinessMemberInfoQuery,
  AccountInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async execute(query: FetchBusinessMemberInfoQuery) {
    try {
      this.logger.log('[FETCH-BUSINESS-MEMBERS-PROCESSING]');

      const { secureUser } = query;

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
        relations: ['members'],
      });

      if (!business) {
        throw new NotFoundException(`Business record not found for user`);
      }

      this.logger.log('[FETCH-BUSINESS-MEMBERS-SUCCESS]');

      return business.members.map((member) =>
        modelsFormatter.FormatAccountInfo(member),
      );
    } catch (error) {
      this.logger.log(`[FETCH-BUSINESS-MEMBERS-HANDLER]: ${error}`);
      throw error;
    }
  }
}
