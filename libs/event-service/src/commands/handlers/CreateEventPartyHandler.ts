import {
  Inject,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  Event,
  EventParty,
  EventPartyInfo,
} from '@app/common/src/models/event.model';
import { CreateEventPartyCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';

@CommandHandler(CreateEventPartyCommand)
export class CreateEventPartyHandler implements ICommandHandler<
  CreateEventPartyCommand,
  EventPartyInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(EventParty)
    private readonly eventPartyRepository: Repository<EventParty>,
  ) {}

  async execute(command: CreateEventPartyCommand) {
    try {
      this.logger.log(`[CREATE-EVENT-PARTY-HANDLER-PROCESSING]`);

      const { eventId, payload, secureUser } = command;

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

      const event = await this.eventRepository.findOne({
        where: {
          id: eventId,
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found.');
      }

      const exists = await this.eventPartyRepository.exists({
        where: {
          event: {
            id: eventId,
          },
          name: payload.name,
        },
      });

      if (exists) {
        throw new BadRequestException('Event party already exists.');
      }

      const instance = this.eventPartyRepository.create({
        event,
        name: payload.name,
      });

      const party = await this.eventPartyRepository.save(instance);

      this.logger.log(`[CREATE-EVENT-PARTY-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatEventPartyInfo(party);
    } catch (error) {
      this.logger.log(`[CREATE-EVENT-PARTY-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
