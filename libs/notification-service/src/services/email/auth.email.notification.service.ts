import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Setting } from '@app/common/src/models/setting.model';
import { Account } from 'libs/common/src/models/account.model';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AppLogger } from '../../../../common/src/logger/logger.service';
import { AccountStatus, AccountRole } from 'libs/common/src/constants/enums';
import { EmailSenderService } from 'libs/helper-service/src/services/email-sender.service';
import { reset_password_html_content } from '../../templates/auth/reset_password_email_template';
import { forgot_password_html_content } from '../../templates/auth/forgot_password_email_template';
import { update_account_email_html_content } from '../../templates/auth/update_account_email_template';
import { welcome_customer_email_html_content } from '../../templates/auth/welcome_buyer_email_template';
import { email_verification_html_content } from '../../templates/auth/email_verification_email_template';
import { invite_business_member_email_html_content } from '../../templates/auth/invite_business_member_email_template';
import { Business } from '@app/common/src/models/business.model';
import { update_business_email_html_content } from '../../templates/auth/update_business_email_template';

@Injectable()
export class AuthEmailNotificationService implements OnModuleInit {
  private adminSettings: Setting;

  onModuleInit() {
    this.initializeAdminSettings();
  }

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

  async inviteBusinessMemberEmailNotification(account: Account) {
    const htmlContent = await invite_business_member_email_html_content({
      businessName: account.business.name,
      activationLink: this.configService
        .get<string>('WEB_APP_URL')
        .concat(`/invitations?invitationHash=${account.invitationHash}`),
    });

    if (
      this.adminSettings.isSMTPEnabled === true &&
      this.adminSettings.isKibaMailEnabled === false
    ) {
      return await this.gmailMailerService.sendMail({
        html: htmlContent,
        to: account.email,
        subject: `Invitation To Join ${account.business.name}`,
        from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
      });
    } else if (
      this.adminSettings.isKibaMailEnabled === true &&
      this.adminSettings.isSMTPEnabled === false
    ) {
      return this.emailSenderService.sendEmailViaKibaAdmin({
        html: htmlContent,
        to_email: account.email,
        sub: `Invitation To Join ${account.business.name}`,
      });
    }
  }

  async verifyNewAccountEmailNotification(account: Account) {
    const htmlContent = await update_account_email_html_content(
      account.name,
      account.activationCode,
    );

    if (
      this.adminSettings.isSMTPEnabled === true &&
      this.adminSettings.isKibaMailEnabled === false
    ) {
      return await this.gmailMailerService.sendMail({
        html: htmlContent,
        to: account.email,
        subject: 'Verify New Account Email',
        from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
      });
    } else if (
      this.adminSettings.isKibaMailEnabled === true &&
      this.adminSettings.isSMTPEnabled === false
    ) {
      return this.emailSenderService.sendEmailViaKibaAdmin({
        html: htmlContent,
        to_email: account.email,
        sub: 'Verify New Account Email',
      });
    }
  }

  async verifyNewBusinessEmailNotification(account: Business) {
    const htmlContent = await update_business_email_html_content(
      account.name,
      account.activationCode,
    );

    if (
      this.adminSettings.isSMTPEnabled === true &&
      this.adminSettings.isKibaMailEnabled === false
    ) {
      return await this.gmailMailerService.sendMail({
        html: htmlContent,
        to: account.email,
        subject: 'Verify New Business Email',
        from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
      });
    } else if (
      this.adminSettings.isKibaMailEnabled === true &&
      this.adminSettings.isSMTPEnabled === false
    ) {
      return this.emailSenderService.sendEmailViaKibaAdmin({
        html: htmlContent,
        to_email: account.email,
        sub: 'Verify New Business Email',
      });
    }
  }

  async resetPasswordNotification(account: Account) {
    const htmlContent = await reset_password_html_content();

    if (
      this.adminSettings.isSMTPEnabled === true &&
      this.adminSettings.isKibaMailEnabled === false
    ) {
      return await this.gmailMailerService.sendMail({
        html: htmlContent,
        to: account.email,
        subject: 'Password Reset',
        from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
      });
    } else if (
      this.adminSettings.isKibaMailEnabled === true &&
      this.adminSettings.isSMTPEnabled === false
    ) {
      return this.emailSenderService.sendEmailViaKibaAdmin({
        html: htmlContent,
        sub: 'Password Reset',
        to_email: account.email,
      });
    }
  }

  async forgotPasswordNotification(account: Account) {
    const htmlContent = await forgot_password_html_content(
      account.passwordResetCode,
    );

    if (
      this.adminSettings.isSMTPEnabled === true &&
      this.adminSettings.isKibaMailEnabled === false
    ) {
      return await this.gmailMailerService.sendMail({
        html: htmlContent,
        to: account.email,
        subject: 'Reset Your Password',
        from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
      });
    } else if (
      this.adminSettings.isKibaMailEnabled === true &&
      this.adminSettings.isSMTPEnabled === false
    ) {
      return await this.emailSenderService.sendEmailViaKibaAdmin({
        html: htmlContent,
        to_email: account.email,
        sub: 'Reset Your Password',
      });
    }
    // else {
    //   return this.emailSenderService.sendEmail({
    //     html: htmlContent,
    //     sub: 'Reset Your Password',
    //     to_email: account.email,
    //   });
    // }
  }

  async newAccountNotifications(account: Account) {
    switch (account.role) {
      case AccountRole.ADMIN:
        if (account.status === AccountStatus.ACTIVE) {
          const htmlContent = await welcome_customer_email_html_content(
            account.name,
          );

          if (
            this.adminSettings.isSMTPEnabled === true &&
            this.adminSettings.isKibaMailEnabled === false
          ) {
            return await this.gmailMailerService.sendMail({
              html: htmlContent,
              to: account.email,
              subject: 'Welcome to Invia!',
              from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
            });
          } else if (
            this.adminSettings.isKibaMailEnabled === true &&
            this.adminSettings.isSMTPEnabled === false
          ) {
            return this.emailSenderService.sendEmailViaKibaAdmin({
              html: htmlContent,
              sub: 'Welcome to Invia!',
              to_email: account.email,
            });
          }
        } else if (account.status === AccountStatus.PENDING) {
          const htmlContent = await email_verification_html_content(
            account.name,
            account.activationCode,
          );

          if (
            this.adminSettings.isSMTPEnabled === true &&
            this.adminSettings.isKibaMailEnabled === false
          ) {
            return await this.gmailMailerService.sendMail({
              html: htmlContent,
              to: account.email,
              subject: 'Email Verification',
              from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
            });
          } else if (
            this.adminSettings.isKibaMailEnabled === true &&
            this.adminSettings.isSMTPEnabled === false
          ) {
            return this.emailSenderService.sendEmailViaKibaAdmin({
              html: htmlContent,
              sub: 'Email Verification',
              to_email: account.email,
            });
          }
        }
      default:
        return;
    }
  }
}
