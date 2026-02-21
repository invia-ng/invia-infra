import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddEventGuestsToPartyCommand } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Guest, GuestInfo } from '@app/common/src/models/guest.model';
import { Event, EventParty } from '@app/common/src/models/event.model';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { AccountRole } from '@app/common/src/constants/enums';

@CommandHandler(AddEventGuestsToPartyCommand)
export class AddEventGuestsToPartyCommandHandler implements ICommandHandler<
  AddEventGuestsToPartyCommand,
  GuestInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(EventParty)
    private readonly eventPartyRepository: Repository<EventParty>,
  ) { }

  async execute(command: AddEventGuestsToPartyCommand) {
    try {
      this.logger.log(`[CREATE-EVENT-PARTY-HANDLER-PROCESSING]`);

      const { eventId, partyId, guestIds, secureUser } = command;

      const updatedGuests: GuestInfo[] = [];

      const event = await this.eventRepository.findOne({
        where: {
          id: eventId,
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found.');
      }

      const party = await this.eventPartyRepository.findOne({
        where: {
          id: partyId,
          event: {
            id: eventId,
          },
        },
      });

      if (!party) {
        throw new NotFoundException('Party not found.');
      }

      const guests = await this.guestRepository.find({
        where: {
          id: In(guestIds),
          event: {
            id: eventId,
          },
        },
      });

      await Promise.all(
        guests.map(async (guest) => {
          try {
            this.logger.log(`[UPDATE-EVENT-GUEST-PARTY-MANAGER-PROCESSING]`);

            Object.assign(guest, {
              party: party.name,
            });

            await this.guestRepository.save(guest);

            updatedGuests.push(modelsFormatter.FormatGuestInfo(guest, null, secureUser.role === AccountRole.MEMBER));

            this.logger.log(`[UPDATE-EVENT-GUEST-PARTY-MANAGER-SUCCESS]`);
          } catch (error) {
            this.logger.error(
              `[UPDATE-EVENT-GUEST-PARTY-MANAGER-ERROR] :: ${error}`,
            );
          }
        }),
      );

      this.logger.log(`[UPDATE-EVENT-GUESTS-TO-PARTY-HANDLER-SUCCESS]`);

      return updatedGuests;
    } catch (error) {
      this.logger.log(`[CREATE-EVENT-PARTY-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
