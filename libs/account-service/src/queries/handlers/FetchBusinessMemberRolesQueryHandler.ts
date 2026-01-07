import { Inject } from '@nestjs/common';
import { FetchBusinessMemberRolesQuery } from '../impl';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AccountRole } from '@app/common/src/constants/enums';
import { BusinessMemberRoleInfo } from '../../interface/schema';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchBusinessMemberRolesQuery)
export class FetchBusinessMemberRolesQueryHandler implements IQueryHandler<
  FetchBusinessMemberRolesQuery,
  BusinessMemberRoleInfo[]
> {
  constructor(@Inject('Logger') private readonly logger: AppLogger) {}

  async execute(query: FetchBusinessMemberRolesQuery) {
    try {
      this.logger.log('[FETCH-BUSINESS-MEMBER-ROLES-PROCESSING]');

      const roles = Object.values(AccountRole).filter((role) => role !== AccountRole.CUSTOMER);

      this.logger.log('[FETCH-BUSINESS-MEMBER-ROLES-SUCCESS]');

      return modelsFormatter.FormatBusinessMemberRoleInfo(roles);
    } catch (error) {
      this.logger.log(`[FETCH-BUSINESS-MEMBER-ROLES-HANDLER]: ${error}`);

      throw error;
    }
  }
}
