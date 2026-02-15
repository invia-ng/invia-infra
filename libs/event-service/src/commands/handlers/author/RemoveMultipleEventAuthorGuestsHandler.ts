import {
  BadRequestException,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from '@app/common/src/models/guest.model';
import authUtils from '@app/common/src/security/auth.utils';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { DeleteDataInstanceInfo } from '../../../interface/schema';
import { RemoveMultipleEventAuthorGuestsCommand } from '../../impl';

@CommandHandler(RemoveMultipleEventAuthorGuestsCommand)
export class RemoveMultipleEventAuthorGuestsHandler
  implements ICommandHandler<RemoveMultipleEventAuthorGuestsCommand, DeleteDataInstanceInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) { }

  async execute(command: RemoveMultipleEventAuthorGuestsCommand) {
    try {
      this.logger.log(`[REMOVE-MULTIPLE-EVENT-GUESTS-HANDLER-PROCESSING]`);

      const { guestIds, accessToken } = command;

      const isTokenExpired = authUtils.isAccessTokenExpired(accessToken);

      // console.log('[TOKEN] :: ', accessToken, isTokenExpired)

      if (isTokenExpired) {
        this.logger.log('[FETCH-EVENT-GUESTS-QUERY-ERROR]');

        throw new UnauthorizedException('Invalid access token');
      }

      const decodedToken = authUtils.decodeAccessToken(accessToken);

      let ids = Array.isArray(guestIds) ? guestIds : [guestIds];
      ids = ids.map((id) => Number(id));

      const guests = await this.guestRepository.find({
        where: {
          id: In(ids),
          event: {
            id: decodedToken.eventId,
          },
        },
      });

      if (!guests || guests.length === 0) {
        throw new NotFoundException('Guests not found.');
      }

      if (guests.some((guest) => guest.authorEmail !== decodedToken.guestEmail)) {
        throw new BadRequestException(
          `You are not authorized to remove these guests from this event.`,
        );
      }

      await Promise.all(guests.map(async (guest) => {
        try {
          this.logger.log(`[REMOVE-EVENT-GUEST-HANDLER-PROCESSING]`);

          await this.guestRepository.remove(guest);

          this.logger.log(`[REMOVE-EVENT-GUEST-HANDLER-SUCCESS]`);

        } catch (error) {
          this.logger.error(`[REMOVE-EVENT-GUEST-HANDLER-ERROR] :: ${error}`);
        }
      }));

      this.logger.log(`[REMOVE-MULTIPLE-EVENT-GUESTS-HANDLER-SUCCESS]`);

      return {
        status: true,
        message: 'Guests removed from event successfully.',
      };
    } catch (error) {
      this.logger.log(`[REMOVE-MULTIPLE-EVENT-GUESTS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
