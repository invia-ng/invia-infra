import { Inject } from '@nestjs/common';
import { Raw, Repository } from 'typeorm';
import { FetchEventGuestsQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Invitation } from '@app/common/src/models/invitation.model';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Guest, GuestInfo, GuestsResponse } from '@app/common/src/models/guest.model';
import { AccountRole } from '@app/common/src/constants/enums';

@QueryHandler(FetchEventGuestsQuery)
export class FetchEventGuestsQueryHandler implements IQueryHandler<
  FetchEventGuestsQuery,
  GuestsResponse
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) { }

  async execute(query: FetchEventGuestsQuery) {
    try {
      this.logger.log('[FETCH-EVENT-GUESTS-QUERY-PROCESSING]');

      const { page, pageSize, eventId, secureUser } = query;

      const _guests: GuestInfo[] = [];

      const [guests, totalCount] = await this.guestRepository.findAndCount({
        where: {
          event: {
            id: eventId,
          },
        },
        order: {
          createdAt: 'DESC',
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNext = page < totalPages;

      await Promise.all(guests.map(async (guest) => {
        try {
          this.logger.error('[FETCH-EVENT-GUEST-INVITATION-MANAGER-PROCESSING]');

          const invitation = await this.invitationRepository.findOne({
            where: {
              guest: {
                id: guest.id,
              },
              event: {
                id: eventId,
              },
            },
            order: {
              createdAt: 'DESC',
            },
          });

          _guests.push(modelsFormatter.FormatGuestInfo(guest, invitation, secureUser.role === AccountRole.MEMBER));

          this.logger.error('[FETCH-EVENT-GUEST-INVITATION-MANAGER-SUCCESS]');
        } catch (error) {
          this.logger.error('[FETCH-EVENT-GUEST-INVITATION-MANAGER-ERROR]', error);
        }
      }))

      this.logger.log('[FETCH-EVENT-GUESTS-QUERY-SUCCESS]');

      return {
        hasNext,
        totalPages,
        guests: _guests,
        guestParties: [...new Set(guests.map((guest) => guest.party))],
      } as unknown as GuestsResponse;
    } catch (error) {
      this.logger.error('[FETCH-EVENT-GUESTS-QUERY-ERROR]', error);

      throw error;
    }
  }
}
