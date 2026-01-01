import { SecureUserPayload } from '@app/common/src/interface';
import { AddEventGuestsDTO, CreateEventDTO } from '../../interface';

export class CreateEventCommand {
    constructor(
        public readonly secureUser: SecureUserPayload,
        public readonly payload: CreateEventDTO,
    ){}
}

export class AddEventGuestsCommand {
    constructor(
        public readonly eventId: number,
        public readonly payload: AddEventGuestsDTO,
        public readonly secureUser: SecureUserPayload,
    ){}
}

export class DeleteEventGuestCommand {
    constructor(
        public readonly eventId: number,
        public readonly guestId: number,
        public readonly secureUser: SecureUserPayload,
    ){}
}