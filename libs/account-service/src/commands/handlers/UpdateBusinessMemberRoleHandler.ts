import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBusinessMemberRoleCommand } from '../impl';
import { AccountRole } from '@app/common/src/constants/enums';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { Account, BusinessMemberInfo } from 'libs/common/src/models/account.model';

@CommandHandler(UpdateBusinessMemberRoleCommand)
export class UpdateBusinessMemberRoleHandler implements ICommandHandler<UpdateBusinessMemberRoleCommand, BusinessMemberInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) { }

  async execute(command: UpdateBusinessMemberRoleCommand) {
    try {
      this.logger.log(`[UPDATE-BUSINESS-MEMBER-ROLE-HANDLER-PROCESSING]`);

      const { member, role, secureUser } = command;

      if (secureUser.role === AccountRole.MEMBER) {
        throw new ForbiddenException(
          'You do not have permission to invite members.',
        );
      }

      const account = await this.accountRepository.findOne({
        where: {
          id: member,
        },
      });

      if (!account) {
        throw new NotFoundException(
          'Account not found.',
        );
      }

      Object.assign(account, { role });

      await this.accountRepository.save(account);

      this.logger.log(`[UPDATE-BUSINESS-MEMBER-ROLE-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatBusinessMemberInfo(account);
    } catch (error) {
      this.logger.log(`[UPDATE-BUSINESS-MEMBER-ROLE-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
