import { Cron } from '@nestjs/schedule';
import { Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '@app/common/src/logger/logger.service';
import { FollowupConditionEnum } from '@app/common/src/constants/enums';
import { FollowupInvitation, Invitation } from '@app/common/src/models/invitation.model';
import { EventEmailNotificationService } from '@app/notification-service/src/services/email/event.email.notification.service';

@Injectable()
export class EventCronService {
	constructor(
		@Inject('Logger') private readonly logger: AppLogger,
		@InjectRepository(Invitation)
		private readonly invitationRepository: Repository<Invitation>,
		@InjectRepository(FollowupInvitation)
		private readonly followupInvitationRepository: Repository<FollowupInvitation>,
		private readonly eventEmailNotificationService: EventEmailNotificationService,
	) {}

	// !DAILY -> PROCESS FOLLOWUP INVITATIONS
	// @Cron('*/10 * * * * *', { timeZone: 'Africa/Lagos' })
	@Cron('0 13 * * *', { timeZone: 'Africa/Lagos' })
	async processFollowupInvitationsCronNotification() {
		try {
			this.logger.log(
				`[PROCESS-FOLLOWUP-INVITATIONS-CRONJOB-PROCESSING]`,
			);

			const followupInvitations = await this.followupInvitationRepository.find({
				where: {
					dateTime: Equal(new Date()),
				},
			});

			await Promise.all(followupInvitations.map(async(followupInvitation) => {
				try {
					this.logger.log(`[PROCESS-FOLLOWUP-INVITATION-CRONJOB-PROCESSING]`);

					if(followupInvitation.condition === FollowupConditionEnum.RSVP && followupInvitation.invitation.isRSVP === true) {
						const emailResponse = await this.eventEmailNotificationService.inviteFollowupEventGuestEmailNotification(followupInvitation);	

						if(emailResponse) {
							Object.assign(followupInvitation, {
								isSent: true,
								isDelivered: true,
							});

							await this.followupInvitationRepository.save(followupInvitation);
						}
					}else if(followupInvitation.condition === FollowupConditionEnum.NO_RSVP && followupInvitation.invitation.isRSVP === false) {
						const emailResponse = await this.eventEmailNotificationService.inviteFollowupEventGuestEmailNotification(followupInvitation);	

						if(emailResponse) {
							Object.assign(followupInvitation, {
								isSent: true,
								isDelivered: true,
							});

							await this.followupInvitationRepository.save(followupInvitation);

							Object.assign(followupInvitation.invitation, {
								isSent: true,
								isDelivered: true,
							});

							await this.invitationRepository.save(followupInvitation.invitation);
						}
					}

					this.logger.log(`[PROCESS-FOLLOWUP-INVITATION-CRONJOB-SUCCESS]`);
				} catch (error) {
					this.logger.error(
						`[PROCESS-FOLLOWUP-INVITATION-CRONJOB-ERROR] :: ${error}`,
					);
				}
			}));

			this.logger.log(`[PROCESS-FOLLOWUP-INVITATIONS-CRONJOB-SUCCESS]`);
		} catch (error) {
			this.logger.error(
				`[PROCESS-FOLLOWUP-INVITATIONS-CRONJOB-ERROR] :: ${error}`,
			);
		}
	}
}
