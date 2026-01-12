import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { DeleteEventPartyCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRole } from '@app/common/src/constants/enums';
import { DeleteDataInstanceInfo } from '../../interface/schema';
import { ReplaceEventGuestPartyEvent } from '../../events/impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Event, EventParty } from '@app/common/src/models/event.model';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteEventPartyCommand)
export class DeleteEventPartyHandler implements ICommandHandler<
  DeleteEventPartyCommand,
  DeleteDataInstanceInfo
> {
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(EventParty)
    private readonly eventPartyRepository: Repository<EventParty>,
  ) {}

  async execute(command: DeleteEventPartyCommand) {
    try {
      this.logger.log(`[DELETE-EVENT-PARTY-HANDLER-PROCESSING]`);

      const { eventId, partyId, newPartyId, secureUser } = command;

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

      await this.eventPartyRepository.remove(eventParty);

      this.eventBus.publish(
        new ReplaceEventGuestPartyEvent(eventId, eventParty.name, newPartyId),
      );

      this.logger.log(`[DELETE-EVENT-PARTY-HANDLER-SUCCESS]`);

      return {
        status: true,
        message: 'Event party removed successfully.',
      };
    } catch (error) {
      this.logger.log(`[DELETE-EVENT-PARTY-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
