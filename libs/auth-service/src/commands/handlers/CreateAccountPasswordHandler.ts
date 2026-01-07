import { NewAccountInfo } from '../../interface';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateAccountPasswordCommand } from '../impl';
import { AuthService } from '../../services/auth.service';
import { Inject, NotFoundException } from '@nestjs/common';
import authUtils from '@app/common/src/security/auth.utils';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';
import { AccountStatus } from '@app/common/src/constants/enums';

@CommandHandler(CreateAccountPasswordCommand)
export class CreateAccountPasswordHandler
  implements
    ICommandHandler<
      CreateAccountPasswordCommand,
      AccountInfo
    >
{
  constructor(
    @InjectRepository(Account)
    private readonly userRepository: Repository<Account>,
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

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
