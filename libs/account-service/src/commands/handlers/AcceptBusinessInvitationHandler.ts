import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AcceptBusinessInvitationCommand } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import authUtils from '@app/common/src/security/auth.utils';
import { Account } from 'libs/common/src/models/account.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountStatus } from '@app/common/src/constants/enums';
import { AppLogger } from 'libs/common/src/logger/logger.service';

@CommandHandler(AcceptBusinessInvitationCommand)
export class AcceptBusinessInvitationHandler implements ICommandHandler<AcceptBusinessInvitationCommand> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async execute(command: AcceptBusinessInvitationCommand) {
    try {
      this.logger.log(`[ACCEPT-BUSINESS-INVITATION-HANDLER-PROCESSING]`);

      const { payload, invitationHash } = command;

      const account = await this.accountRepository.findOne({
        where: {
          invitationHash,
        },
      });

      if (!account) {
        throw new NotFoundException('Invalid invitation.');
      }

      const password = await authUtils.hashPassword(payload.password);

      Object.assign(account, {
        password,
        name: payload.name,
        invitationHash: '',
        status: AccountStatus.ACTIVE,
      });

      await this.accountRepository.save(account);

      this.logger.log(`[ACCEPT-BUSINESS-INVITATION-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[ACCEPT-BUSINESS-INVITATION-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
