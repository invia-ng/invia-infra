import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBusinessProfileImageCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Business, BusinessInfo } from 'libs/common/src/models/business.model';

@CommandHandler(UpdateBusinessProfileImageCommand)
export class UpdateBusinessProfileImageHandler
  implements ICommandHandler<UpdateBusinessProfileImageCommand, BusinessInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async execute(command: UpdateBusinessProfileImageCommand) {
    try {
      this.logger.log(`[UPDATE-BUSINESS-PROFILE-PHOTO-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const business = await this.businessRepository.findOne({
        where: {
          account: {
            id: secureUser.id,
          },
        },
      });

      if (!business) {
        throw new NotFoundException('Business not found.');
      }

      Object.assign(business, {
        avatar: payload.imageUrl,
      });

      await this.businessRepository.save(business);

      this.logger.log(`[UPDATE-BUSINESS-PROFILE-PHOTO-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatBusinessInfo(business);
    } catch (error) {
      this.logger.log(
        `[UPDATE-BUSINESS-PROFILE-PHOTO-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
