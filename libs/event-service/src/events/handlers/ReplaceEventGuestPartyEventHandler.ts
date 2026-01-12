import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplaceEventGuestPartyEvent } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import { Guest } from '@app/common/src/models/guest.model';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventParty } from '@app/common/src/models/event.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';

@EventsHandler(ReplaceEventGuestPartyEvent)
export class ReplaceEventGuestPartyEventHandler implements IEventHandler<ReplaceEventGuestPartyEvent> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(EventParty)
    private readonly eventPartyRepository: Repository<EventParty>,
  ) {}

  async handle(event: ReplaceEventGuestPartyEvent) {
    try {
      this.logger.log(
        `[INVITE-EVENT-GUEST-EVENT-PROCESSING]: ${JSON.stringify(event)}`,
      );

      const { eventId, partyName, newPartyId } = event;

      const newEventParty = await this.eventPartyRepository.findOne({
        where: {
          id: newPartyId,
          event: {
            id: eventId,
          },
        },
      });

      if (!newEventParty) {
        throw new NotFoundException('Event party not found.');
      }

      const guests = await this.guestRepository.find({
        where: {
          event: {
            id: eventId,
          },
          party: partyName,
        },
      });

      await Promise.all(
        guests.map(async (guest) => {
          try {
            this.logger.log(`[REPLACE-EVENT-GUEST-PARTY-MANAGER-PROCESSING]`);

            Object.assign(guest, {
              party: newEventParty.name,
            });

            await this.guestRepository.save(guest);

            this.logger.log(`[REPLACE-EVENT-GUEST-PARTY-MANAGER-SUCCESS]`);
          } catch (error) {
            this.logger.log(
              `[REPLACE-EVENT-GUEST-PARTY-MANAGER-ERROR] :: ${error}`,
            );
          }
        }),
      );

      this.logger.log(`[INVITE-EVENT-GUEST-EVENT-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[INVITE-EVENT-GUEST-EVENT-ERROR]: ${error}`);

      throw error;
    }
  }
}
