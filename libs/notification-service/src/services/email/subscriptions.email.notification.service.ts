import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Setting } from '@app/common/src/models/setting.model';
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

  async premiumSubscriptionPaymentReceiptNotification(payload: {
    amount: string;
    recipientEmail: string;
    isBankTransfer: boolean;
    paymentReference: string;
  }) {
    const htmlContent = await premium_subscription_payment_receipt_html_content(
      {
        amount: payload.amount,
        paymentReference: payload.paymentReference,
        paymentDate: new Date().toString().slice(0, 10),
        dashboardUrl: `${this.configService.get<string>('WEB_APP_URL')}/dashboard`,
      },
    );

    if (this.adminSettings.isSMTPEnabled === true) {
      return await this.gmailMailerService.sendMail({
        html: htmlContent,
        to: payload.recipientEmail,
        subject: 'Payment Receipt',
        from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
      });
    } else {
      return this.emailSenderService.sendEmail({
        html: htmlContent,
        sub: 'Payment Receipt',
        to_email: payload.recipientEmail,
      });
    }
  }
}
