import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { InviteEventGuestsEvent } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Invitation } from '@app/common/src/models/invitation.model';
import { EventEmailNotificationService } from '@app/notification-service/src/services/email/event.email.notification.service';

@EventsHandler(InviteEventGuestsEvent)
export class InviteEventGuestsEventHandler implements IEventHandler<InviteEventGuestsEvent> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
		private readonly eventEmailNotificationService: EventEmailNotificationService,
	) {}

  async handle(event: InviteEventGuestsEvent) {
    try {
      this.logger.log(
        `[INVITE-EVENT-GUEST-EVENT-PROCESSING]: ${JSON.stringify(event)}`,
      );

      const { invitations } = event;

      await Promise.all(invitations.map(async(invitation) => {
        try {
          this.logger.log('[INVITE-EVENT-GUEST-EVENT-MANAGER-PROCESSING]');

          if(invitation.sendEmailInvite) {
            //! SEND EMAIL INVITATION
            const emailResponse = await this.eventEmailNotificationService.inviteEventGuestEmailNotification(invitation);

            if(emailResponse) {
              Object.assign(invitation, {
                isSent: true,
                isDelivered: true,
              });

              await this.invitationRepository.save(invitation);
            }
          }

          if(invitation.sendWhatsAppInvite) {
            //! SEND WHATSAPP INVITATION
          }

          this.logger.log('[INVITE-EVENT-GUEST-EVENT-MANAGER-SUCCESS]');
        } catch(error) {
          this.logger.log(`[INVITE-EVENT-GUEST-EVENT-MANAGER-ERROR] :: ${error}`);
        }
      }));

      this.logger.log(`[INVITE-EVENT-GUEST-EVENT-SUCCESS]`);
    } catch (error) {
      this.logger.log(`[INVITE-EVENT-GUEST-EVENT-ERROR]: ${error}`);

      throw error;
    }
  }
}
