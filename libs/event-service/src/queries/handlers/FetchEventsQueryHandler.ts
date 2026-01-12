import { In, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { FetchEventsQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { Guest } from '@app/common/src/models/guest.model';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Invitation } from '@app/common/src/models/invitation.model';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import {
  Event,
  EventInfo,
  EventsResponse,
} from '@app/common/src/models/event.model';

@QueryHandler(FetchEventsQuery)
export class FetchEventsQueryHandler implements IQueryHandler<
  FetchEventsQuery,
  EventsResponse
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  async execute(query: FetchEventsQuery) {
    try {
      this.logger.log('[FETCH-EVENTS-QUERY-PROCESSING]');

      const { isActive, page, pageSize, secureUser } = query;

      let totalCount: number = 0;
      let _events: Event[] = [];
      const events: EventInfo[] = [];

      const business = await this.businessRepository.findOne({
        where: [
          {
            members: {
              id: secureUser.id,
            },
          },
          {
            account: {
              id: secureUser.id,
            },
          },
        ],
      });

      if (!business) {
        throw new NotFoundException(`Business record not found for user`);
      }

      if (isActive === null || isActive === undefined) {
        [_events, totalCount] = await this.eventRepository.findAndCount({
          where: {
            business: {
              id: business.id,
            },
          },
          order: {
            createdAt: 'DESC',
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
        });
      } else {
        [_events, totalCount] = await this.eventRepository.findAndCount({
          where: {
            business: {
              id: business.id,
            },
            date:
              isActive === true
                ? MoreThanOrEqual(new Date())
                : LessThan(new Date()),
          },
          order: {
            createdAt: 'DESC',
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
        });
      }

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNext = page < totalPages;

      await Promise.all(
        _events.map(async (item) => {
          try {
            this.logger.log('[PROCESS-EVENT-INFO-PROCESSING]');

            const guests = await this.guestRepository.count({
              where: {
                event: {
                  id: item.id,
                },
              },
            });

            const invitations = await this.invitationRepository.find({
              where: {
                event: {
                  id: item.id,
                },
              },
            });

            const totalInvites = invitations.length;
            const sentInvites = invitations.filter(
              (invite) => invite.isSent,
            ).length;
            const acceptedInvites = invitations.filter(
              (invite) => invite.isRSVP === true,
            ).length;
            const pendingInvites = invitations.filter(
              (invite) => invite.isSent === false,
            ).length;
            const failedInvites = invitations.filter(
              (invite) => invite.isDelivered === false,
            ).length;

            events.push(
              modelsFormatter.FormatEventInfo(
                item,
                guests,
                totalInvites,
                sentInvites,
                acceptedInvites,
                pendingInvites,
                failedInvites,
              ),
            );

            this.logger.log('[PROCESS-EVENT-INFO-SUCCESS]');
          } catch (error) {
            this.logger.error(`[PROCESS-EVENT-INFO-ERROR] :: ${error}`);
          }
        }),
      );

      this.logger.log('[FETCH-EVENTS-QUERY-SUCCESS]');

      return {
        events,
        hasNext,
        totalPages,
        totalInvites: totalCount,
      } as unknown as EventsResponse;
    } catch (error) {
      this.logger.error('[FETCH-EVENTS-QUERY-ERROR]', error);

      throw error;
    }
  }
}
