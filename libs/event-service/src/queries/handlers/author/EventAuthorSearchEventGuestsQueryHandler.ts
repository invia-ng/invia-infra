import { Inject, UnauthorizedException } from '@nestjs/common';
import { EventAuthorSearchEventGuestsQuery } from '../../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Guest, GuestsResponse } from '@app/common/src/models/guest.model';
import authUtils from '@app/common/src/security/auth.utils';
import { Invitation } from '@app/common/src/models/invitation.model';

@QueryHandler(EventAuthorSearchEventGuestsQuery)
export class EventAuthorSearchEventGuestsQueryHandler implements IQueryHandler<
  EventAuthorSearchEventGuestsQuery,
  GuestsResponse
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  async execute(
    query: EventAuthorSearchEventGuestsQuery,
  ): Promise<GuestsResponse> {
    try {
      this.logger.log('[SEARCH-EVENT-GUESTS-QUERY-PROCESSING]');

      const {
        eventId,
        guestParty,
        invited,
        rsvpStatus,
        page,
        pageSize,
        searchQuery,
        accessToken,
      } = query;

      const isTokenExpired = authUtils.isAccessTokenExpired(accessToken);

      // console.log('[TOKEN] :: ', accessToken, isTokenExpired)

      if (isTokenExpired) {
        this.logger.log('[EVENT-AUTHOR-INVITE-EVENT-GUESTS-HANDLER-ERROR]');

        throw new UnauthorizedException('Invalid access token');
      }

      const where: FindOptionsWhere<Guest> = {};

      if (eventId) {
        where.event = {
          id: eventId,
        };
      }

      if (guestParty !== undefined && guestParty !== null) {
        where.party = guestParty;
      }

      if (invited !== undefined && invited !== null) {
        where.isInviteSent = invited;
      }

      if (rsvpStatus !== undefined && rsvpStatus !== null) {
        where.isInviteRSVP = rsvpStatus;
      }

      let whereConditions: FindOptionsWhere<Guest> | FindOptionsWhere<Guest>[] =
        where;

      if (searchQuery) {
        whereConditions = [
          { ...where, name: ILike(`%${searchQuery}%`) },
          { ...where, email: ILike(`%${searchQuery}%`) },
          { ...where, party: ILike(`%${searchQuery}%`) },
        ];
      }

      const [guests, totalCount] = await this.guestRepository.findAndCount({
        where: whereConditions,
        order: {
          createdAt: 'DESC',
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;

      const _guests = await Promise.all(
        guests.map(async (guest) => {
          const inviteWhere = eventId 
            ? { guest: { id: guest.id }, event: { id: eventId } }
            : { guest: { id: guest.id } };

          const invitation = await this.invitationRepository.findOne({
            where: inviteWhere,
            order: { createdAt: 'DESC' },
          });
          return modelsFormatter.FormatGuestInfo(guest, invitation);
        })
      );

      this.logger.log('[SEARCH-EVENT-GUESTS-QUERY-SUCCESS]');

      return {
        hasNextPage,
        totalPages,
        guestParties: [...new Set(guests.map((guest) => guest.party))],
        guests: _guests,
      };
    } catch (error) {
      this.logger.error('[SEARCH-EVENT-GUESTS-QUERY-ERROR]', error);

      throw error;
    }
  }
}
