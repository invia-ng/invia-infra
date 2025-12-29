import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FetchDetailedAccountInfoQuery } from '../impl';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { AccountInfo, Account } from '@app/common/src/models/account.model';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchDetailedAccountInfoQuery)
export class FetchDetailedAccountInfoQueryHandler
  implements IQueryHandler<FetchDetailedAccountInfoQuery, AccountInfo>
{
  constructor(
    @InjectRepository(Account)
    private readonly userRepository: Repository<Account>,
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  async execute(query: FetchDetailedAccountInfoQuery) {
    try {
      const { secureUser } = query;

      this.logger.log('[GET-DETAILED-ACCOUNT-INFO-PROCESSING]');

      const account = await this.userRepository.findOneBy({
        id: secureUser.id,
      });

      if (!account) {
        throw new Error(`Account with id ${secureUser.id} not found`);
      }

      this.logger.log('[GET-DETAILED-ACCOUNT-INFO-SUCCESS]');

      return modelsFormatter.FormatAccountInfo(account);
    } catch (error) {
      this.logger.log(`[FETCH-DETAILED-ACCOUNT-INFO-USERS-HANDLER]: ${error}`);
      throw error;
    }
  }
}
