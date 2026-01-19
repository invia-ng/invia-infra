import {
  CreateEventDTO,
  UpdateEventDTO,
  AddEventGuestsDTO,
  CreateEventPartyDTO,
  InviteEventGuestsDTO,
  AddMessageTemplateDTO,
  UpdateMessageTemplateDTO,
  AcceptRejectEventInvitationDTO,
  ExportGuestListDto,
  InviteEventGuestDTO,
  UpdateEventGuestDTO,
} from '../../interface';
import { SecureUserPayload } from '@app/common/src/interface';

export class CreateEventPartyCommand {
  constructor(
    public readonly eventId: number,
    public readonly payload: CreateEventPartyDTO,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class DeleteEventPartyCommand {
  constructor(
    public readonly eventId: number,
    public readonly partyId: number,
    public readonly secureUser: SecureUserPayload,
    public readonly newPartyId?: number,
  ) {}
}

export class CreateEventCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: CreateEventDTO,
  ) {}
}

export class UpdateEventCommand {
  constructor(
    public readonly eventId: number,
    public readonly payload: UpdateEventDTO,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class DeleteEventCommand {
  constructor(
    public readonly eventId: number,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class AddEventGuestsCommand {
  constructor(
    public readonly eventId: number,
    public readonly payload: AddEventGuestsDTO,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class UpdateEventGuestCommand {
  constructor(
    public readonly eventId: number,
    public readonly guestId: number,
    public readonly payload: UpdateEventGuestDTO,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class EventAuthorUpdateEventGuestCommand {
  constructor(
    public readonly eventId: number,
    public readonly guestId: number,
    public readonly payload: UpdateEventGuestDTO,
    public readonly accessToken: string,
  ) {}
}

export class InviteEventGuestCommand {
  constructor(
    public readonly eventId: number,
    public readonly guestId: number,
    public readonly payload: InviteEventGuestDTO,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class EventAuthorInviteEventGuestCommand {
  constructor(
    public readonly eventId: number,
    public readonly guestId: number,
    public readonly payload: InviteEventGuestDTO,
    public readonly accessToken: string,
  ) {}
}

export class InviteEventGuestsCommand {
  constructor(
    public readonly eventId: number,
    public readonly payload: InviteEventGuestsDTO,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class EventAuthorInviteEventGuestsCommand {
  constructor(
    public readonly eventId: number,
    public readonly payload: InviteEventGuestsDTO,
    public readonly accessToken: string,
  ) {}
}

export class RemoveEventGuestCommand {
  constructor(
    public readonly eventId: number,
    public readonly guestId: number,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class RemoveMultipleEventGuestsCommand {
  constructor(
    public readonly eventId: number,
    public readonly guestIds: number[],
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class CreateMessageTemplateCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly payload: AddMessageTemplateDTO,
  ) {}
}

export class UpdateMessageTemplateCommand {
  constructor(
    public readonly secureUser: SecureUserPayload,
    public readonly messageId: number,
    public readonly payload: UpdateMessageTemplateDTO,
  ) {}
}

export class DeleteMessageTemplateCommand {
  constructor(
    public readonly messageId: number,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class GenerateShareFormPasscodeCommand {
  constructor(
    public readonly eventId: number,
    public readonly secureUser: SecureUserPayload,
  ) {}
}

export class AuthenticateShareFormPasscodeCommand {
  constructor(
    public readonly eventHash: string,
    public readonly passcode: string,
  ) {}
}

export class AddEventAuthorGuestsCommand {
  constructor(
    public readonly payload: AddEventGuestsDTO,
    public readonly accessToken: string,
  ) {}
}

export class RemoveEventAuthorGuestCommand {
  constructor(
    public readonly guestId: number,
    public readonly accessToken: string,
  ) {}
}

export class RemoveMultipleEventAuthorGuestsCommand {
  constructor(
    public readonly guestIds: number[],
    public readonly accessToken: string,
  ) {}
}

export class AcceptRejectEventInvitationCommand {
  constructor(
    public readonly invitationHash: string,
    public readonly acceptInvite: boolean,
    public readonly payload: AcceptRejectEventInvitationDTO,
  ) {}
}

export class ExportGuestListCommand {
  constructor(
    public readonly eventId: number,
    public readonly payload: ExportGuestListDto,
    public readonly secureUser: SecureUserPayload,
  ) {}
}
