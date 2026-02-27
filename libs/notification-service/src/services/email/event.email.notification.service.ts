import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import {
  Invitation,
  FollowupInvitation,
} from '@app/common/src/models/invitation.model';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Event } from '@app/common/src/models/event.model';
import { Setting } from '@app/common/src/models/setting.model';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AppLogger } from '../../../../common/src/logger/logger.service';
import { EmailSenderService } from 'libs/helper-service/src/services/email-sender.service';
import { invite_event_guest_email_html_content } from '../../templates/event/invite_event_guest_email_template';
import { share_event_guest_form_email_html_content } from '../../templates/event/share_event_guest_form_email_template';
import { event_guest_accept_reject_invitation_email_html_content } from '../../templates/event/event_guest_accept_reject_invitation_email_template';
import { event_admin_guest_accept_reject_invitation_email_html_content } from '../../templates/event/event_admin_guest_accept_reject_invitation_email_template';

@Injectable()
export class EventEmailNotificationService {
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

  async sendEventShareFormPasscodeEmailNotification(payload: {
    event: Event,
    guestEmail: string
  }): Promise<boolean> {
    try {
      this.logger.log(`[SEND-EVENT-SHARE-FORM-PASSCODE-EMAIL-NOTIFICATION-PROCESSING]`);

      await this.initializeAdminSettings();

      const htmlContent = await share_event_guest_form_email_html_content({
        passcode: payload.event.passcode,
        shareFormLink: this.configService.get<string>('WEB_APP_URL').concat(`/events/shareform/authenticate?hash=${payload.event.hash}`),
      });

      if (
        this.adminSettings.isSMTPEnabled === true &&
        this.adminSettings.isKibaMailEnabled === false
      ) {
        await this.gmailMailerService.sendMail({
          html: htmlContent,
          to: payload.guestEmail,
          subject: `Event Share Form Access: ${payload.event.name}`,
          from: `"${payload.event.business.name}" <${payload.event.business.sendFromEmail}>`,
        });
      } else if (
        this.adminSettings.isKibaMailEnabled === true &&
        this.adminSettings.isSMTPEnabled === false
      ) {
        this.emailSenderService.sendEmailViaKibaAdmin({
          html: htmlContent,
          sub: `Event Share Form Access: ${payload.event.name}`,
          to_email: payload.guestEmail,
          from_email: payload.event.business.sendFromEmail,
          from_name: payload.event.business.name,
        });
      }

      this.logger.log(`[SEND-EVENT-SHARE-FORM-PASSCODE-EMAIL-NOTIFICATION-SUCCESS]`);

      return true;
    } catch (error) {
      this.logger.log(
        `[SEND-EVENT-SHARE-FORM-PASSCODE-EMAIL-NOTIFICATION-ERROR]: ${error}`,
      );

      return false;
    }
  }

  async inviteEventGuestEmailNotification(
    invitation: Invitation,
  ): Promise<boolean> {
    try {
      this.logger.log(`[INVITE-EVENT-GUEST-EMAIL-NOTIFICATION-PROCESSING]`);

      await this.initializeAdminSettings();

      const htmlContent = await invite_event_guest_email_html_content({
        message: invitation.message,
        event: invitation.event.name,
        hasCoverImage: invitation.image.length > 0,
        businessName: invitation.event.business.name,
        webappUrl: this.configService.get<string>('WEB_APP_URL'),
        acceptLink: this.configService
          .get<string>('WEB_APP_URL')
          .concat(
            `/invitations?invitationHash=${invitation.hash}&acceptInvite=true`,
          ),
        rejectLink: this.configService
          .get<string>('WEB_APP_URL')
          .concat(
            `/invitations?invitationHash=${invitation.hash}&acceptInvite=false`,
          ),
        image:
          invitation.image.length > 0
            ? invitation.image
            : 'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767585910/invite-mail_feajcp.png',
      });

      if (
        this.adminSettings.isSMTPEnabled === true &&
        this.adminSettings.isKibaMailEnabled === false
      ) {
        await this.gmailMailerService.sendMail({
          html: htmlContent,
          to: invitation.guest.email,
          subject: `Event Invitation: ${invitation.event.name}`,
          from: `"${invitation.event.business.name}" <${invitation.event.business.sendFromEmail}>`,
        });
      } else if (
        this.adminSettings.isKibaMailEnabled === true &&
        this.adminSettings.isSMTPEnabled === false
      ) {
        this.emailSenderService.sendEmailViaKibaAdmin({
          html: htmlContent,
          sub: `Event Invitation: ${invitation.event.name}`,
          to_email: invitation.guest.email,
          from_email: invitation.event.business.sendFromEmail,
          from_name: invitation.event.business.name,
        });
      }

      this.logger.log(`[INVITE-EVENT-GUEST-EMAIL-NOTIFICATION-SUCCESS]`);

      return true;
    } catch (error) {
      this.logger.log(
        `[INVITE-EVENT-GUEST-EMAIL-NOTIFICATION-ERROR]: ${error}`,
      );

      return false;
    }
  }

  async inviteFollowupEventGuestEmailNotification(
    followupInvitation: FollowupInvitation,
  ): Promise<boolean> {
    try {
      this.logger.log(
        `[FOLLOWUP-INVITE-EVENT-GUEST-EMAIL-NOTIFICATION-PROCESSING]`,
      );

      await this.initializeAdminSettings();

      const htmlContent = await invite_event_guest_email_html_content({
        hasCoverImage: followupInvitation.invitation.image.length > 0,
        message: followupInvitation.message,
        event: followupInvitation.invitation.event.name,
        webappUrl: this.configService.get<string>('WEB_APP_URL'),
        businessName: followupInvitation.invitation.event.business.name,
        acceptLink: this.configService
          .get<string>('WEB_APP_URL')
          .concat(
            `/invitations?invitationHash=${followupInvitation.invitation.hash}&acceptInvite=true`,
          ),
        rejectLink: this.configService
          .get<string>('WEB_APP_URL')
          .concat(
            `/invitations?invitationHash=${followupInvitation.invitation.hash}&acceptInvite=false`,
          ),
        image:
          followupInvitation.invitation.image.length > 0
            ? followupInvitation.invitation.image
            : 'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767585910/invite-mail_feajcp.png',
      });

      if (
        this.adminSettings.isSMTPEnabled === true &&
        this.adminSettings.isKibaMailEnabled === false
      ) {
        await this.gmailMailerService.sendMail({
          html: htmlContent,
          subject: `Event Invitation: ${followupInvitation.invitation.event.name}`,
          to: followupInvitation.invitation.guest.email,
          from: `"${followupInvitation.invitation.event.business.name}" <${followupInvitation.invitation.event.business.sendFromEmail}>`,
        });
      } else if (
        this.adminSettings.isKibaMailEnabled === true &&
        this.adminSettings.isSMTPEnabled === false
      ) {
        this.emailSenderService.sendEmailViaKibaAdmin({
          html: htmlContent,
          sub: `Event Invitation: ${followupInvitation.invitation.event.name}`,
          to_email: followupInvitation.invitation.guest.email,
          from_email: followupInvitation.invitation.event.business.sendFromEmail,
          from_name: followupInvitation.invitation.event.business.name,
        });
      }

      this.logger.log(
        `[FOLLOWUP-INVITE-EVENT-GUEST-EMAIL-NOTIFICATION-SUCCESS]`,
      );

      return true;
    } catch (error) {
      this.logger.log(
        `[FOLLOWUP-INVITE-EVENT-GUEST-EMAIL-NOTIFICATION-ERROR]: ${error}`,
      );

      return false;
    }
  }

  async eventGuestAcceptRejectInvitationEmailNotification(payload: {
    isAccept: boolean,
    invitation: Invitation,
  }): Promise<boolean> {
    try {
      this.logger.log(
        `[EVENT-GUEST-ACCEPT-REJECT-INVITATION-EMAIL-NOTIFICATION-PROCESSING]`,
      );

      await this.initializeAdminSettings();

      const htmlContent = await event_guest_accept_reject_invitation_email_html_content({
        hasCoverImage: payload.invitation.image.length > 0,
        message: payload.invitation.message,
        event: payload.invitation.event.name,
        webappUrl: this.configService.get<string>('WEB_APP_URL'),
        businessName: payload.invitation.event.business.name,
        isAccept: payload.isAccept,
        image:
          payload.invitation.image.length > 0
            ? payload.invitation.image
            : 'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767585910/invite-mail_feajcp.png',
      });

      const adminHtmlContent = await event_admin_guest_accept_reject_invitation_email_html_content({
        guestName: payload.invitation.guest.name,
        event: payload.invitation.event.name,
        webappUrl: this.configService.get<string>('WEB_APP_URL'),
        businessName: payload.invitation.event.business.name,
        isAccept: payload.isAccept,
        eventDashboardUrl: `${this.configService.get<string>('WEB_APP_URL')}/events/${payload.invitation.event.id}`,
      });

      if (
        this.adminSettings.isSMTPEnabled === true &&
        this.adminSettings.isKibaMailEnabled === false
      ) {
        await this.gmailMailerService.sendMail({
          html: htmlContent,
          subject: `Event Invitation ${payload.isAccept ? 'Accepted' : 'Rejected'}`,
          to: payload.invitation.guest.email,
          from: `"Invia" <no-reply@tryinvia.com>`,
        });

        await this.gmailMailerService.sendMail({
          html: adminHtmlContent,
          subject: `Event Invitation ${payload.isAccept ? 'Accepted' : 'Rejected'}`,
          to: payload.invitation.event.business.email,
          from: `"Invia" <no-reply@tryinvia.com>`,
        });
      } else if (
        this.adminSettings.isKibaMailEnabled === true &&
        this.adminSettings.isSMTPEnabled === false
      ) {
        await this.emailSenderService.sendEmailViaKibaAdmin({
          html: htmlContent,
          sub: `Event Invitation ${payload.isAccept ? 'Accepted' : 'Rejected'}: ${payload.invitation.event.name}`,
          to_email: payload.invitation.guest.email,
          from_email: 'no-reply@tryinvia.com',
          from_name: 'Invia',
        });

        await this.emailSenderService.sendEmailViaKibaAdmin({
          html: adminHtmlContent,
          sub: `Event Invitation ${payload.isAccept ? 'Accepted' : 'Rejected'}: ${payload.invitation.event.name}`,
          to_email: payload.invitation.event.business.email,
          from_email: 'no-reply@tryinvia.com',
          from_name: 'Invia',
        });
      }

      this.logger.log(
        `[EVENT-GUEST-ACCEPT-REJECT-INVITATION-EMAIL-NOTIFICATION-SUCCESS]`,
      );

      return true;
    } catch (error) {
      this.logger.log(
        `[EVENT-GUEST-ACCEPT-REJECT-INVITATION-EMAIL-NOTIFICATION-ERROR]: ${error}`,
      );

      return false;
    }
  }
}
