import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { FetchBusinessInvitationInfoQuery } from '../impl';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { BusinessInvitationInfo } from '../../interface/schema';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Account, AccountInfo } from '@app/common/src/models/account.model';

@QueryHandler(FetchBusinessInvitationInfoQuery)
export class FetchBusinessInvitationInfoQueryHandler implements IQueryHandler<
  FetchBusinessInvitationInfoQuery,
  BusinessInvitationInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async execute(query: FetchBusinessInvitationInfoQuery) {
    try {
      this.logger.log('[FETCH-BUSINESS-INVITATION-INFO-PROCESSING]');

      const { invitationHash } = query;

      const account = await this.accountRepository.findOne({
        where: {
          invitationHash,
        },
      });

      if (!account) {
        throw new NotFoundException(`Invalid invitation.`);
      }

      this.logger.log('[FETCH-BUSINESS-INVITATION-INFO-SUCCESS]');

      return {
        accountEmail: account.email,
        avatar: account.business.avatar,
        businessName: account.business.name,
      };
    } catch (error) {
      this.logger.log(`[FETCH-BUSINESS-INVITATION-INFO-HANDLER]: ${error}`);

      throw error;
    }
  }
}
