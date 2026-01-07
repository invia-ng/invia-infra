import { NewAccountInfo } from '../../interface';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { AuthService } from '../../services/auth.service';
import { CreateAccountVerificationCommand } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import { Account } from 'libs/common/src/models/account.model';
import { AccountStatus } from 'libs/common/src/constants/enums';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { AuthEmailNotificationService } from '@app/notification-service/src/services/email/auth.email.notification.service';

@CommandHandler(CreateAccountVerificationCommand)
export class CreateAccountVerificationHandler
  implements
    ICommandHandler<
      CreateAccountVerificationCommand,
      NewAccountInfo
    >
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly authService: AuthService,
    @InjectRepository(Account)
    private readonly userRepository: Repository<Account>,
    @Inject('Logger') private readonly logger: AppLogger,
    private readonly AuthEmailNotificationService: AuthEmailNotificationService,
  ) {}

  async execute(command: CreateAccountVerificationCommand) {
    try {
      this.logger.log(`[CREATE-ACCOUNT-VERIFICATION-HANDLER-PROCESSING]`);

      const { payload, origin } = command;

      const account = await this.userRepository.findOne({
        where: {
          activationCode: payload.otp,
          activationCodeExpires: MoreThanOrEqual(new Date()),
          signupVerificationHash: payload.signupVerificationHash,
        },
      });

      if (!account) {
        throw new NotFoundException('Invalid OTP');
      }

      Object.assign(account, {
        activationCode: '',
        signupVerificationHash: '',
        status: AccountStatus.ACTIVE,
      });

      await this.userRepository.save(account);

      this.AuthEmailNotificationService.newAccountNotifications(account);

      this.logger.log(`[CREATE-ACCOUNT-VERIFICATION-HANDLER-SUCCESS]`);

      return {
        token: await this.authService.generateUserJWT(account),
        accountInfo: modelsFormatter.FormatAccountInfo(account),
      } as NewAccountInfo;
    } catch (error) {
      this.logger.log(
        `[CREATE-ACCOUNT-VERIFICATION-HANDLER-ERROR] :: ${error}`,
      );
      console.log(error);

      throw error;
    }
  }
}
