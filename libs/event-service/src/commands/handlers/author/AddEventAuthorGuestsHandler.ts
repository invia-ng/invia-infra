import {
  Inject,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { In, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddEventAuthorGuestsCommand } from '../../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Event, EventInfo } from '@app/common/src/models/event.model';
import { Guest, GuestInfo } from '@app/common/src/models/guest.model';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import authUtils from '@app/common/src/security/auth.utils';

@CommandHandler(AddEventAuthorGuestsCommand)
export class AddEventAuthorGuestsHandler implements ICommandHandler<
  AddEventAuthorGuestsCommand,
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
  ) {}

  async execute(command: AddEventAuthorGuestsCommand) {
    try {
      this.logger.log(`[ADD-EVENT-GUESTS-HANDLER-PROCESSING]`);

      const { payload, accessToken } = command;

      const guests: GuestInfo[] = [];

      const isTokenExpired = authUtils.isAccessTokenExpired(accessToken);

      // console.log('[TOKEN] :: ', accessToken, isTokenExpired)

      if (isTokenExpired) {
        this.logger.log('[FETCH-EVENT-GUESTS-QUERY-ERROR]');

        throw new UnauthorizedException('Invalid access token');
      }

      const decodedToken = authUtils.decodeAccessToken(accessToken);

      const event = await this.eventRepository.findOne({
        where: {
          hash: decodedToken.eventHash,
        },
      });

      if (!event) {
        this.logger.log('[FETCH-EVENT-GUESTS-QUERY-ERROR]');

        throw new UnauthorizedException('Invalid access token');
      }

      const exists = await this.guestRepository.findOne({
        where: {
          event: {
            id: decodedToken.eventId,
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
              event,
              name: guest.name,
              email: guest.email,
              party: guest.party,
              phone: guest.phone,
            });

            const instance = await this.guestRepository.save(_guest);

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
