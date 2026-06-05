import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplaceEventGuestPartyEvent } from '../impl';
import { Inject, NotFoundException } from '@nestjs/common';
import { Guest } from '@app/common/src/models/guest.model';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventParty } from '@app/common/src/models/event.model';
import { ProcessGuestEventInvitationAsSeenEvent } from '../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Invitation } from '@app/common/src/models/invitation.model';

@EventsHandler(ProcessGuestEventInvitationAsSeenEvent)
export class ProcessGuestEventInvitationAsSeenEventHandler implements IEventHandler<ProcessGuestEventInvitationAsSeenEvent> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  async handle(event: ProcessGuestEventInvitationAsSeenEvent) {
    try {
      this.logger.log(
        `[PROCESS-GUEST-EVENT-INVITATION-AS-SEEN-EVENT-PROCESSING]: ${JSON.stringify(event)}`,
      );

      const { invitation } = event;

      if (invitation.isInvitationSeen) {
        this.logger.log(
          `[PROCESS-GUEST-EVENT-INVITATION-AS-SEEN-EVENT-ALREADY-SEEN]`,
        );
        return;
      }

      Object.assign(invitation, {
        isInvitationSeen: true,
      });

      await this.invitationRepository.save(invitation);

      this.logger.log(`[PROCESS-GUEST-EVENT-INVITATION-AS-SEEN-EVENT-SUCCESS]`);
    } catch (error) {
      this.logger.log(
        `[PROCESS-GUEST-EVENT-INVITATION-AS-SEEN-EVENT-ERROR]: ${error}`,
      );

      throw error;
    }
  }
}
