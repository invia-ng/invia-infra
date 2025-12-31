import {
  Inject,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Raw, Repository } from 'typeorm';
import { CreateEventCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Business } from '@app/common/src/models/business.model';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { Event, EventInfo } from '@app/common/src/models/event.model';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { createHash } from 'crypto';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler
  implements ICommandHandler<CreateEventCommand, EventInfo>
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async execute(command: CreateEventCommand) {
    try {
      this.logger.log(`[CREATE-EVENT-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

			const business = await this.businessRepository.findOne({
				where: [
					{
						members: Raw((alias) => `${alias} ~ :regex`, {
							regex: `(?:^|\\D)${secureUser.id}(?:\\D|$)`,
						}),
					},
					{
						account: {
							id: secureUser.id,
						},
					},
				],
			});

      if (!business) {
        throw new UnauthorizedException('Business not found.');
      }

			const hash = createHash('sha256')
				.update(JSON.stringify(new Date()))
				.digest('hex');

			const instance = this.eventRepository.create({
				hash,
				business,
				name: payload.name,
				date: payload.date,
				time: payload.time,
				location: payload.location,
				category: payload.category,
			})

      const event = await this.eventRepository.save(instance);

      this.logger.log(`[CREATE-EVENT-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatEventInfo(event, 0, 0, 0, 0, 0);
    } catch (error) {
      this.logger.log(`[CREATE-EVENT-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
