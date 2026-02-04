import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBusinessEmailCommand } from '../impl';
import { Business } from 'libs/common/src/models/business.model';
import { ForbiddenException, Inject } from '@nestjs/common';
import authUtils from 'libs/common/src/security/auth.utils';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { AuthEmailNotificationService } from '@app/notification-service/src/services/email/auth.email.notification.service';

@CommandHandler(UpdateBusinessEmailCommand)
export class UpdateBusinessEmailHandler
  implements ICommandHandler<UpdateBusinessEmailCommand> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly AuthEmailNotificationService: AuthEmailNotificationService,
  ) { }

  async execute(command: UpdateBusinessEmailCommand) {
    try {
      this.logger.log(`[UPDATE-BUSINESS-EMAIL-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const accountExists = await this.businessRepository.findOne({
        where: {
          email: payload.newEmail,
        },
      });

      if (accountExists) {
        throw new ForbiddenException('Email already exists.');
      }

      const account = await this.businessRepository.findOne({
        where: {
          id: secureUser.id,
        },
      });

      const activationCode = authUtils.generateRandomPin();
      const activationCodeExpiration = authUtils.generateFutureDate(1, 'hours');

      Object.assign(account, {
        newEmail: payload.newEmail,
        activationCode: activationCode,
        activationCodeExpires: activationCodeExpiration,
      });

      await this.businessRepository.save(account);

      this.AuthEmailNotificationService.verifyNewBusinessEmailNotification(
        account,
      );

      this.logger.log(`[UPDATE-BUSINESS-EMAIL-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[UPDATE-BUSINESS-EMAIL-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
