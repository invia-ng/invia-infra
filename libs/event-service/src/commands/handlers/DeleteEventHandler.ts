import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { DeleteEventCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '@app/common/src/models/event.model';
import { AccountRole } from '@app/common/src/constants/enums';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDataInstanceInfo } from '../../interface/schema';
import { AppLogger } from 'libs/common/src/logger/logger.service';

@CommandHandler(DeleteEventCommand)
export class DeleteEventHandler implements ICommandHandler<
  DeleteEventCommand,
  DeleteDataInstanceInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async execute(command: DeleteEventCommand) {
    try {
      this.logger.log(`[DELETE-EVENT-HANDLER-PROCESSING]`);

      const { eventId, secureUser } = command;

      const event = await this.eventRepository.findOne({
        where: {
          id: eventId,
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found.');
      }

      if (secureUser.role !== AccountRole.ADMIN) {
        throw new UnauthorizedException(
          'Invalid request, you are not authorized to complete is action.',
        );
      }

      await this.eventRepository.remove(event);

      this.logger.log(`[DELETE-EVENT-HANDLER-SUCCESS]`);

      return {
        status: true,
        message: 'Event deleted successfully.',
      };
    } catch (error) {
      this.logger.log(`[DELETE-EVENT-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
