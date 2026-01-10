import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '@app/common/src/logger/logger.service';

@Injectable()
export class PaymentService {
  private paystackHeaders: {};

  constructor(
    private readonly config: ConfigService,
    @Inject('Logger') private readonly logger: AppLogger,
  ) {
    this.paystackHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.get<string>('PAYSTACK_TOKEN')}`,
    };
  }

  getPaystackHeaders() {
    return this.paystackHeaders;
  }
}
