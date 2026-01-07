import { Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RemoveBusinessMemberCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Business, BusinessInfo } from 'libs/common/src/models/business.model';
import { Account } from '@app/common/src/models/account.model';

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
  ) {}

  async execute(command: RemoveBusinessMemberCommand) {
    try {
      this.logger.log(`[REMOVE-BUSINESS-MEMBER-HANDLER-PROCESSING]`);

      const { accountId, secureUser } = command;

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

      await this.accountRepository.remove(memberToRemove);

      this.logger.log(`[REMOVE-BUSINESS-MEMBER-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[REMOVE-BUSINESS-MEMBER-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
