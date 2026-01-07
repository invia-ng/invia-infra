import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AcceptBusinessInvitationCommand } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import authUtils from '@app/common/src/security/auth.utils';
import { Account } from 'libs/common/src/models/account.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountStatus } from '@app/common/src/constants/enums';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { SigninResponsePayload } from '@app/auth-service/src/interface';
import { AuthService } from '@app/auth-service/src/services/auth.service';

@CommandHandler(AcceptBusinessInvitationCommand)
export class AcceptBusinessInvitationHandler implements ICommandHandler<
  AcceptBusinessInvitationCommand,
  SigninResponsePayload
> {
  constructor(
    private readonly authService: AuthService,
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
        relations: ['business'],
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

      return {
        token: await this.authService.generateUserJWT(account),
      } as unknown as SigninResponsePayload;
    } catch (error) {
      this.logger.log(`[ACCEPT-BUSINESS-INVITATION-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
