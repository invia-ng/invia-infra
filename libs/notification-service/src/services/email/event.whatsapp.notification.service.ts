import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import {
  Invitation,
  FollowupInvitation,
} from '@app/common/src/models/invitation.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Setting } from '@app/common/src/models/setting.model';
import { AppLogger } from '../../../../common/src/logger/logger.service';
import { MetaApiService } from '@app/helper-service/src/services/meta-api.service';

@Injectable()
export class EventWhatsAppNotificationService {
  private adminSettings: Setting;

  constructor(
    public commandBus: CommandBus,
    private configService: ConfigService,
    private metaApiService: MetaApiService,
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

  async inviteEventGuestWhatsappNotification(
    invitation: Invitation,
  ): Promise<boolean> {
    try {
      this.logger.log(`[INVITE-EVENT-GUEST-WHATSAPP-NOTIFICATION-PROCESSING]`);

      await this.metaApiService.sendWhatsAppMessage({
        message: invitation.message,
        to_phone: invitation.guest.phone,
        guest_name: invitation.guest.name,
        event_name: invitation.event.name,
        open_link: `/invitation?invitationHash=${invitation.hash}`,
        image_url: invitation.image.length > 0 ? invitation.image : 'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767585910/invite-mail_feajcp.png',
      });

      this.logger.log(`[INVITE-EVENT-GUEST-WHATSAPP-NOTIFICATION-SUCCESS]`);

      return true;
    } catch (error) {
      this.logger.log(
        `[INVITE-EVENT-GUEST-WHATSAPP-NOTIFICATION-ERROR]: ${error}`,
      );

      return false;
    }
  }

  async inviteFollowupEventGuestWhatsappNotification(
    followupInvitation: FollowupInvitation,
  ): Promise<boolean> {
    try {
      this.logger.log(
        `[FOLLOWUP-INVITE-EVENT-GUEST-WHATS-APP-NOTIFICATION-PROCESSING]`,
      );

      await this.initializeAdminSettings();

      await this.metaApiService.sendWhatsAppMessage({
        to_phone: followupInvitation.invitation.guest.phone,
        guest_name: followupInvitation.invitation.guest.name,
        event_name: followupInvitation.invitation.event.name,
        // webappUrl: this.configService.get<string>('WEB_APP_URL'),
        // businessName: followupInvitation.invitation.event.business.name,
        // openLink: this.configService
        //   .get<string>('WEB_APP_URL')
        //   .concat(
        //     `/invitation/follow-up?invitationHash=${followupInvitation.invitation.hash}`,
        //   ),
        // message: `Hi ${followupInvitation.invitation.guest.name}, you’ve received a new message.`,
        image_url: followupInvitation.invitation.image.length > 0 ? followupInvitation.invitation.image : 'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767585910/invite-mail_feajcp.png',
      });

      this.logger.log(
        `[FOLLOWUP-INVITE-EVENT-GUEST-WHATS-APP-NOTIFICATION-SUCCESS]`,
      );

      return true;
    } catch (error) {
      this.logger.log(
        `[FOLLOWUP-INVITE-EVENT-GUEST-WHATS-APP-NOTIFICATION-ERROR]: ${error}`,
      );

      return false;
    }
  }
}
