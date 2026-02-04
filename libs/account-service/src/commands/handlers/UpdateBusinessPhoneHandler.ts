import {
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { UpdateBusinessPhoneCommand } from '../impl';
import authUtils from '@app/common/src/security/auth.utils';
import { Account } from '@app/common/src/models/account.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Business, BusinessInfo } from 'libs/common/src/models/business.model';

@CommandHandler(UpdateBusinessPhoneCommand)
export class UpdateBusinessPhoneHandler
  implements ICommandHandler<UpdateBusinessPhoneCommand, BusinessInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) { }

  async execute(command: UpdateBusinessPhoneCommand) {
    try {
      this.logger.log(`[VERIFY-NEW-BUSINESS-EMAIL-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const business = await this.businessRepository.findOne({
        where: {
          members: {
            id: secureUser.id,
          },
          account: {
            id: secureUser.id,
          }
        },
      });

      if (!business) {
        throw new UnauthorizedException('Invalid OTP or OTP expired');
      }

      const account = await this.accountRepository.findOne({
        where: {
          id: secureUser.id,
        },
      });

      if (!authUtils.comparePassword(payload.password, account.password)) {
        throw new UnauthorizedException('Invalid password.');
      }

      Object.assign(business, {
        phone: payload.newPhone,
      });

      await this.businessRepository.save(business);

      this.logger.log(`[VERIFY-NEW-BUSINESS-EMAIL-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatBusinessInfo(business);
    } catch (error) {
      this.logger.log(`[VERIFY-NEW-BUSINESS-EMAIL-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
