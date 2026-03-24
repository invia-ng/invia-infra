import { Inject } from '@nestjs/common';
import { SearchEventGuestsQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Guest, GuestsResponse } from '@app/common/src/models/guest.model';
import { AccountRole } from '@app/common/src/constants/enums';
import { Invitation } from '@app/common/src/models/invitation.model';

@QueryHandler(SearchEventGuestsQuery)
export class SearchEventGuestsQueryHandler implements IQueryHandler<
  SearchEventGuestsQuery,
  GuestsResponse
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) { }

  async execute(query: SearchEventGuestsQuery): Promise<GuestsResponse> {
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
        secureUser,
      } = query;

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
          return modelsFormatter.FormatGuestInfo(guest, invitation, secureUser.role === AccountRole.MEMBER);
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
