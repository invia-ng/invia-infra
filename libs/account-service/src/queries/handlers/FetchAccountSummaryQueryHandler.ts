import { In, Repository } from 'typeorm';
import { FetchAccountSummaryQuery } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Event } from '@app/common/src/models/event.model';
import { Guest } from '@app/common/src/models/guest.model';
import { AccountSummaryInfo } from '../../interface/schema';
import { Account } from '@app/common/src/models/account.model';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Invitation } from '@app/common/src/models/invitation.model';
import { MessageTemplate } from '@app/common/src/models/message.template.model';

@QueryHandler(FetchAccountSummaryQuery)
export class FetchAccountSummaryQueryHandler implements IQueryHandler<
  FetchAccountSummaryQuery,
  AccountSummaryInfo
> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(MessageTemplate)
    private readonly messageTemplateRepository: Repository<MessageTemplate>,
  ) { }

  async execute(query: FetchAccountSummaryQuery) {
    try {
      this.logger.log('[FETCH-ACCOUNT-SUMMARY-PROCESSING]');

      const { secureUser } = query;

      const business = await this.businessRepository.findOne({
        where: [
          {
            members: {
              id: secureUser.id,
            },
          },
          {
            account: {
              id: secureUser.id,
            },
          },
        ],
      });

      if (!business) {
        throw new NotFoundException(`Business record not found for user`);
      }

      const members = await this.accountRepository.count({
        where: {
          id: In(business.members.map((member) => member.id)),
        },
      });

      const events = await this.eventRepository.count({
        where: {
          business: {
            id: business.id,
          },
        },
      });

      const guests = await this.guestRepository.count({
        where: {
          event: {
            business: {
              id: business.id,
            },
          },
        },
      });

      const invitations = await this.invitationRepository.count({
        where: {
          event: {
            business: {
              id: business.id,
            },
          },
        },
      });

      const messageTemplates = await this.messageTemplateRepository.count({
        where: {
          business: {
            id: business.id,
          },
        },
      });

      this.logger.log('[FETCH-ACCOUNT-SUMMARY-SUCCESS]');

      return {
        members,
        events,
        guests,
        invitations,
        messageTemplates,
      };
    } catch (error) {
      this.logger.log(`[FETCH-ACCOUNT-SUMMARY-HANDLER]: ${error}`);
      throw error;
    }
  }
}
