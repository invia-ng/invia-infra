import { SecureUserPayload } from '@app/common/src/interface';
import { AddEventGuestsDTO, AddMessageTemplateDTO, CreateEventDTO, UpdateMessageTemplateDTO } from '../../interface';

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

export class RemoveEventGuestCommand {
    constructor(
        public readonly eventId: number,
        public readonly guestId: number,
        public readonly secureUser: SecureUserPayload,
    ){}
}

export class RemoveMultipleEventGuestsCommand {
    constructor(
        public readonly eventId: number,
        public readonly guestIds: number[],
        public readonly secureUser: SecureUserPayload,
    ){}
}

export class CreateMessageTemplateCommand {
    constructor(
        public readonly secureUser: SecureUserPayload,
        public readonly payload: AddMessageTemplateDTO,
    ){}
}

export class UpdateMessageTemplateCommand {
    constructor(
        public readonly secureUser: SecureUserPayload,
        public readonly messageId: number,
        public readonly payload: UpdateMessageTemplateDTO,
    ){}
}

export class DeleteMessageTemplateCommand {
    constructor(
        public readonly messageId: number,
        public readonly secureUser: SecureUserPayload,
    ){}
}

export class GenerateShareFormPasscodeCommand {
    constructor(
        public readonly eventId: number,
        public readonly secureUser: SecureUserPayload,
    ){}
}

export class AuthenticateShareFormPasscodeCommand {
    constructor(
        public readonly eventHash: string,
        public readonly passcode: string,
    ){}
}

export class AddEventAuthorGuestsCommand {
    constructor(
        public readonly payload: AddEventGuestsDTO,
        public readonly accessToken: string,
    ){}
}

export class RemoveEventAuthorGuestCommand {
    constructor(
        public readonly guestId: number,
        public readonly accessToken: string,
    ){}
}

export class RemoveMultipleEventAuthorGuestsCommand {
    constructor(
        public readonly guestIds: number[],
        public readonly accessToken: string,
    ){}
}
