import { SecureUserPayload } from '@app/common/src/interface';
import { CreateEventDTO } from '../../interface';

export class CreateEventCommand {
    constructor(
        public readonly secureUser: SecureUserPayload,
        public readonly payload: CreateEventDTO,
    ){}
}