import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '@app/common/src/models/event.model';
import authUtils from '@app/common/src/security/auth.utils';
import { FetchShareFormPasscodeQuery } from '../../impl';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { GenerateShareFormPasscodeInfo } from '@app/event-service/src/interface/schema';

@QueryHandler(FetchShareFormPasscodeQuery)
export class FetchShareFormPasscodeQueryHandler
  implements IQueryHandler<FetchShareFormPasscodeQuery, GenerateShareFormPasscodeInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async execute(query: FetchShareFormPasscodeQuery) {
    try {
      this.logger.log(`[GENERATE-SHAREFORM-PASSCODE-HANDLER-PROCESSING]`);

      const { eventId, secureUser } = query;

	    const event = await this.eventRepository.findOne({
				where: {
					id: eventId,
				},
    	});

      if (!event) {
        throw new NotFoundException('Event not found.');
      }

			const passcode = authUtils.generateRandomPin();
			const passcodeExpires = authUtils.generateFutureDate(
				2,
				'hours',
			);

			Object.assign(event, {
				passcode,
				passcodeExpires,
			});

      await this.eventRepository.save(event);
            
      const diffInMilliseconds = Math.abs(passcodeExpires.getTime() - new Date().getTime());
      const diffInHours = Math.ceil(diffInMilliseconds / (1000 * 60 * 60));

      this.logger.log(`[GENERATE-SHAREFORM-PASSCODE-HANDLER-SUCCESS]`);

      return {
        passcode,
        passcodeExpires,
        // passcodeExpires: `Passcode expires in ${diffInHours} hours!`,
      };
    } catch (error) {
      this.logger.log(`[GENERATE-SHAREFORM-PASSCODE-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
