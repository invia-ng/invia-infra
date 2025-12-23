import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '../logger/logger.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CommonService {
  constructor(
    @Inject('Logger') public logger: AppLogger,
    @Inject(CACHE_MANAGER) public cacheManager: Cache,
  ) {
  }
}
