import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AddressHelperService {
  private readonly logger = new Logger(AddressHelperService.name);

  constructor() {}
}
