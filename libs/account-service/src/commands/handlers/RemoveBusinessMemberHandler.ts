import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RemoveBusinessMemberCommand } from '../impl';
import { AccountRole } from '@app/common/src/constants/enums';
import { Account } from '@app/common/src/models/account.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Business } from 'libs/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';

@CommandHandler(RemoveBusinessMemberCommand)
export class RemoveBusinessMemberHandler implements ICommandHandler<
  RemoveBusinessMemberCommand,
  void
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) { }

  async execute(command: RemoveBusinessMemberCommand) {
    try {
      this.logger.log(`[REMOVE-BUSINESS-MEMBER-HANDLER-PROCESSING]`);

      const { accountId, secureUser } = command;

      if (secureUser.role === AccountRole.MEMBER) {
        throw new ForbiddenException(
          'You do not have permission to remove members.',
        );
      }

      if (secureUser.id === accountId) {
        throw new ForbiddenException(
          'You do not have permission to remove yourself.',
        );
      }

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
        throw new NotFoundException('Business not found or access denied.');
      }

      const memberToRemove = business.members.find(
        (member) => member.id == accountId, // Loose equality in case of string/number mismatch, or convert
      );

      if (!memberToRemove) {
        throw new NotFoundException('Member not found in this business.');
      }

      if (secureUser.role === AccountRole.ADMIN && memberToRemove.id === business.account.id) {
        throw new ForbiddenException(
          'You do not have permission to remove this member.',
        );
      }

      await this.accountRepository.remove(memberToRemove);

      this.logger.log(`[REMOVE-BUSINESS-MEMBER-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[REMOVE-BUSINESS-MEMBER-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
