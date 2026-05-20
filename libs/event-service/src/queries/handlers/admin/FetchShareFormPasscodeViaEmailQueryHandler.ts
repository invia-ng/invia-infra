import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '@app/common/src/models/event.model';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import authUtils from '@app/common/src/security/auth.utils';
import { FetchShareFormPasscodeViaEmailQuery } from '../../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { GenerateShareFormPasscodeInfo } from '@app/event-service/src/interface/schema';
import { EventEmailNotificationService } from '@app/notification-service/src/services/email/event.email.notification.service';

@QueryHandler(FetchShareFormPasscodeViaEmailQuery)
export class FetchShareFormPasscodeQueryHandler
  implements IQueryHandler<FetchShareFormPasscodeViaEmailQuery, GenerateShareFormPasscodeInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly eventEmailNotificationService: EventEmailNotificationService,
  ) { }

  async execute(query: FetchShareFormPasscodeViaEmailQuery) {
    try {
      this.logger.log(`[GENERATE-SHAREFORM-PASSCODE-HANDLER-PROCESSING]`);

      const { guestEmail, eventId, secureUser } = query;

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
        7,
        'days',
      );

      Object.assign(event, {
        passcode,
        passcodeExpires,
      });

      await this.eventRepository.save(event);

      const diffInMilliseconds = Math.abs(passcodeExpires.getTime() - new Date().getTime());
      const diffInHours = Math.ceil(diffInMilliseconds / (1000 * 60 * 60));

      await this.eventEmailNotificationService.sendEventShareFormPasscodeEmailNotification({
        event,
        guestEmail,
      });

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
