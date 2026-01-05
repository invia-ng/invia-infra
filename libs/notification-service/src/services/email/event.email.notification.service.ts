import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Setting } from '@app/common/src/models/setting.model';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AppLogger } from '../../../../common/src/logger/logger.service';
import { FollowupInvitation, Invitation } from '@app/common/src/models/invitation.model';
import { EmailSenderService } from 'libs/helper-service/src/services/email-sender.service';
import { invite_event_guest_email_html_content } from '../../templates/emails/event/invite_event_guest_email_template';

@Injectable()
export class EventEmailNotificationService implements OnModuleInit  {
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
  ) {}

  async initializeAdminSettings() {
    this.adminSettings = await this.settingRepository.findOne({
      where: {
        position: 1,
      },
    });
  }

  async inviteEventGuestEmailNotification(invitation: Invitation): Promise<boolean> {
    try {
      this.logger.log(`[INVITE-EVENT-GUEST-EMAIL-NOTIFICATION-PROCESSING]`);

      const htmlContent = await invite_event_guest_email_html_content({
        event: invitation.event.name,
        message: invitation.message,
        hasCoverImage: invitation.image.length > 0,
        acceptLink: this.configService.get<string>('WEB_APP_URL').concat(`/invitations?invitationHash=${invitation.hash}&acceptInvite=true`),
        rejectLink: this.configService.get<string>('WEB_APP_URL').concat(`/invitations?invitationHash=${invitation.hash}&acceptInvite=false`),
        image: invitation.image.length > 0 ? invitation.image : 'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767585910/invite-mail_feajcp.png',
      });

      if(this.adminSettings.isSMTPEnabled === true) {
        await this.gmailMailerService.sendMail({
          html: htmlContent,
          to: invitation.guest.email,
          subject: 'You Are Invited!',
          from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
        }); 
      } else {
        this.emailSenderService.sendEmail({
          html: htmlContent,
          sub: 'You Are Invited!',
          to_email: invitation.guest.email,
        });
      }

      this.logger.log(`[INVITE-EVENT-GUEST-EMAIL-NOTIFICATION-SUCCESS]`);
      
      return true;
    } catch(error) {
      this.logger.log(`[INVITE-EVENT-GUEST-EMAIL-NOTIFICATION-ERROR]: ${error}`);

      return false;
    }
  }

  async inviteFollowupEventGuestEmailNotification(followupInvitation: FollowupInvitation): Promise<boolean> {
    try {
      this.logger.log(`[FOLLOWUP-INVITE-EVENT-GUEST-EMAIL-NOTIFICATION-PROCESSING]`);

      const htmlContent = await invite_event_guest_email_html_content({
        hasCoverImage: followupInvitation.invitation.image.length > 0,
        message: followupInvitation.message,
        event: followupInvitation.invitation.event.name,
        acceptLink: this.configService.get<string>('WEB_APP_URL').concat(`/invitations?invitationHash=${followupInvitation.invitation.hash}&acceptInvite=true`),
        rejectLink: this.configService.get<string>('WEB_APP_URL').concat(`/invitations?invitationHash=${followupInvitation.invitation.hash}&acceptInvite=false`),
        image: followupInvitation.invitation.image.length > 0 ? followupInvitation.invitation.image : 'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767585910/invite-mail_feajcp.png',
      });

      if(this.adminSettings.isSMTPEnabled === true) {
        await this.gmailMailerService.sendMail({
          html: htmlContent,
          to: followupInvitation.invitation.guest.email,
          subject: 'You Are Invited!',
          from: `"Invia" <${this.configService.get<string>('GMAIL_SMTP_EMAIL')}>`,
        }); 
      } else {
        this.emailSenderService.sendEmail({
          html: htmlContent,
          sub: 'You Are Invited!',
          to_email: followupInvitation.invitation.guest.email,
        });
      }

      this.logger.log(`[FOLLOWUP-INVITE-EVENT-GUEST-EMAIL-NOTIFICATION-SUCCESS]`);
      
      return true;
    } catch(error) {
      this.logger.log(`[FOLLOWUP-INVITE-EVENT-GUEST-EMAIL-NOTIFICATION-ERROR]: ${error}`);

      return false;
    }
  }
}
