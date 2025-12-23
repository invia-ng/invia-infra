import { AppLogger } from './logger/logger.service';
import { CommonService } from './services/common.service';
import { forwardRef, Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    CommonService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
  ],
  exports: [CommonService],
  imports: [],
})
export class CommonModule {}
