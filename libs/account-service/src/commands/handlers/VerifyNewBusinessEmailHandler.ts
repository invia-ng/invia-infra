import {
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { VerifyNewBusinessEmailCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Business, BusinessInfo } from 'libs/common/src/models/business.model';

@CommandHandler(VerifyNewBusinessEmailCommand)
export class VerifyNewBusinessEmailHandler
  implements ICommandHandler<VerifyNewBusinessEmailCommand, BusinessInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Business)
    private readonly accountRepository: Repository<Business>,
  ) { }

  async execute(command: VerifyNewBusinessEmailCommand) {
    try {
      this.logger.log(`[VERIFY-NEW-BUSINESS-EMAIL-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const account = await this.accountRepository.findOne({
        where: {
          activationCode: payload.otp,
          activationCodeExpires: MoreThanOrEqual(new Date()),
        },
      });

      if (!account) {
        throw new UnauthorizedException('Invalid OTP or OTP expired');
      }

      Object.assign(account, {
        newEmail: '',
        activationCode: '',
        email: account.newEmail,
        activationCodeExpires: null,
      });

      await this.accountRepository.save(account);

      this.logger.log(`[VERIFY-NEW-BUSINESS-EMAIL-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatBusinessInfo(account);
    } catch (error) {
      this.logger.log(`[VERIFY-NEW-BUSINESS-EMAIL-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
