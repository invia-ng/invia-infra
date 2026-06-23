import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Setting } from '@app/common/src/models/setting.model';
import { AppLogger } from '@app/common/src/logger/logger.service';
import { EmailSenderService } from 'libs/helper-service/src/services/email-sender.service';
import { premium_subscription_payment_receipt_html_content } from '../../templates/subscription/premium_subscription_payment_receipt_email_template';

@Injectable()
export class SubscriptionsEmailNotificationService {
  private adminSettings: Setting;

  constructor(
    public commandBus: CommandBus,
    private configService: ConfigService,
    private gmailMailerService: MailerService,
    private emailSenderService: EmailSenderService,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) { }

  async initializeAdminSettings() {
    this.adminSettings = await this.settingRepository.findOne({
      where: {
        position: 1,
      },
    });
  }

  async premiumSubscriptionPaymentReceiptNotification(payload: {
    amount: string;
    recipientEmail: string;
    isBankTransfer: boolean;
    paymentReference: string;
  }) {
    await this.initializeAdminSettings();

    try {
      this.logger.log(`[PREMIUM-SUBSCRIPTION-PAYMENT-RECEIPT-NOTIFICATION-PROCESSING]`);

      const htmlContent = premium_subscription_payment_receipt_html_content(
        {
          amount: payload.amount,
          paymentReference: payload.paymentReference,
          paymentDate: new Date().toString().slice(0, 10),
          dashboardUrl: `${this.configService.get<string>('WEB_APP_URL')}/dashboard`,
        },
      );

      if (
        this.adminSettings.isSMTPEnabled === true &&
        this.adminSettings.isKibaMailEnabled === false &&
        this.adminSettings.isResendAPIEnabled === false
      ) {
        await this.gmailMailerService.sendMail({
          html: htmlContent,
          to: payload.recipientEmail,
          subject: 'Payment Receipt',
          from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
        });

        return;
      } else if (
        this.adminSettings.isKibaMailEnabled === true &&
        this.adminSettings.isSMTPEnabled === false &&
        this.adminSettings.isResendAPIEnabled === false
      ) {
        return this.emailSenderService.sendEmailViaKibaAdmin({
          html: htmlContent,
          sub: 'Payment Receipt',
          to_email: payload.recipientEmail,
        });
      } else if (
        this.adminSettings.isResendAPIEnabled === true &&
        this.adminSettings.isSMTPEnabled === false &&
        this.adminSettings.isKibaMailEnabled === false
      ) {
        await this.emailSenderService.sendEmailViaResend({
          html: htmlContent,
          sub: 'Payment Receipt',
          to_email: payload.recipientEmail,
        });
      }

      this.logger.log(`[PREMIUM-SUBSCRIPTION-PAYMENT-RECEIPT-NOTIFICATION-SUCCESS]`);

      return true;
    } catch (error) {
      this.logger.log(
        `[PREMIUM-SUBSCRIPTION-PAYMENT-RECEIPT-NOTIFICATION-ERROR]: ${error}`,
      );

      return false;
    }
  }
}
