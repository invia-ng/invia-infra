import { Repository } from 'typeorm';
import {
  Event,
  EventInfo,
  EventsResponse,
} from '@app/common/src/models/event.model';
import { GuestFetchEventInvitationInfoQuery } from '../../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { Guest } from '@app/common/src/models/guest.model';
import { QueryHandler, IQueryHandler, EventBus } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Invitation } from '@app/common/src/models/invitation.model';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { GuestEventInvitationInfo } from '@app/event-service/src/interface/schema';
import { ProcessGuestEventInvitationAsSeenEvent } from '@app/event-service/src/events/impl';

@QueryHandler(GuestFetchEventInvitationInfoQuery)
export class GuestFetchEventInvitationInfoQueryHandler implements IQueryHandler<
  GuestFetchEventInvitationInfoQuery,
  GuestEventInvitationInfo
> {
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  async execute(query: GuestFetchEventInvitationInfoQuery) {
    try {
      this.logger.log('[FETCH-GUEST-EVENT-INVITATION-INFO-QUERY-PROCESSING]');

      const { invitationHash } = query;

      const invitation = await this.invitationRepository.findOne({
        where: {
          hash: invitationHash,
        },
        order: {
          createdAt: 'DESC',
        },
      });

      if (!invitation) {
        throw new NotFoundException(`Invitation record not found for hash`);
      }

      this.logger.log('[FETCH-GUEST-EVENT-INVITATION-INFO-QUERY-SUCCESS]');

      this.eventBus.publish(new ProcessGuestEventInvitationAsSeenEvent(invitation));

      return modelsFormatter.FormatGuestEventInvitationInfo(invitation);
    } catch (error) {
      this.logger.error(
        '[FETCH-GUEST-EVENT-INVITATION-INFO-QUERY-ERROR]',
        error,
      );

      throw error;
    }
  }
}
