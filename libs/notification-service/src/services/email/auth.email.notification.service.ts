import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Setting } from '@app/common/src/models/setting.model';
import { Account } from 'libs/common/src/models/account.model';
import { Business } from '@app/common/src/models/business.model';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AppLogger } from '../../../../common/src/logger/logger.service';
import { AccountStatus, AccountRole } from 'libs/common/src/constants/enums';
import { EmailSenderService } from 'libs/helper-service/src/services/email-sender.service';
import { reset_password_html_content } from '../../templates/auth/reset_password_email_template';
import { forgot_password_html_content } from '../../templates/auth/forgot_password_email_template';
import { update_account_email_html_content } from '../../templates/auth/update_account_email_template';
import { welcome_customer_email_html_content } from '../../templates/auth/welcome_buyer_email_template';
import { update_business_email_html_content } from '../../templates/auth/update_business_email_template';
import { email_verification_html_content } from '../../templates/auth/email_verification_email_template';
import { invite_business_member_email_html_content } from '../../templates/auth/invite_business_member_email_template';

@Injectable()
export class AuthEmailNotificationService {
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

  async inviteBusinessMemberEmailNotification(payload: { account: Account, business: Business }) {
    await this.initializeAdminSettings();

    try {
      this.logger.log(`[INVITE-BUSINESS-MEMBER-EMAIL-NOTIFICATION-PROCESSING]`);


      const htmlContent = await invite_business_member_email_html_content({
        businessName: payload.business.name,
        activationLink: this.configService
          .get<string>('WEB_APP_URL')
          .concat(`/invitations?invitationHash=${payload.account.invitationHash}`),
      });

      if (
        this.adminSettings.isSMTPEnabled === true &&
        this.adminSettings.isKibaMailEnabled === false
      ) {
        return await this.gmailMailerService.sendMail({
          html: htmlContent,
          to: payload.account.email,
          subject: `Invitation To Join ${payload.business.name}`,
          from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
        });
      } else if (
        this.adminSettings.isKibaMailEnabled === true &&
        this.adminSettings.isSMTPEnabled === false
      ) {
        return this.emailSenderService.sendEmailViaKibaAdmin({
          html: htmlContent,
          to_email: payload.account.email,
          sub: `Invitation To Join ${payload.business.name}`,
        });
      }

      this.logger.log(`[INVITE-BUSINESS-MEMBER-EMAIL-NOTIFICATION-SUCCESS]`);

      return true;
    } catch (error) {
      this.logger.log(`[INVITE-BUSINESS-MEMBER-EMAIL-NOTIFICATION-ERROR]: ${error}`);
      return false;
    }
  }

  async verifyNewAccountEmailNotification(account: Account) {
    await this.initializeAdminSettings();

    try {
      this.logger.log(`[VERIFY-NEW-ACCOUNT-EMAIL-NOTIFICATION-PROCESSING]`);


      const htmlContent = await update_account_email_html_content({
        name: account.name,
        activationCode: account.activationCode,
        resetPasswordLink: this.configService
          .get<string>('WEB_APP_URL')
          .concat(`/auth/update-email?hash=${account.emailVerificationHash}`)
      });

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

      this.logger.log(`[VERIFY-NEW-ACCOUNT-EMAIL-NOTIFICATION-SUCCESS]`);

      return true;
    } catch (error) {
      this.logger.log(`[VERIFY-NEW-ACCOUNT-EMAIL-NOTIFICATION-ERROR]: ${error}`);

      return false;
    }
  }

  async verifyNewBusinessEmailNotification(account: Business) {
    await this.initializeAdminSettings();

    try {
      this.logger.log(`[VERIFY-NEW-BUSINESS-EMAIL-NOTIFICATION-PROCESSING]`);

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

      this.logger.log(`[VERIFY-NEW-BUSINESS-EMAIL-NOTIFICATION-SUCCESS]`);

      return true;
    } catch (error) {
      this.logger.log(`[VERIFY-NEW-BUSINESS-EMAIL-NOTIFICATION-ERROR]: ${error}`);

      return false;
    }
  }

  async resetPasswordNotification(account: Account) {
    await this.initializeAdminSettings();

    try {
      this.logger.log(`[RESET-PASSWORD-NOTIFICATION-PROCESSING]`);

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

      this.logger.log(`[RESET-PASSWORD-NOTIFICATION-SUCCESS]`);

      return true;
    } catch (error) {
      this.logger.log(`[RESET-PASSWORD-NOTIFICATION-ERROR]: ${error}`);

      return false;
    }
  }

  async forgotPasswordNotification(account: Account) {
    await this.initializeAdminSettings();

    try {
      this.logger.log(`[FORGOT-PASSWORD-NOTIFICATION-PROCESSING]`);

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

      this.logger.log(`[FORGOT-PASSWORD-NOTIFICATION-SUCCESS]`);

      return true;
    } catch (error) {
      this.logger.log(`[FORGOT-PASSWORD-NOTIFICATION-ERROR]: ${error}`);

      return false;
    }
  }

  async newAccountNotifications(account: Account) {
    await this.initializeAdminSettings();

    try {
      this.logger.log(`[NEW-ACCOUNT-NOTIFICATIONS-PROCESSING]`);

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
    } catch (error) {
      this.logger.log(`[NEW-ACCOUNT-NOTIFICATIONS-ERROR]: ${error}`);

      return false;
    }
  }
}
