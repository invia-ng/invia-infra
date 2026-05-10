import { Repository } from 'typeorm';
import {
  Invitation,
  FollowupInvitation,
} from '@app/common/src/models/invitation.model';
import { InviteEventGuestCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '@app/common/src/models/event.model';
import { InviteEventGuestEvent } from '../../events/impl';
import { Guest } from '@app/common/src/models/guest.model';
import authUtils from '@app/common/src/security/auth.utils';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { FollowupIntervalEnum } from '@app/common/src/constants/enums';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { MessageTemplateParser } from '../../middlewares/messsage.template.parser';

@CommandHandler(InviteEventGuestCommand)
export class InviteEventGuestHandler implements ICommandHandler<InviteEventGuestCommand> {
  constructor(
    private readonly eventBus: EventBus,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(FollowupInvitation)
    private readonly followupInvitationRepository: Repository<FollowupInvitation>,
  ) { }

  async execute(command: InviteEventGuestCommand) {
    try {
      this.logger.log(`[INVITE-EVENT-GUESTS-HANDLER-PROCESSING]`);

      const { eventId, guestId, payload, secureUser } = command;

      const event = await this.eventRepository.findOne({
        where: {
          id: eventId,
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found.');
      }

      const guest = await this.guestRepository.findOne({
        where: {
          id: guestId,
        },
      });

      if (!guest) {
        return;
      }

      // const existingInvite = await this.invitationRepository.exists({
      //   where: {
      //     event: {
      //       id: event.id,
      //     },
      //     guest: {
      //       id: guest.id,
      //     },
      //   },
      // });

      // if (existingInvite) {
      //   throw new BadRequestException(
      //     `Your guest ${guest.name} has already been invited!`,
      //   );
      // }

      const hash = authUtils.generateEventInvitationHash({
        eventId: event.id,
        guestId: guest.id,
        eventHash: event.hash,
      });

      const instance = this.invitationRepository.create({
        event,
        guest,
        hash,
        image: payload?.image,
        isEmailInviteDelivered: true,
        isWhatsAppInviteDelivered: true,
        sendEmailInvite: payload.sendEmailInvite,
        sendWhatsAppInvite: payload.sendWhatsAppInvite,
        message: MessageTemplateParser(payload.message, event, guest),
      });

      const invitation = await this.invitationRepository.save(instance);

      if (
        payload.followupInvitations &&
        payload.followupInvitations.length > 0
      ) {
        await Promise.all(
          payload.followupInvitations.map(async (followupInvitation) => {
            try {
              this.logger.log('[FOLLOWUP-INVITATION-HANDLER-PROCESSING]');

              const _instance = this.followupInvitationRepository.create({
                invitation,
                interval: followupInvitation.interval,
                condition: followupInvitation.condition,
                dateTime: this.calculateFollowupDate(
                  followupInvitation.interval,
                ),
                message: MessageTemplateParser(
                  followupInvitation.message,
                  event,
                  guest,
                ),
              });

              await this.followupInvitationRepository.save(_instance);

              this.logger.log('[FOLLOWUP-INVITATION-HANDLER-SUCCESS]');
            } catch (error) {
              this.logger.log(
                `[FOLLOWUP-INVITATION-HANDLER-ERROR] :: ${error}`,
              );
            }
          }),
        );
      }

      this.logger.log(`[INVITE-EVENT-GUESTS-HANDLER-SUCCESS]`);

      this.eventBus.publish(new InviteEventGuestEvent(invitation, secureUser));

      return;
    } catch (error) {
      this.logger.log(`[INVITE-EVENT-GUESTS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }

  calculateFollowupDate = (interval: FollowupIntervalEnum) => {
    const date = new Date();
    switch (interval) {
      case FollowupIntervalEnum.ONE_DAY:
        date.setDate(date.getDate() + 1);
        break;
      case FollowupIntervalEnum.TWO_DAYS:
        date.setDate(date.getDate() + 2);
        break;
      case FollowupIntervalEnum.THREE_DAYS:
        date.setDate(date.getDate() + 3);
        break;
      case FollowupIntervalEnum.FOUR_DAYS:
        date.setDate(date.getDate() + 4);
        break;
      case FollowupIntervalEnum.FIVE_DAYS:
        date.setDate(date.getDate() + 5);
        break;
      case FollowupIntervalEnum.SIX_DAYS:
        date.setDate(date.getDate() + 6);
        break;
      case FollowupIntervalEnum.SEVEN_DAYS:
        date.setDate(date.getDate() + 7);
        break;
      case FollowupIntervalEnum.EIGHT_DAYS:
        date.setDate(date.getDate() + 8);
        break;
      case FollowupIntervalEnum.NINE_DAYS:
        date.setDate(date.getDate() + 9);
        break;
      case FollowupIntervalEnum.TEN_DAYS:
        date.setDate(date.getDate() + 10);
        break;
      default:
        date.setDate(date.getDate() + 1);
        break;
    }
    return date;
  };
}
