import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessMetaWhatsappWebhookCommand } from '../impl';
import { Inject } from '@nestjs/common';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Invitation } from '@app/common/src/models/invitation.model';
import { EmailWhatsappMessageAttempt } from '@app/common/src/models/email.whatsapp.message.attempt.model';
import { EmailWhatsappMessageAttemptStatusEnum } from '@app/common/src/constants/enums';
import {
  getNextRetryAt,
  META_RETRY_DELAY_HOURS,
  META_RETRY_ERROR_CODE,
} from '@app/common/src/helpers/date-helper';

interface MetaWhatsappStatusError {
  code?: number;
  title?: string;
  message?: string;
  error_data?: {
    details?: string;
  };
}

interface MetaWhatsappStatus {
  id: string;
  status: string;
  timestamp: string;
  recipient_id: string;
  errors?: MetaWhatsappStatusError[];
}

interface MetaWhatsappWebhookPayload {
  entry?: Array<{
    changes?: Array<{
      value?: {
        statuses?: MetaWhatsappStatus[];
      };
    }>;
  }>;
}

export const WHATSAPP_CHANNEL = 'whatsapp';

@CommandHandler(ProcessMetaWhatsappWebhookCommand)
export class ProcessMetaWhatsappWebhookHandler implements ICommandHandler<
  ProcessMetaWhatsappWebhookCommand,
  void
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(EmailWhatsappMessageAttempt)
    private readonly emailWhatsappMessageAttemptRepository: Repository<EmailWhatsappMessageAttempt>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  async execute(query: ProcessMetaWhatsappWebhookCommand): Promise<void> {
    try {
      this.logger.log(`[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-PROCESSING]`);

      const { payload } = query;
      const status = this.extractStatus(payload);

      if (!status) {
        this.logger.log(
          '[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER]: No status in payload',
        );
        return;
      }

      if (!this.isSuccessOrFailed(status.status)) {
        this.logger.log(
          `[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER]: Skipping non-terminal status "${status.status}"`,
        );
        return;
      }

      console.log(
        '[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-PAYLOAD] :: ',
        payload,
      );

      const mappedStatus = this.mapMetaStatus(status.status);
      const statusAt = this.toDateFromMetaTimestamp(status.timestamp);
      const error = status.errors?.[0];
      const errorCode = error?.code?.toString() ?? '';
      const errorMessage =
        error?.message ?? error?.title ?? error?.error_data?.details ?? '';

      let attempt = await this.emailWhatsappMessageAttemptRepository.findOne({
        where: { wamid: status.id },
      });

      if (!attempt) {
        const invitation = await this.resolveInvitation(status.recipient_id);

        attempt = this.emailWhatsappMessageAttemptRepository.create({
          channel: WHATSAPP_CHANNEL,
          wamid: status.id,
          status: mappedStatus,
          errorCode,
          errorMessage,
          attemptNumber: 1,
          lastAttemptAt: statusAt,
          invitation: invitation ?? undefined,
        });
      } else {
        Object.assign(attempt, {
          status: mappedStatus,
          errorCode,
          errorMessage,
          lastAttemptAt: statusAt,
        });
      }

      if (mappedStatus === EmailWhatsappMessageAttemptStatusEnum.DELIVERED) {
        attempt.deliveredAt = statusAt;
        attempt.nextRetryAt = null;
        attempt.errorCode = '';
        attempt.errorMessage = '';
      }

      if (mappedStatus === EmailWhatsappMessageAttemptStatusEnum.FAILED) {
        attempt.deliveredAt = null;

        if (error?.code === META_RETRY_ERROR_CODE) {
          attempt.nextRetryAt = getNextRetryAt(statusAt);
        }
      }

      await this.emailWhatsappMessageAttemptRepository.save(attempt);

      if (attempt.invitation) {
        await this.syncInvitationDeliveryState(
          attempt.invitation.id,
          mappedStatus,
        );
      }

      this.logger.log(
        mappedStatus === EmailWhatsappMessageAttemptStatusEnum.FAILED
          ? `[PROCESS-META-WHATSAPP-WEBHOOK]: Failed wamid=${status.id} code=${errorCode}`
          : `[PROCESS-META-WHATSAPP-WEBHOOK]: Delivered wamid=${status.id}`,
      );

      this.logger.log(`[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-SUCCESS]`);
    } catch (error) {
      this.logger.log(
        `[PROCESS-META-WHATSAPP-WEBHOOK-HANDLER-ERROR] :: ${error}`,
      );

      throw error;
    }
  }

  private extractStatus(
    payload: MetaWhatsappWebhookPayload,
  ): MetaWhatsappStatus | null {
    const status = payload.entry?.[0]?.changes?.[0]?.value?.statuses?.[0];

    return status ?? null;
  }

  private isSuccessOrFailed(status: string): boolean {
    return ['delivered', 'read', 'failed'].includes(status);
  }

  private mapMetaStatus(status: string): EmailWhatsappMessageAttemptStatusEnum {
    switch (status) {
      case 'sent':
        return EmailWhatsappMessageAttemptStatusEnum.SENT;
      case 'delivered':
      case 'read':
        return EmailWhatsappMessageAttemptStatusEnum.DELIVERED;
      case 'failed':
        return EmailWhatsappMessageAttemptStatusEnum.FAILED;
      default:
        return EmailWhatsappMessageAttemptStatusEnum.PENDING;
    }
  }

  private toDateFromMetaTimestamp(timestamp: string): Date {
    const parsed = Number(timestamp);

    if (!Number.isFinite(parsed)) {
      return new Date();
    }

    return parsed > 1_000_000_000_000
      ? new Date(parsed)
      : new Date(parsed * 1000);
  }

  private async resolveInvitation(
    recipientId: string,
  ): Promise<Invitation | null> {
    const phoneVariants = [recipientId, `+${recipientId}`];

    const invitations = await this.invitationRepository.find({
      where: {
        sendWhatsAppInvite: true,
        guest: {
          phone: In(phoneVariants),
        },
      },
      relations: ['guest'],
      order: {
        createdAt: 'DESC',
      },
      take: 1,
    });

    return invitations[0] ?? null;
  }

  private async syncInvitationDeliveryState(
    invitationId: number,
    status: EmailWhatsappMessageAttemptStatusEnum,
  ): Promise<void> {
    if (status === EmailWhatsappMessageAttemptStatusEnum.DELIVERED) {
      await this.invitationRepository.update(invitationId, {
        isWhatsAppInviteSent: true,
        isWhatsAppInviteDelivered: true,
      });
      return;
    }

    if (status === EmailWhatsappMessageAttemptStatusEnum.FAILED) {
      await this.invitationRepository.update(invitationId, {
        isWhatsAppInviteSent: true,
        isWhatsAppInviteDelivered: false,
      });
    }
  }
}
