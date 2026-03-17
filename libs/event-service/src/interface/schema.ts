import { ApiProperty } from '@nestjs/swagger';
import {
  EventCategoryEnum,
  FollowupConditionEnum,
  FollowupIntervalEnum,
  GuestPartyEnum,
  GuestTimelineActionEnum,
  MessageTemplateEnum,
} from '@app/common/src/constants/enums';

export class EventCategoryInfo {
  @ApiProperty({
    example: 'Others',
  })
  title: string;

  @ApiProperty({
    enum: EventCategoryEnum,
    example: EventCategoryEnum.OTHERS,
  })
  value: EventCategoryEnum;
}

export class GuestPartyInfo {
  @ApiProperty({
    example: 'Groom',
  })
  title: string;

  @ApiProperty({
    enum: GuestPartyEnum,
    example: GuestPartyEnum.GROOM,
  })
  value: GuestPartyEnum;
}

export class MessageTemplateEnumInfo {
  @ApiProperty({
    example: 'Guest Name',
  })
  title: string;

  @ApiProperty({
    enum: MessageTemplateEnum,
    example: MessageTemplateEnum.GUEST_NAME,
  })
  value: MessageTemplateEnum;
}

export class GuestTimelineActionEnumInfo {
  @ApiProperty({
    example: 'Guest Timeline Action',
  })
  title: string;

  @ApiProperty({
    enum: GuestTimelineActionEnum,
    example: GuestTimelineActionEnum.EDIT_EMAIL,
  })
  value: GuestTimelineActionEnum;
}

export class MessageTemplateFollowupConditionInfo {
  @ApiProperty({
    example: 'If no RSVP',
  })
  title: string;

  @ApiProperty({
    enum: FollowupConditionEnum,
    example: FollowupConditionEnum.NO_RSVP,
  })
  value: FollowupConditionEnum;
}

export class MessageTemplateFollowupIntervalInfo {
  @ApiProperty({
    example: 'If no RSVP',
  })
  title: string;

  @ApiProperty({
    enum: FollowupIntervalEnum,
    example: FollowupIntervalEnum.FIVE_DAYS,
  })
  value: FollowupIntervalEnum;
}

export class DeleteDataInstanceInfo {
  @ApiProperty({
    example: true,
  })
  status: boolean;

  @ApiProperty({
    example: 'Instance deleted successfully.',
  })
  message: string;
}

export class GenerateShareFormPasscodeInfo {
  @ApiProperty({
    example: '123456',
  })
  passcode: string;

  @ApiProperty({
    example: '2026-01-23T12:34:56.789Z',
  })
  passcodeExpires: Date | string;

  // @ApiProperty({
  //   example: '1 hour',
  // })
  // passcodeExpires: string;
}

export class AuthenticateShareFormInfo {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  accessToken: string;
}

export class AcceptRejectEventInvitationInfo {
  @ApiProperty({
    example: true,
  })
  inviteStatus: boolean;
}

export class ExportGuestListInfo {
  @ApiProperty({
    example: 'https://example.com/guest-list.pdf',
  })
  fileUrl: string;
}

export class EventGuestIdInfo {
  @ApiProperty({
    example: 1,
  })
  guestId: number;

  @ApiProperty({
    example: 'Groom',
  })
  party: string;
}

export class GuestEventInvitationInfo {
  @ApiProperty({
    description: 'Event name',
    example: 'Wedding',
  })
  eventName: string;

  @ApiProperty({
    description: 'Guest email',
    example: 'bioduna12@gmail.com',
  })
  guestEmail: string;

  @ApiProperty({
    description: 'Invitation image',
    example: 'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767585910/invite-mail_feajcp.png',
  })
  invitationImage: string;

  @ApiProperty({
    description: 'Message',
    example: 'You are invited to our wedding',
  })
  invitationMessage: string;

  @ApiProperty({
    description: 'Business name',
    example: 'ABC Events & Planning',
  })
  businessName: string;

  @ApiProperty({
    description: 'Business email',
    example: 'iuoer@gmail.com',
  })
  businessEmail: string;
}