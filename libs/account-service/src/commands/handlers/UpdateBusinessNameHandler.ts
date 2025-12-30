import {
  Inject,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBusinessNameCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Business, BusinessInfo } from '@app/common/src/models/business.model';

@CommandHandler(UpdateBusinessNameCommand)
export class UpdateBusinessNameHandler
  implements ICommandHandler<UpdateBusinessNameCommand, BusinessInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async execute(command: UpdateBusinessNameCommand) {
    try {
      this.logger.log(`[UPDATE-BUSINESS-NAME-HANDLER-PROCESSING]`);

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
        name: payload.name,
      });

      await this.businessRepository.save(business);

      this.logger.log(`[UPDATE-BUSINESS-NAME-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatBusinessInfo(business);
    } catch (error) {
      this.logger.log(`[UPDATE-BUSINESS-NAME-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
