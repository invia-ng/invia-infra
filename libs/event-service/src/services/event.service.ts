import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '../../../common/src/logger/logger.service';
import { EventCategoryEnum } from '@app/common/src/constants/enums';

@Injectable()
export class EventService {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
  ) {}

  async fetchEventCategories(): Promise<string[]> {
    try{
      this.logger.log('[FETCH-EVENT-CATEGORIES-SERVICE-PROCESSING]');

      const categories = Object.values(EventCategoryEnum);

      this.logger.log('[FETCH-EVENT-CATEGORIES-SERVICE-SUCCESS]');

      return categories;
    }catch(error){
      this.logger.error('[FETCH-EVENT-CATEGORIES-SERVICE-ERROR]', error);

      throw error;
    }
  }
}
