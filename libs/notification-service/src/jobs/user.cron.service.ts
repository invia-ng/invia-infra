import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import FCMessaging from '../bases/FCMessaging';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '@app/common/src/logger/logger.service';
import { Account } from '@app/common/src/models/account.model';

@Injectable()
export class UserCronService {
  constructor(
    @InjectRepository(Account)
    private userRepository: Repository<Account>,
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  // !DAILY -> COMMUNITY FEATURE MESSAGE
  // @Cron('*/10 * * * * *', { timeZone: 'Africa/Lagos' })
  @Cron('45 6 * * *', { timeZone: 'Africa/Lagos' })
  handleMorningJob() {
  }
}
