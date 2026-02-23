import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { InitializeBusinessProfileCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AccountStatus,
  SubscriptionItemLimitEnum,
  SubscriptionStatusEnum,
} from '@app/common/src/constants/enums';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';
import { Subscription } from '@app/common/src/models/subscription.model';

@CommandHandler(InitializeBusinessProfileCommand)
export class InitializeBusinessProfileHandler implements ICommandHandler<
  InitializeBusinessProfileCommand,
  AccountInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async execute(command: InitializeBusinessProfileCommand) {
    try {
      this.logger.log(`[INITIALIZE-ACCOUNT-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const account = await this.accountRepository.findOne({
        where: {
          id: secureUser.id,
        },
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      const instance = await this.businessRepository.create({
        account,
        name: payload.businessName,
        email: payload.businessEmail,
        phone: payload.businessPhone,
        avatar: payload?.businessAvatar,
        sendFromEmail: payload.sendFromEmail,
      });

      const business = await this.businessRepository.save(instance);

      Object.assign(account, {
        status: AccountStatus.ACTIVE,
        isBusinessProfileUpdated: true,
      });

      await this.accountRepository.save(account);

      const _instance = this.subscriptionRepository.create({
        business,
        status: SubscriptionStatusEnum.DEFAULT,
        subscriptionDate: new Date(),
        expirationDate: new Date(),
        eventLimit: 2,
        guestLimit: 50,
        guestLimitStatus: SubscriptionItemLimitEnum.LIMITED,
        eventLimitStatus: SubscriptionItemLimitEnum.LIMITED,
        reusableMessageTemplates: false,
        invitationCoverImage: false,
        guestActivityTimeline: false,
        advancedGuestActivityTimeline: false,
        followupMessages: false,
        manageTeamMembers: false,
        secureGuestDataAccess: false,
        flexibleDataExport: false,
        isExpired: false,
      });

      await this.subscriptionRepository.save(_instance);

      this.logger.log(`[INITIALIZE-ACCOUNT-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatAccountInfo(account);
    } catch (error) {
      this.logger.log(`[INITIALIZE-ACCOUNT-HANDLER-ERROR] :: ${error}`);
      console.log(error);

      throw error;
    }
  }
}
