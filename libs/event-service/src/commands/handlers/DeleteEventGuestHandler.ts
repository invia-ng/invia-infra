import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { DeleteEventGuestCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from '@app/common/src/models/guest.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDataInstanceInfo } from '../../interface/schema';
import { AppLogger } from 'libs/common/src/logger/logger.service';

@CommandHandler(DeleteEventGuestCommand)
export class DeleteEventGuestHandler
  implements ICommandHandler<DeleteEventGuestCommand, DeleteDataInstanceInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}

  async execute(command: DeleteEventGuestCommand) {
    try {
      this.logger.log(`[CREATE-EVENT-HANDLER-PROCESSING]`);

      const { guestId, eventId, secureUser } = command;

      const guest = await this.guestRepository.findOne({
        where: {
          id: guestId,
          event: {
            id: eventId,
          },
        },
      });

      if (!guest) {
        throw new NotFoundException('Guest not found.');
      }

      await this.guestRepository.remove(guest);

      this.logger.log(`[CREATE-EVENT-HANDLER-SUCCESS]`);

      return {
        status: true,
        message: 'Guest removed from event successfully.',
      };
    } catch (error) {
      this.logger.log(`[CREATE-EVENT-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
