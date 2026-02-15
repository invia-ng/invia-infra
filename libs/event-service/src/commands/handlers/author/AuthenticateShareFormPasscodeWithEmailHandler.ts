import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from '@app/common/src/models/event.model';
import authUtils from '@app/common/src/security/auth.utils';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { AuthenticateShareFormPasscodeWithEmailCommand } from '../../impl';
import { AuthenticateShareFormInfo } from '@app/event-service/src/interface/schema';

@CommandHandler(AuthenticateShareFormPasscodeWithEmailCommand)
export class AuthenticateShareFormPasscodeWithEmailHandler
  implements ICommandHandler<AuthenticateShareFormPasscodeWithEmailCommand, AuthenticateShareFormInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) { }

  async execute(command: AuthenticateShareFormPasscodeWithEmailCommand) {
    try {
      this.logger.log(`[AUTHENTICATE-SHARE-FORM-PASSCODE-WITH-EMAIL-HANDLER-PROCESSING]`);

      const { guestEmail, eventHash, passcode } = command;

      const event = await this.eventRepository.findOne({
        where: {
          hash: eventHash,
          passcode: passcode,
          passcodeExpires: MoreThanOrEqual(new Date())
        },
      });

      if (!event) {
        throw new NotFoundException('Invalid passcode or event does not exist.');
      }

      const accessToken = authUtils.generateAccessToken({
        eventId: event.id,
        guestEmail: guestEmail,
        eventHash: event.hash,
        expiresAt: authUtils.generateFutureDate(
          7,
          'days',
        ),
      });

      // console.log(`[DECODED-TOKEN] :: `, authUtils.decodeAccessToken(accessToken));
      // console.log(`[IS-DECODED-TOKEN-EXPIRED] :: `, authUtils.isAccessTokenExpired(accessToken));

      this.logger.log(`[AUTHENTICATE-SHARE-FORM-PASSCODE-WITH-EMAIl-HANDLER-SUCCESS]`);

      return {
        accessToken,
      };
    } catch (error) {
      this.logger.log(`[AUTHENTICATE-SHARE-FORM-PASSCODE-WITH-EMAIL-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
