import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AppLogger } from '../../../../common/src/logger/logger.service';
import { initialize_promotion_payment_session_error_html_content } from '../../templates/emails/admin/initialize_promotion_payment_session_error_email_template';
import { initialize_product_upload_payment_session_error_html_content } from '../../templates/emails/admin/initialize_product_upload_payment_session_error_email_template';
import { initialize_premium_subscription_payment_session_error_html_content } from '../../templates/emails/admin/initialize_premium_subscription_payment_session_error_email_template';

@Injectable()
export class AdminAlertEmailNotificationService {
  constructor(
    private configService: ConfigService,
    private readonly gmailMailerService: MailerService,
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  async sendInitializeProductUploadPaymentSessionErrorEmailNotification(
    instanceError: any,
    userEmail: string,
    planId: string,
    paymentChannel: string,
  ) {
    try {
      this.logger.log(
        '[SEND-INITIALIZE-PRODUCT-UPLOAD-PAYMENT-SESSION-ERROR-EMAIL-NOTIFICATION-PROCESSING]',
      );

      const htmlContent =
        initialize_product_upload_payment_session_error_html_content(
          instanceError,
          instanceError.message,
          userEmail,
          planId,
          paymentChannel,
        );

      await this.gmailMailerService.sendMail({
        html: htmlContent,
        to: ['tisanyada@gmail.com'],
        // to: ['tisanyada@gmail.com', 'livestocxltd@gmail.com'],
        subject: 'Initialize Product Upload Payment Session Error',
        from: `"Livestocx" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
      });

      this.logger.log(
        '[SEND-INITIALIZE-PRODUCT-UPLOAD-PAYMENT-SESSION-ERROR-EMAIL-NOTIFICATION-SUCCESS]',
      );
    } catch (error) {
      this.logger.log(
        `[SEND-INITIALIZE-PRODUCT-UPLOAD-PAYMENT-SESSION-ERROR-EMAIL-NOTIFICATION-ERROR] :: ${error}`,
      );
      throw error;
    }
  }

  async sendInitializePromotionPaymentSessionErrorEmailNotification(
    instanceError: any,
    userEmail: string,
    planId: string,
    paymentChannel: string,
  ) {
    try {
      this.logger.log(
        '[SEND-INITIALIZE-PROMOTION-PAYMENT-SESSION-ERROR-EMAIL-NOTIFICATION-PROCESSING]',
      );

      const htmlContent =
        initialize_promotion_payment_session_error_html_content(
          instanceError,
          instanceError.message,
          userEmail,
          planId,
          paymentChannel,
        );

      await this.gmailMailerService.sendMail({
        html: htmlContent,
        to: ['tisanyada@gmail.com'],
        // to: ['tisanyada@gmail.com', 'livestocxltd@gmail.com'],
        subject: 'Initialize Promotion Payment Session Error',
        from: `"Livestocx" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
      });

      this.logger.log(
        '[SEND-INITIALIZE-PROMOTION-PAYMENT-SESSION-ERROR-EMAIL-NOTIFICATION-SUCCESS]',
      );
    } catch (error) {
      this.logger.log(
        `[SEND-INITIALIZE-PROMOTION-PAYMENT-SESSION-ERROR-EMAIL-NOTIFICATION-ERROR] :: ${error}`,
      );
      throw error;
    }
  }

  async sendInitializePremiumSubscriptionPaymentSessionErrorEmailNotification(
    instanceError: any,
    userEmail: string,
    planId: string,
    paymentChannel: string,
  ) {
    try {
      this.logger.log(
        '[SEND-INITIALIZE-PREMIUM-SUBSCRIPTION-PAYMENT-SESSION-ERROR-EMAIL-NOTIFICATION-PROCESSING]',
      );

      const htmlContent =
        initialize_premium_subscription_payment_session_error_html_content(
          instanceError,
          instanceError.message,
          userEmail,
          planId,
          paymentChannel,
        );

      await this.gmailMailerService.sendMail({
        html: htmlContent,
        to: ['tisanyada@gmail.com'],
        // to: ['tisanyada@gmail.com', 'livestocxltd@gmail.com'],
        subject: 'Initialize Premium Subscription Payment Session Error',
        from: `"Livestocx" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
      });

      this.logger.log(
        '[SEND-INITIALIZE-PREMIUM-SUBSCRIPTION-PAYMENT-SESSION-ERROR-EMAIL-NOTIFICATION-SUCCESS]',
      );
    } catch (error) {
      this.logger.log(
        `[SEND-INITIALIZE-PREMIUM-SUBSCRIPTION-PAYMENT-SESSION-ERROR-EMAIL-NOTIFICATION-ERROR] :: ${error}`,
      );
      throw error;
    }
  }
}
