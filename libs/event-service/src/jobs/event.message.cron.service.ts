import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { appMoment } from '@app/common/src/utils/moment';
import { In, LessThanOrEqual, Repository } from 'typeorm';
import { AppLogger } from '@app/common/src/logger/logger.service';
import { getNextRetryAt } from '@app/common/src/helpers/date-helper';
import { EmailWhatsappMessageAttemptStatusEnum } from '@app/common/src/constants/enums';
import { EmailWhatsappMessageAttempt } from '@app/common/src/models/email.whatsapp.message.attempt.model';
import { EventWhatsAppNotificationService } from '@app/notification-service/src/services/email/event.whatsapp.notification.service';

const CRON_TIMEZONE = 'Africa/Lagos';

@Injectable()
export class EventMessageCronService {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(EmailWhatsappMessageAttempt)
    private readonly emailWhatsappMessageAttemptRepository: Repository<EmailWhatsappMessageAttempt>,

    private readonly eventWhatsAppNotificationService: EventWhatsAppNotificationService,
  ) {}

  // !DAILY -> RETRY FAILED WHATSAPP / EMAIL MESSAGE ATTEMPTS
  // @Cron('*/10 * * * * *', { timeZone: CRON_TIMEZONE })
  @Cron('0 0,6,12,18 * * *', { timeZone: CRON_TIMEZONE })
  async processFailedWhatsappEmailMessageAttemptsCronNotification() {
    try {
      this.logger.log(
        `[PROCESS-FAILED-WHATSAPP-EMAIL-MESSAGE-ATTEMPTS-CRONJOB-PROCESSING]`,
      );

      const now = appMoment.tz(CRON_TIMEZONE);

      const emailWhatsappMessageAttempts =
        await this.emailWhatsappMessageAttemptRepository.find({
          where: {
            attemptNumber: LessThanOrEqual(3),
            // nextRetryAt: Between(startOfToday, dueBy),
            status: In([
              EmailWhatsappMessageAttemptStatusEnum.PENDING,
              EmailWhatsappMessageAttemptStatusEnum.FAILED,
            ]),
          },
        });

      await Promise.all(
        emailWhatsappMessageAttempts.map(async (attempt) => {
          try {
            this.logger.log(
              `[PROCESS-FAILED-WHATSAPP-EMAIL-MESSAGE-ATTEMPT-MANAGER-PROCESSING]`,
            );

            const whatsappResponse =
              await this.eventWhatsAppNotificationService.inviteEventGuestWhatsappNotification(
                attempt.invitation,
              );

            if (whatsappResponse) {
              Object.assign(attempt, {
                status: EmailWhatsappMessageAttemptStatusEnum.DELIVERED,
                nextRetryAt: null,
                errorCode: '',
                errorMessage: '',
                deliveredAt: appMoment().toDate(),
                lastAttemptAt: appMoment().toDate(),
                attemptNumber: attempt.attemptNumber + 1,
              });
            } else {
              Object.assign(attempt, {
                lastAttemptAt: appMoment().toDate(),
                attemptNumber: attempt.attemptNumber + 1,
                nextRetryAt: getNextRetryAt(attempt.lastAttemptAt),
                status: EmailWhatsappMessageAttemptStatusEnum.FAILED,
              });
            }

            this.logger.log(
              `[PROCESS-FAILED-WHATSAPP-EMAIL-MESSAGE-ATTEMPT-MANAGER-SUCCESS]`,
            );
          } catch (error) {
            this.logger.error(
              `[PROCESS-FAILED-WHATSAPP-EMAIL-MESSAGE-ATTEMPT-MANAGER-ERROR] :: ${error}`,
            );
          }
        }),
      );

      this.logger.log(
        `[PROCESS-FAILED-WHATSAPP-EMAIL-MESSAGE-ATTEMPTS-CRONJOB-SUCCESS]`,
      );
    } catch (error) {
      this.logger.error(
        `[PROCESS-FAILED-WHATSAPP-EMAIL-MESSAGE-ATTEMPTS-CRONJOB-ERROR] :: ${error}`,
      );
    }
  }
}
