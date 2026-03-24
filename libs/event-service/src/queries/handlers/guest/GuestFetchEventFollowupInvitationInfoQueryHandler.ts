import { Repository } from 'typeorm';
import {
  Event,
  EventInfo,
  EventsResponse,
} from '@app/common/src/models/event.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { Guest } from '@app/common/src/models/guest.model';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { FollowupInvitation, Invitation } from '@app/common/src/models/invitation.model';
import { GuestFetchEventFollowupInvitationInfoQuery } from '../../impl';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { GuestEventInvitationInfo } from '@app/event-service/src/interface/schema';

@QueryHandler(GuestFetchEventFollowupInvitationInfoQuery)
export class GuestFetchEventFollowupInvitationInfoQueryHandler implements IQueryHandler<
  GuestFetchEventFollowupInvitationInfoQuery,
  GuestEventInvitationInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(FollowupInvitation)
    private readonly followupInvitationRepository: Repository<FollowupInvitation>,
  ) { }

  async execute(query: GuestFetchEventFollowupInvitationInfoQuery) {
    try {
      this.logger.log('[FETCH-GUEST-EVENT-FOLLOWUP-INVITATION-INFO-QUERY-PROCESSING]');

      const { followupInvitationHash } = query;

      const followupInvitation = await this.followupInvitationRepository.findOne({
        where: {
          hash: followupInvitationHash,
        },
      });

      if (!followupInvitation) {
        throw new NotFoundException(`Invitation record not found for hash`);
      }

      this.logger.log('[FETCH-GUEST-EVENT-FOLLOWUP-INVITATION-INFO-QUERY-SUCCESS]');

      return modelsFormatter.FormatGuestEventFollowupInvitationInfo(followupInvitation);
    } catch (error) {
      this.logger.error('[FETCH-GUEST-EVENT-FOLLOWUP-INVITATION-INFO-QUERY-ERROR]', error);

      throw error;
    }
  }
} 
