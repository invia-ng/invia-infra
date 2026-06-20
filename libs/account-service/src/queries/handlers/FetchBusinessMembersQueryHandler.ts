import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FetchBusinessMembersInfoQuery } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { Account } from '@app/common/src/models/account.model';
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
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async execute(query: FetchBusinessMembersInfoQuery) {
    try {
      this.logger.log('[FETCH-BUSINESS-MEMBERS-PROCESSING]');

      const { secureUser } = query;

      const account = await this.accountRepository.findOne({
        where: {
          id: secureUser.id,
        },
        relations: ['business', 'business.members', 'business.account'],
      });

      let business = account?.business;

      if (!business) {
        business = await this.businessRepository.findOne({
          where: {
            account: {
              id: secureUser.id,
            },
          },
        });
      }

      if (!business) {
        throw new NotFoundException(`Business record not found for user`);
      }

      this.logger.log('[FETCH-BUSINESS-MEMBERS-SUCCESS]');

      return business.members
        .concat(business.account)
        .filter((member) => member.id !== secureUser.id)
        .map((member) => modelsFormatter.FormatBusinessMemberInfo(member));
    } catch (error) {
      this.logger.error(`[FETCH-BUSINESS-MEMBERS-HANDLER]: ${error}`);
      throw error;
    }
  }
}
