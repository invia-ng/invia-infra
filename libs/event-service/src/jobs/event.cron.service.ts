import { Cron } from '@nestjs/schedule';
import { Equal, Repository } from 'typeorm';
import {
  Invitation,
  FollowupInvitation,
} from '@app/common/src/models/invitation.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '@app/common/src/logger/logger.service';
import { GuestTimeline } from '@app/common/src/models/guest.model';
import {
  FollowupConditionEnum,
  GuestTimelineActionEnum,
} from '@app/common/src/constants/enums';
import { EventEmailNotificationService } from '@app/notification-service/src/services/email/event.email.notification.service';

@Injectable()
export class EventCronService {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(GuestTimeline)
    private readonly guestTimelineRepository: Repository<GuestTimeline>,
    @InjectRepository(FollowupInvitation)
    private readonly followupInvitationRepository: Repository<FollowupInvitation>,
    private readonly eventEmailNotificationService: EventEmailNotificationService,
  ) {}

  // !DAILY -> PROCESS FOLLOWUP INVITATIONS
  // @Cron('*/10 * * * * *', { timeZone: 'Africa/Lagos' })
  @Cron('0 13 * * *', { timeZone: 'Africa/Lagos' })
  async processFollowupInvitationsCronNotification() {
    try {
      this.logger.log(`[PROCESS-FOLLOWUP-INVITATIONS-CRONJOB-PROCESSING]`);

      const followupInvitations = await this.followupInvitationRepository.find({
        where: {
          dateTime: Equal(new Date()),
        },
      });

      await Promise.all(
        followupInvitations.map(async (followupInvitation) => {
          try {
            this.logger.log(`[PROCESS-FOLLOWUP-INVITATION-CRONJOB-PROCESSING]`);

            if (
              followupInvitation.condition === FollowupConditionEnum.RSVP &&
              followupInvitation.invitation.isRSVP === true
            ) {
              const emailResponse =
                await this.eventEmailNotificationService.inviteFollowupEventGuestEmailNotification(
                  followupInvitation,
                );

              await this.guestTimelineRepository.save({
                guest: followupInvitation.invitation.guest,
                description: `Followup(RSVP) invitation sent.`,
                action: GuestTimelineActionEnum.SENT_INVITE_MESSAGE,
              });

              if (emailResponse) {
                Object.assign(followupInvitation, {
                  isSent: true,
                  isDelivered: true,
                });

                await this.followupInvitationRepository.save(
                  followupInvitation,
                );

                await this.guestTimelineRepository.save({
                  guest: followupInvitation.invitation.guest,
                  description: `Followup invitation email delivered.`,
                  action: GuestTimelineActionEnum.EMAIL_DELIVERED,
                });
              } else {
                await this.guestTimelineRepository.save({
                  guest: followupInvitation.invitation.guest,
                  action: GuestTimelineActionEnum.EMAIL_DELIVERY_FAILED,
                  description: `Followup invitation email failed to deliver.`,
                });
              }
            } else if (
              followupInvitation.condition === FollowupConditionEnum.NO_RSVP &&
              followupInvitation.invitation.isRSVP === false
            ) {
              const emailResponse =
                await this.eventEmailNotificationService.inviteFollowupEventGuestEmailNotification(
                  followupInvitation,
                );

              await this.guestTimelineRepository.save({
                guest: followupInvitation.invitation.guest,
                description: `Followup(NO RSVP) invitation sent.`,
                action: GuestTimelineActionEnum.SENT_INVITE_MESSAGE,
              });

              if (emailResponse) {
                Object.assign(followupInvitation, {
                  isSent: true,
                  isDelivered: true,
                });

                await this.followupInvitationRepository.save(
                  followupInvitation,
                );

                Object.assign(followupInvitation.invitation, {
                  isSent: true,
                  isDelivered: true,
                });

                await this.invitationRepository.save(
                  followupInvitation.invitation,
                );

                await this.guestTimelineRepository.save({
                  guest: followupInvitation.invitation.guest,
                  description: `Followup(NO RSVP) invitation email delivered.`,
                  action: GuestTimelineActionEnum.EMAIL_DELIVERED,
                });
              } else {
                await this.guestTimelineRepository.save({
                  guest: followupInvitation.invitation.guest,
                  action: GuestTimelineActionEnum.EMAIL_DELIVERY_FAILED,
                  description: `Followup(NO RSVP) invitation email failed to deliver.`,
                });
              }
            }

            this.logger.log(`[PROCESS-FOLLOWUP-INVITATION-CRONJOB-SUCCESS]`);
          } catch (error) {
            this.logger.error(
              `[PROCESS-FOLLOWUP-INVITATION-CRONJOB-ERROR] :: ${error}`,
            );
          }
        }),
      );

      this.logger.log(`[PROCESS-FOLLOWUP-INVITATIONS-CRONJOB-SUCCESS]`);
    } catch (error) {
      this.logger.error(
        `[PROCESS-FOLLOWUP-INVITATIONS-CRONJOB-ERROR] :: ${error}`,
      );
    }
  }
}
