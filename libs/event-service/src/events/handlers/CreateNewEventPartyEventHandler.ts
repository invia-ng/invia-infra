import { Repository } from 'typeorm';
import { CreateNewEventPartyEvent } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventParty } from '@app/common/src/models/event.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { EventCategoryEnum } from '@app/common/src/constants/enums';

@EventsHandler(CreateNewEventPartyEvent)
export class CreateNewEventPartyEventHandler implements IEventHandler<CreateNewEventPartyEvent> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(EventParty)
    private readonly eventPartyRepository: Repository<EventParty>,
  ) {}

  async handle(event: CreateNewEventPartyEvent) {
    try {
      this.logger.log(
        `[CREATE-NEW-EVENT-PARTY-EVENT-PROCESSING]: ${JSON.stringify(event)}`,
      );

      const { instance, secureUser } = event;

      if (instance.category === EventCategoryEnum.WEDDING) {
        const groomParty = this.eventPartyRepository.create({
          name: 'Groom',
          event: instance,
        });

        const brideParty = this.eventPartyRepository.create({
          name: 'Bride',
          event: instance,
        });

        await this.eventPartyRepository.save([groomParty, brideParty]);
      }

      if (instance.category === EventCategoryEnum.PARTY) {
        const party = this.eventPartyRepository.create({
          name: 'Party',
          event: instance,
        });

        await this.eventPartyRepository.save(party);
      }

      if (instance.category === EventCategoryEnum.CORPORATE) {
        const corporate = this.eventPartyRepository.create({
          name: 'Team',
          event: instance,
        });
        const guest = this.eventPartyRepository.create({
          name: 'Guest',
          event: instance,
        });

        await this.eventPartyRepository.save([corporate, guest]);
      }

      if (instance.category === EventCategoryEnum.PARTY) {
        const friend = this.eventPartyRepository.create({
          name: 'Friend',
          event: instance,
        });

        const family = this.eventPartyRepository.create({
          name: 'Family',
          event: instance,
        });

        await this.eventPartyRepository.save([friend, family]);
      }

      if (instance.category === EventCategoryEnum.OTHERS) {
        const groupA = this.eventPartyRepository.create({
          name: 'Group A',
          event: instance,
        });

        const groupB = this.eventPartyRepository.create({
          name: 'Group B',
          event: instance,
        });

        await this.eventPartyRepository.save([groupA, groupB]);
      }

      this.logger.log(`[CREATE-NEW-EVENT-PARTY-EVENT-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[CREATE-NEW-EVENT-PARTY-EVENT-ERROR]: ${error}`);

      throw error;
    }
  }
}
