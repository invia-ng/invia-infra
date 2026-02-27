import {
  Inject,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { CreateEventCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { CreateNewEventPartyEvent } from '../../events/impl';
import { AccountRole, SubscriptionItemLimitEnum, SubscriptionStatusEnum } from '@app/common/src/constants/enums';
import { Subscription } from '@app/common/src/models/subscription.model';
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
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) { }

  async execute(command: CreateEventCommand) {
    try {
      this.logger.log(`[CREATE-EVENT-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      if (secureUser.role === AccountRole.MEMBER) {
        throw new ForbiddenException(
          'You do not have permission to create events.',
        );
      }

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
        throw new BadRequestException('An event with this name already exists.');
      }

      const subscription = await this.subscriptionRepository.findOne({
        where: {
          business: { id: business.id },
          status: SubscriptionStatusEnum.ACTIVE,
          isExpired: false,
        },
      });

      // Enforce active event limit based on subscription plan
      // Both LIMITED and UNLIMITED statuses respect eventLimit — UNLIMITED plans simply have a higher limit value
      const eventLimit = subscription?.eventLimit;

      const eventCount = await this.eventRepository.count({
        where: {
          business: business,
          date: LessThanOrEqual(payload.date),
        },
      });

      if (eventCount >= eventLimit) {
        throw new BadRequestException(
          `Your current plan allows a maximum of ${eventLimit} active event(s). Please upgrade your subscription to create more events.`,
        );
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
