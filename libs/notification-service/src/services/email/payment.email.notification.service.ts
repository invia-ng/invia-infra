import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Setting } from '@app/common/src/models/setting.model';
import { AppLogger } from '@app/common/src/logger/logger.service';
import { EmailSenderService } from 'libs/helper-service/src/services/email-sender.service';
import { event_invitation_payment_receipt_html_content } from '../../templates/payment/event_invitation_payment_receipt_email_template';

@Injectable()
export class PaymentEmailNotificationService {
  private adminSettings: Setting;

  constructor(
    public commandBus: CommandBus,
    private configService: ConfigService,
    private gmailMailerService: MailerService,
    private emailSenderService: EmailSenderService,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async initializeAdminSettings() {
    this.adminSettings = await this.settingRepository.findOne({
      where: {
        position: 1,
      },
    });
  }

  async eventInvitationPaymentReceiptNotification(payload: {
    amount: string;
    eventName: string;
    recipientEmail: string;
    paymentReference: string;
  }) {
    await this.initializeAdminSettings();

    try {
      this.logger.log(
        `[EVENT-INVITATION-PAYMENT-RECEIPT-NOTIFICATION-PROCESSING]`,
      );

      const htmlContent = event_invitation_payment_receipt_html_content({
        amount: String(Number(payload.amount)),
        paymentReference: payload.paymentReference,
        paymentDate: new Date().toString().slice(0, 10),
        eventName: payload.eventName,
      });

      if (
        this.adminSettings.isSMTPEnabled === true &&
        this.adminSettings.isKibaMailEnabled === false
      ) {
        await this.gmailMailerService.sendMail({
          html: htmlContent,
          to: payload.recipientEmail,
          subject: 'Event Invitation Payment Receipt',
          from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
        });

        return;
      } else if (
        this.adminSettings.isKibaMailEnabled === true &&
        this.adminSettings.isSMTPEnabled === false
      ) {
        return this.emailSenderService.sendEmailViaKibaAdmin({
          html: htmlContent,
          sub: 'Event Invitation Payment Receipt',
          to_email: payload.recipientEmail,
        });
      }

      this.logger.log(
        `[EVENT-INVITATION-PAYMENT-RECEIPT-NOTIFICATION-SUCCESS]`,
      );

      return true;
    } catch (error) {
      this.logger.log(
        `[EVENT-INVITATION-PAYMENT-RECEIPT-NOTIFICATION-ERROR]: ${error}`,
      );

      return false;
    }
  }
}
