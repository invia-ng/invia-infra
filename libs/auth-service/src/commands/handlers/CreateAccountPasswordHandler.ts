import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountPasswordCommand } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import authUtils from '@app/common/src/security/auth.utils';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountStatus } from '@app/common/src/constants/enums';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';

@CommandHandler(CreateAccountPasswordCommand)
export class CreateAccountPasswordHandler
  implements
  ICommandHandler<
    CreateAccountPasswordCommand,
    AccountInfo
  > {
  constructor(
    @InjectRepository(Account)
    private readonly userRepository: Repository<Account>,
    @Inject('Logger') private readonly logger: AppLogger,
  ) { }

  async execute(command: CreateAccountPasswordCommand) {
    try {
      this.logger.log(`[CREATE-ACCOUNT-PASSWORD-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const account = await this.userRepository.findOne({
        where: {
          id: secureUser.id,
        },
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      const hashedPassword = await authUtils.hashPassword(payload.password);

      Object.assign(account, {
        isPasswordUpdated: true,
        password: hashedPassword,
        status: AccountStatus.ACTIVE,
      });

      await this.userRepository.save(account);

      this.logger.log(`[CREATE-ACCOUNT-PASSWORD-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatAccountInfo(account);
    } catch (error) {
      this.logger.log(
        `[CREATE-ACCOUNT-PASSWORD-HANDLER-ERROR] :: ${error}`,
      );
      console.log(error);

      throw error;
    }
  }
}
