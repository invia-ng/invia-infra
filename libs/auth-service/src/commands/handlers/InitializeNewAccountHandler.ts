import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { InitializeNewAccountCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupResponsePayload } from '../../interface';
import { AuthService } from '../../services/auth.service';
import { AccountRole, AccountStatus } from '@app/common/src/constants/enums';
import authUtils from 'libs/common/src/security/auth.utils';
import { InitializeNewAccountEvent } from '../../events/impl';
import { Account } from 'libs/common/src/models/account.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ReferralCodeGenerator } from 'libs/common/src/utils/id.generator';
import { EmailAlreadyUsedException } from 'libs/common/src/constants/exceptions';
import { AuthEmailNotificationService } from 'libs/notification-service/src/services/email/auth.email.notification.service';

@CommandHandler(InitializeNewAccountCommand)
export class InitializeNewAccountHandler implements ICommandHandler<
  InitializeNewAccountCommand,
  SignupResponsePayload
> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly authService: AuthService,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly userRepository: Repository<Account>,
    private readonly authEmailNotificationService: AuthEmailNotificationService,
  ) {}

  async execute(command: InitializeNewAccountCommand) {
    try {
      this.logger.log(`[INITIALIZE-NEW-ACCOUNT-HANDLER-PROCESSING]`);

      const { payload, origin } = command;

      const hashPayload = Object.fromEntries(
        Object.entries(payload).filter(([key]) => !['name'].includes(key)),
      );

      const hash = createHash('sha256')
        .update(JSON.stringify(hashPayload))
        .digest('hex');

      const activationCode = authUtils.generateRandomPin();
      const activationCodeExpiration = authUtils.generateFutureDate(1, 'hours');

      const existingUser = await this.userRepository.findOne({
        where: {
          email: payload.email,
        },
      });

      if (
        existingUser &&
        existingUser.signupVerificationHash === '' &&
        existingUser.status === AccountStatus.ACTIVE
      ) {
        throw EmailAlreadyUsedException();
      }

      const existingHash = await this.userRepository.findOne({
        where: {
          signupVerificationHash: hash,
        },
      });

      if (existingHash) {
        Object.assign(existingHash, {
          ...existingHash,
          name: payload.name,
          email: payload.email,
          signupVerificationHash: hash,
          activationCode: activationCode,
          activationCodeExpires: activationCodeExpiration,
        });

        await this.userRepository.save(existingHash);

        this.authEmailNotificationService.newAccountNotifications(existingHash);

        this.logger.log(`[INITIALIZE-NEW-ACCOUNT-HANDLER-SUCCESS]`);

        return {
          signupVerificationHash: hash,
        } as SignupResponsePayload;
      } else {
        const newAccount = await this.userRepository.save({
          name: payload.name,
          email: payload.email,
          signupVerificationHash: hash,
          activationCode: activationCode,
          activationCodeExpires: activationCodeExpiration,
        });

        this.eventBus.publish(
          new InitializeNewAccountEvent(origin, newAccount, payload),
        );

        this.logger.log(`[INITIALIZE-NEW-ACCOUNT-HANDLER-SUCCESS]`);

        return {
          signupVerificationHash: newAccount.signupVerificationHash,
        } as SignupResponsePayload;
      }
    } catch (error) {
      this.logger.log(`[INITIALIZE-NEW-ACCOUNT-HANDLER-ERROR] :: ${error}`);
      console.log(error);

      throw error;
    }
  }
}
