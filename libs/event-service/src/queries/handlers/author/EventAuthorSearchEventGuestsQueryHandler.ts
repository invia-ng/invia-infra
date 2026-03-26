import { Inject, UnauthorizedException } from '@nestjs/common';
import { EventAuthorSearchEventGuestsQuery } from '../../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository, ILike, FindOptionsWhere, In } from 'typeorm';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Guest, GuestsResponse } from '@app/common/src/models/guest.model';
import authUtils from '@app/common/src/security/auth.utils';
import { Invitation } from '@app/common/src/models/invitation.model';
import { InvitationStatusEnum, InvitationRSVPEnum } from '@app/common/src/constants/enums';

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
        inviteStatus,
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

      const shouldFilterInMemory = !!inviteStatus || !!rsvpStatus;

      let whereConditions: FindOptionsWhere<Guest> | FindOptionsWhere<Guest>[] =
        where;

      if (searchQuery) {
        whereConditions = [
          { ...where, name: ILike(`%${searchQuery}%`) },
          { ...where, email: ILike(`%${searchQuery}%`) },
          { ...where, party: ILike(`%${searchQuery}%`) },
        ];
      }

      let _guests: any[] = [];
      let totalCount = 0;
      let totalPages = 0;
      let hasNextPage = false;
      let guestParties: string[] = [];

      if (shouldFilterInMemory) {
        const allGuests = await this.guestRepository.find({
          where: whereConditions,
          order: {
            createdAt: 'DESC',
          },
        });

        const guestIds = allGuests.map((g) => g.id);
        const latestInvitations: Record<string, Invitation> = {};

        if (guestIds.length > 0) {
          const chunkSize = 1000;
          for (let i = 0; i < guestIds.length; i += chunkSize) {
            const chunk = guestIds.slice(i, i + chunkSize);
            const invitations = await this.invitationRepository.find({
              where: {
                guest: { id: In(chunk) },
                event: eventId ? { id: eventId } : undefined,
              },
              order: {
                createdAt: 'DESC',
              },
            });

            for (const inv of invitations) {
              if (!latestInvitations[inv.guest.id]) {
                latestInvitations[inv.guest.id] = inv;
              }
            }
          }
        }

        let formattedGuests = allGuests.map((guest) => {
          const inv = latestInvitations[guest.id];
          return modelsFormatter.FormatGuestInfo(guest, inv);
        });

        if (inviteStatus) {
          formattedGuests = formattedGuests.filter((g) => {
            const status = g.invitationStatus || InvitationStatusEnum.PENDING;
            return status === inviteStatus;
          });
        }

        if (rsvpStatus) {
          formattedGuests = formattedGuests.filter((g) => {
            const status = g.rsvpStatus || InvitationRSVPEnum.AWAITING;
            return status === rsvpStatus;
          });
        }

        totalCount = formattedGuests.length;
        totalPages = Math.ceil(totalCount / pageSize);
        hasNextPage = page < totalPages;

        _guests = formattedGuests.slice((page - 1) * pageSize, page * pageSize);
        guestParties = [...new Set(formattedGuests.map((guest) => guest.party))];
      } else {
        const [guests, count] = await this.guestRepository.findAndCount({
          where: whereConditions,
          order: {
            createdAt: 'DESC',
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
        });

        totalCount = count;
        totalPages = Math.ceil(totalCount / pageSize);
        hasNextPage = page < totalPages;
        guestParties = [...new Set(guests.map((guest) => guest.party))];

        _guests = await Promise.all(
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
      }

      this.logger.log('[SEARCH-EVENT-GUESTS-QUERY-SUCCESS]');

      return {
        hasNextPage,
        totalPages,
        guestParties,
        guests: _guests,
      };
    } catch (error) {
      this.logger.error('[SEARCH-EVENT-GUESTS-QUERY-ERROR]', error);

      throw error;
    }
  }
}
