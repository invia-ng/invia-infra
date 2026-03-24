import { In, Repository } from 'typeorm';
import {
  Guest,
  GuestInfo,
  GuestTimeline,
} from '@app/common/src/models/guest.model';
import { AddEventGuestsCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '@app/common/src/models/event.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { AccountRole, GuestTimelineActionEnum, SubscriptionItemLimitEnum } from '@app/common/src/constants/enums';
import { Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Subscription } from '@app/common/src/models/subscription.model';

@CommandHandler(AddEventGuestsCommand)
export class AddEventGuestsHandler implements ICommandHandler<
  AddEventGuestsCommand,
  GuestInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(GuestTimeline)
    private readonly guestTimelineRepository: Repository<GuestTimeline>,
  ) { }

  async execute(command: AddEventGuestsCommand) {
    try {
      this.logger.log(`[ADD-EVENT-GUESTS-HANDLER-PROCESSING]`);

      const { eventId, payload, secureUser } = command;

      if (secureUser.role === AccountRole.MEMBER) {
        throw new ForbiddenException(
          'You do not have permission to add guests to events.',
        );
      }

      const guests: GuestInfo[] = [];

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

      const [subscription, guestsCount] = await Promise.all([
        this.subscriptionRepository.findOne({
          where: {
            business: {
              id: business.id,
            },
            isExpired: false,
          },
        }),
        this.guestRepository.count({
          where: {
            event: {
              id: eventId,
            },
          },
        }),
      ]);

      const planName = subscription?.plan?.name ?? '';
      const isStudio = planName.toLowerCase().includes('studio');
      const isPro = planName.toLowerCase().includes('pro');
      const isUnlimited = subscription?.guestLimitStatus === SubscriptionItemLimitEnum.UNLIMITED || isStudio;

      if (!isUnlimited) {
        const planLimit = isPro ? 300 : 50;
        const effectiveLimit = subscription?.guestLimit > 0 ? subscription.guestLimit : planLimit;

        if (guestsCount >= effectiveLimit) {
          const planLabel = isPro ? 'Pro plan' : 'free tier';
          throw new BadRequestException(
            `You have reached the maximum number of guests allowed for your ${planLabel} (${effectiveLimit} guests per event).${!isPro ? ' Upgrade to a Pro or Studio plan for more.' : ''}`,
          );
        }
      }

      const eventInstance = await this.eventRepository.findOne({
        where: {
          id: eventId,
        },
      });

      if (!eventInstance) {
        throw new NotFoundException('Event not found.');
      }

      const exists = await this.guestRepository.findOne({
        where: {
          event: {
            id: eventId,
          },
          phone: In(payload.guests.map((guest) => guest.phone)),
        },
      });

      if (exists) {
        throw new BadRequestException(
          `Your new guest ${exists.name} with phone number ${exists.phone} already exists.`,
        );
      }

      await Promise.all(
        payload.guests.map(async (guest) => {
          try {
            this.logger.log('[ADD-EVENT-GUEST-HANDLER-PROCESSING]');

            const _guest = this.guestRepository.create({
              name: guest.name,
              email: guest.email,
              party: guest.party,
              phone: guest.phone,
              event: eventInstance,
            });

            const instance = await this.guestRepository.save(_guest);

            await this.guestTimelineRepository.save({
              guest: instance,
              description:
                secureUser.id === business.account.id
                  ? `${guest.name} was added by you.`
                  : `${guest.name} was added by ${secureUser.name}.`,
              action: GuestTimelineActionEnum.GUEST_ADDED_BY_USER,
            });

            guests.push(modelsFormatter.FormatGuestInfo(instance));

            this.logger.log('[ADD-EVENT-GUEST-HANDLER-SUCCESS]');
          } catch (error) {
            this.logger.error(`[ADD-EVENT-GUEST-HANDLER-ERROR] :: ${error}`);
          }
        }),
      );

      this.logger.log(`[ADD-EVENT-GUESTS-HANDLER-SUCCESS]`);

      return guests;
    } catch (error) {
      this.logger.log(`[ADD-EVENT-GUESTS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
