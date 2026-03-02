import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InviteBusinessMemberCommand } from '../impl';
import { ForbiddenException, Inject } from '@nestjs/common';
import { AccountRole } from '@app/common/src/constants/enums';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Account, BusinessMemberInfo } from 'libs/common/src/models/account.model';
import { AuthEmailNotificationService } from '@app/notification-service/src/services/email/auth.email.notification.service';

@CommandHandler(InviteBusinessMemberCommand)
export class InviteBusinessMemberHandler implements ICommandHandler<InviteBusinessMemberCommand, BusinessMemberInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly AuthEmailNotificationService: AuthEmailNotificationService,
  ) { }

  async execute(command: InviteBusinessMemberCommand) {
    try {
      this.logger.log(`[INVITE-BUSINESS-MEMBER-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      if (secureUser.role === AccountRole.MEMBER) {
        throw new ForbiddenException(
          'You do not have permission to invite members.',
        );
      }

      const accountExists = await this.accountRepository.findOne({
        where: {
          email: payload.email,
        },
      });

      if (accountExists) {
        throw new ForbiddenException(
          'An account with this email already exists.',
        );
      }

      const business = await this.businessRepository.findOne({
        where: {
          members: {
            id: secureUser.id,
          },
        },
      });

      const _payload = {
        role: payload.role,
        business: business,
        email: payload.email,
      };

      const hash = createHash('sha256')
        .update(JSON.stringify(_payload))
        .digest('hex');

      const account = this.accountRepository.create({
        ..._payload,
        invitationHash: hash,
      });

      await this.accountRepository.save(account);

      this.AuthEmailNotificationService.inviteBusinessMemberEmailNotification(
        {
          account,
          business,
        },
      );

      this.logger.log(`[INVITE-BUSINESS-MEMBER-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatBusinessMemberInfo(account);
    } catch (error) {
      this.logger.log(`[INVITE-BUSINESS-MEMBER-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
