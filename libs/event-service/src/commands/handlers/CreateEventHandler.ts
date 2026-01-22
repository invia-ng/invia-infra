import {
  Inject,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { CreateEventCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewEventPartyEvent } from '../../events/impl';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Event, EventInfo } from '@app/common/src/models/event.model';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<
  CreateEventCommand,
  EventInfo
> {
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async execute(command: CreateEventCommand) {
    try {
      this.logger.log(`[CREATE-EVENT-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const business = await this.businessRepository.findOne({
        where: [
          {
            members: {
              id: secureUser.id,
            },
          },
          {
            account: {
              id: secureUser.id,
            },
          },
        ],
      });

      if (!business) {
        throw new UnauthorizedException('Business not found.');
      }

      const exists = await this.eventRepository.findOne({
        where: {
          name: payload.name,
          business,
        },
      });

      if (exists) {
        throw new BadRequestException('An event with this namealready exists.');
      }

      const hash = createHash('sha256')
        .update(JSON.stringify(new Date()))
        .digest('hex');

      const instance = this.eventRepository.create({
        hash,
        business,
        name: payload.name,
        date: payload.date,
        time: payload.time,
        location: payload.location,
        category: payload.category,
      });

      const event = await this.eventRepository.save(instance);

      this.eventBus.publish(new CreateNewEventPartyEvent(event, secureUser));

      this.logger.log(`[CREATE-EVENT-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatEventInfo(event, 0, 0, 0, 0, 0, 0);
    } catch (error) {
      this.logger.log(`[CREATE-EVENT-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
