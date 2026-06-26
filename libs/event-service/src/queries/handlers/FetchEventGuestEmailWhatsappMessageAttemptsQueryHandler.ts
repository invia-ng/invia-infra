import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { Guest } from '@app/common/src/models/guest.model';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import {
  EmailWhatsappMessageAttempt,
  EmailWhatsappMessageAttemptInfo,
} from '@app/common/src/models/email.whatsapp.message.attempt.model';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { FetchEventGuestEmailWhatsappMessageAttemptsQuery } from '../impl';

@QueryHandler(FetchEventGuestEmailWhatsappMessageAttemptsQuery)
export class FetchEventGuestEmailWhatsappMessageAttemptsQueryHandler implements IQueryHandler<
  FetchEventGuestEmailWhatsappMessageAttemptsQuery,
  EmailWhatsappMessageAttemptInfo[]
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(EmailWhatsappMessageAttempt)
    private readonly emailWhatsappMessageAttemptRepository: Repository<EmailWhatsappMessageAttempt>,
  ) {}

  async execute(query: FetchEventGuestEmailWhatsappMessageAttemptsQuery) {
    try {
      this.logger.log(
        '[FETCH-EVENT-GUEST-EMAIL-WHATSAPP-MESSAGE-ATTEMPTS-QUERY-PROCESSING]',
      );

      const { guestId, page, pageSize, secureUser } = query;

      const guest = await this.guestRepository.findOne({
        where: {
          id: guestId,
        },
      });

      if (!guest) {
        throw new NotFoundException('Guest not found');
      }

      const emailWhatsappMessageAttempts =
        await this.emailWhatsappMessageAttemptRepository.find({
          where: {
            invitation: {
              guest: {
                id: guestId,
              },
            },
          },
          order: {
            createdAt: 'DESC',
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
        });

      this.logger.log(
        '[FETCH-EVENT-GUEST-EMAIL-WHATSAPP-MESSAGE-ATTEMPTS-QUERY-SUCCESS]',
      );

      return emailWhatsappMessageAttempts.map(
        modelsFormatter.FormatEmailWhatsappMessageAttemptInfo,
      );
    } catch (error) {
      this.logger.error(
        '[FETCH-EVENT-GUEST-EMAIL-WHATSAPP-MESSAGE-ATTEMPTS-QUERY-ERROR]',
        error,
      );

      throw error;
    }
  }
}
