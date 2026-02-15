import {
  BadRequestException,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RemoveEventAuthorGuestCommand } from '../../impl';
import { Guest } from '@app/common/src/models/guest.model';
import authUtils from '@app/common/src/security/auth.utils';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { DeleteDataInstanceInfo } from '../../../interface/schema';

@CommandHandler(RemoveEventAuthorGuestCommand)
export class RemoveEventAuthorGuestHandler
  implements ICommandHandler<RemoveEventAuthorGuestCommand, DeleteDataInstanceInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) { }

  async execute(command: RemoveEventAuthorGuestCommand) {
    try {
      this.logger.log(`[REMOVE-EVENT-GUEST-HANDLER-PROCESSING]`);

      const { guestId, accessToken } = command;

      const isTokenExpired = authUtils.isAccessTokenExpired(accessToken);

      // console.log('[TOKEN] :: ', accessToken, isTokenExpired)

      if (isTokenExpired) {
        this.logger.log('[FETCH-EVENT-GUESTS-QUERY-ERROR]');

        throw new UnauthorizedException('Invalid access token');
      }

      const decodedToken = authUtils.decodeAccessToken(accessToken);

      const guest = await this.guestRepository.findOne({
        where: {
          id: guestId,
          event: {
            id: decodedToken.eventId,
          },
        },
      });

      if (!guest) {
        throw new NotFoundException('Guest not found.');
      }

      if (guest.authorEmail !== decodedToken.guestEmail) {
        throw new BadRequestException(
          `You are not authorized to remove this guest from this event.`,
        );
      }

      await this.guestRepository.remove(guest);

      this.logger.log(`[REMOVE-EVENT-GUEST-HANDLER-SUCCESS]`);

      return {
        status: true,
        message: 'Guest removed from event successfully.',
      };
    } catch (error) {
      this.logger.log(`[REMOVE-EVENT-GUEST-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
