import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteBusinessProfileImageCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Business, BusinessInfo } from 'libs/common/src/models/business.model';

@CommandHandler(DeleteBusinessProfileImageCommand)
export class DeleteBusinessProfileImageHandler
  implements ICommandHandler<DeleteBusinessProfileImageCommand, BusinessInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) { }

  async execute(command: DeleteBusinessProfileImageCommand) {
    try {
      this.logger.log(`[DELETE-BUSINESS-PROFILE-PHOTO-HANDLER-PROCESSING]`);

      const { secureUser } = command;

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
        avatar: 'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767799379/event_ypdcrh.png',
      });

      await this.businessRepository.save(business);

      this.logger.log(`[DELETE-BUSINESS-PROFILE-PHOTO-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatBusinessInfo(business);
    } catch (error) {
      this.logger.log(
        `[DELETE-BUSINESS-PROFILE-PHOTO-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
