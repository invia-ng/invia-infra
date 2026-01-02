import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RemoveMultipleEventGuestsCommand } from '../impl';
import { Guest } from '@app/common/src/models/guest.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDataInstanceInfo } from '../../interface/schema';
import { AppLogger } from 'libs/common/src/logger/logger.service';

@CommandHandler(RemoveMultipleEventGuestsCommand)
export class RemoveMultipleEventGuestsHandler
  implements ICommandHandler<RemoveMultipleEventGuestsCommand, DeleteDataInstanceInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}

  async execute(command: RemoveMultipleEventGuestsCommand) {
    try {
      this.logger.log(`[REMOVE-MULTIPLE-EVENT-GUESTS-HANDLER-PROCESSING]`);

      const { guestIds, eventId, secureUser } = command;

      const guests = await this.guestRepository.find({
        where: {
          id: In(guestIds),
          event: {
            id: eventId,
          },
        },
      });

      if (!guests || guests.length === 0) {
        throw new NotFoundException('Guest not found.');
      }

      await Promise.all(guests.map(async(guest) => {
        try {
          this.logger.log(`[REMOVE-EVENT-GUEST-HANDLER-PROCESSING]`);

          await this.guestRepository.remove(guest);

          this.logger.log(`[REMOVE-EVENT-GUEST-HANDLER-SUCCESS]`);

        } catch(error) {
          this.logger.error(`[REMOVE-EVENT-GUEST-HANDLER-ERROR] :: ${error}`);
        }
      }));

      this.logger.log(`[REMOVE-MULTIPLE-EVENT-GUESTS-HANDLER-SUCCESS]`);

      return {
        status: true,
        message: 'Guests removed from event successfully.',
      };
    } catch (error) {
      this.logger.log(`[REMOVE-MULTIPLE-EVENT-GUESTS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
