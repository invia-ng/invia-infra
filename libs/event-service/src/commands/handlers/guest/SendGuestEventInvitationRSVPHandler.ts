import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEventGuestInvitationRSVPCommand } from '../../impl';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Invitation } from '@app/common/src/models/invitation.model';
import { EventEmailNotificationService } from '@app/notification-service/src/services/email/event.email.notification.service';

@CommandHandler(SendEventGuestInvitationRSVPCommand)
export class SendGuestEventInvitationRSVPHandler implements ICommandHandler<
  SendEventGuestInvitationRSVPCommand,
  boolean
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    private readonly eventEmailNotificationService: EventEmailNotificationService,
  ) { }

  async execute(command: SendEventGuestInvitationRSVPCommand) {
    try {
      this.logger.log(`[SEND-GUEST-EVENT-INVITATION-RSVP-HANDLER-PROCESSING]`);

      const { guestEmail, invitationHash } = command;

      const invitation = await this.invitationRepository.findOne({
        where: {
          hash: invitationHash,
        }
      });

      if (!invitation) {
        throw new NotFoundException('Invitation not found.');
      }

      this.logger.log(`[SEND-GUEST-EVENT-INVITATION-RSVP-HANDLER-SUCCESS]`);

      await this.eventEmailNotificationService.eventGuestInvitationRSVPEmailNotification(
        invitation,
      );

      return true;
    } catch (error) {
      this.logger.log(
        `[SEND-GUEST-EVENT-INVITATION-RSVP-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }
}
