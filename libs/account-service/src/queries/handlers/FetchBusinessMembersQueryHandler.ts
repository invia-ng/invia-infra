import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FetchBusinessMembersInfoQuery } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { BusinessMemberInfo } from '@app/common/src/models/account.model';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchBusinessMembersInfoQuery)
export class FetchBusinessMembersQueryHandler implements IQueryHandler<
  FetchBusinessMembersInfoQuery,
  BusinessMemberInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) { }

  async execute(query: FetchBusinessMembersInfoQuery) {
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

      return business.members.filter((member) => member.id !== secureUser.id).map((member) =>
        modelsFormatter.FormatBusinessMemberInfo(member),
      );
    } catch (error) {
      this.logger.log(`[FETCH-BUSINESS-MEMBERS-HANDLER]: ${error}`);
      throw error;
    }
  }
}
