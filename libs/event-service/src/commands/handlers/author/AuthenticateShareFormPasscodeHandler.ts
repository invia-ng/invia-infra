import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '@app/common/src/models/event.model';
import authUtils from '@app/common/src/security/auth.utils';
import { AuthenticateShareFormPasscodeCommand } from '../../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { AuthenticateShareFormInfo } from '@app/event-service/src/interface/schema';

@CommandHandler(AuthenticateShareFormPasscodeCommand)
export class AuthenticateShareFormPasscodeHandler
  implements ICommandHandler<AuthenticateShareFormPasscodeCommand, AuthenticateShareFormInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async execute(command: AuthenticateShareFormPasscodeCommand) {
    try {
      this.logger.log(`[AUTHENTICATE-SHARE-FORM-PASSCODE-HANDLER-PROCESSING]`);

      const { eventHash, passcode } = command;

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
				eventHash: event.hash,
				expiresAt: authUtils.generateFutureDate(
					2,
					'hours',
				),
			});

			// console.log(`[DECODED-TOKEN] :: `, authUtils.decodeAccessToken(accessToken));
			// console.log(`[IS-DECODED-TOKEN-EXPIRED] :: `, authUtils.isAccessTokenExpired(accessToken));
            
      this.logger.log(`[AUTHENTICATE-SHARE-FORM-PASSCODE-HANDLER-SUCCESS]`);

      return {
        accessToken,
      };
    } catch (error) {
      this.logger.log(`[AUTHENTICATE-SHARE-FORM-PASSCODE-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
