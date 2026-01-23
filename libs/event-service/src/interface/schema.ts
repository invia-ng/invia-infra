import { ApiProperty } from '@nestjs/swagger';
import {
  EventCategoryEnum,
  FollowupConditionEnum,
  FollowupIntervalEnum,
  GuestPartyEnum,
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
