import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UpdateEventPartyCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from '@app/common/src/models/guest.model';
import { AccountRole } from '@app/common/src/constants/enums';
import { ReplaceEventGuestPartyEvent } from '../../events/impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { EventParty, EventPartyInfo } from '@app/common/src/models/event.model';

@CommandHandler(UpdateEventPartyCommand)
export class UpdateEventPartyHandler implements ICommandHandler<
  UpdateEventPartyCommand,
  EventPartyInfo
> {
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(EventParty)
    private readonly eventPartyRepository: Repository<EventParty>,
  ) { }

  async execute(command: UpdateEventPartyCommand) {
    try {
      this.logger.log(`[UPDATE-EVENT-PARTY-HANDLER-PROCESSING]`);

      const { eventId, partyId, payload, secureUser } = command;

      if (secureUser.role !== AccountRole.ADMIN) {
        throw new UnauthorizedException(
          'Invalid request, you are not authorized to complete is action.',
        );
      }

      const eventParty = await this.eventPartyRepository.findOne({
        where: {
          id: partyId,
          event: {
            id: eventId,
          },
        },
      });

      if (!eventParty) {
        throw new NotFoundException('Event party not found.');
      }

      await this.updateEventGuestsParty({
        eventId,
        party: eventParty.name,
        newParty: payload.name,
      });

      Object.assign(eventParty, {
        name: payload.name,
      });

      await this.eventPartyRepository.save(eventParty);

      this.logger.log(`[UPDATE-EVENT-PARTY-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatEventPartyInfo(eventParty);
    } catch (error) {
      this.logger.log(`[UPDATE-EVENT-PARTY-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }

  async updateEventGuestsParty(payload: {
    eventId: number, party: string, newParty: string
  }): Promise<void> {
    try {
      this.logger.log(`[UPDATE-EVENT-GUEST-PARTY-PROCESSING]`);

      const { eventId, party, newParty } = payload;

      const guests = await this.guestRepository.find({
        where: {
          event: {
            id: eventId,
          },
          party,
        },
      });

      await Promise.all(
        guests.map(async (guest) => {
          try {
            this.logger.log(`[UPDATE-EVENT-GUEST-PARTY-MANAGER-PROCESSING]`);

            Object.assign(guest, {
              party: newParty,
            });

            console.log('[GUEST] -> ', guest);

            await this.guestRepository.save(guest);

            this.logger.log(`[UPDATE-EVENT-GUEST-PARTY-MANAGER-SUCCESS]`);
          } catch (error) {
            this.logger.log(
              `[UPDATE-EVENT-GUEST-PARTY-MANAGER-ERROR] :: ${error}`,
            );
          }
        }),
      );

      this.logger.log(`[UPDATE-EVENT-GUEST-PARTY-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[UPDATE-EVENT-GUEST-PARTY-ERROR]: ${error}`);

      throw error;
    }
  }
}
