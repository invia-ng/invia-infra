import {
  Guest,
  GuestInfo,
  GuestTimeline,
} from '@app/common/src/models/guest.model';
import { In, Raw, Repository } from 'typeorm';
import { UpdateEventGuestCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Event, EventInfo } from '@app/common/src/models/event.model';
import { GuestTimelineActionEnum } from '@app/common/src/constants/enums';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';

@CommandHandler(UpdateEventGuestCommand)
export class UpdateEventGuestHandler implements ICommandHandler<
  UpdateEventGuestCommand,
  GuestInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(GuestTimeline)
    private readonly guestTimelineRepository: Repository<GuestTimeline>,
  ) {}

  async execute(command: UpdateEventGuestCommand) {
    try {
      this.logger.log(`[UPDATE-EVENT-GUEST-HANDLER-PROCESSING]`);

      const { eventId, guestId, payload, secureUser } = command;

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
          phone: payload.phone,
        },
      });

      const guest = await this.guestRepository.findOne({
        where: {
          id: guestId,
          event: {
            id: eventId,
          },
        },
      });

      if (exists && Number(exists.id) !== Number(guestId)) {
        throw new BadRequestException(
          `A guest with the phone number ${exists.phone} already exists.`,
        );
      }

      const actorName =
        secureUser.name === business.account.name ? 'You' : secureUser.name;

      const timelineEvents = [];

      console.log('[PAYLOAD] :: ', payload);

      if (guest.name !== payload.name) {
        timelineEvents.push({
          guest: guest,
          action: GuestTimelineActionEnum.EDIT_NAME,
          description: `${actorName} edited name from ${guest.name} to ${payload.name}`,
        });
      }

      if (guest.phone !== payload.phone) {
        timelineEvents.push({
          guest: guest,
          action: GuestTimelineActionEnum.EDIT_PHONE,
          description: `${actorName} edited WhatsApp number from ${guest.phone} to ${payload.phone}`,
        });
      }

      if (payload.email && guest.email !== payload.email) {
        timelineEvents.push({
          guest: guest,
          action: GuestTimelineActionEnum.EDIT_EMAIL,
          description: `${actorName} edited Email from ${guest.email} to ${payload.email}`,
        });
      }

      Object.assign(guest, {
        name: payload.name,
        email: payload.email,
        party: payload.party,
        phone: payload.phone,
      });

      const instance = await this.guestRepository.save(guest);

      await Promise.all(
        timelineEvents.map((event) =>
          this.guestTimelineRepository.save({
            ...event,
            guest: instance,
          }),
        ),
      );

      this.logger.log(`[ADD-EVENT-GUESTS-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatGuestInfo(guest);
    } catch (error) {
      this.logger.log(`[ADD-EVENT-GUESTS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
