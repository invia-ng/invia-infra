import {
  IsHash,
  IsEnum,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsNumberString,
  IsArray,
  ValidateNested,
  IsDate,
  IsBoolean,
  isEnum,
  IsNumber,
} from 'class-validator';
import {
  EventCategoryEnum,
  FollowupIntervalEnum,
  FollowupConditionEnum,
} from '@app/common/src/constants/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateEventPartyDTO {
  @ApiProperty({
    example: "Bride's Family",
    description: 'Event party name.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateEventDTO {
  @ApiProperty({
    example: 'Bunke Dinner',
    description: 'Event name.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: EventCategoryEnum,
    description: 'Event category.',
    example: EventCategoryEnum.OTHERS,
  })
  @IsNotEmpty()
  @IsEnum(EventCategoryEnum)
  category: EventCategoryEnum;

  @ApiProperty({
    example: '2025-12-30T21:55:28.000Z',
    description: 'Event date.',
  })
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty({
    example: '14:00',
    description: 'Event time.',
  })
  @IsOptional()
  @IsString()
  time: string;

  @ApiProperty({
    example: 'Zumji Event Center',
    description: 'Event location.',
  })
  @IsOptional()
  @IsString()
  location: string;
}

export class UpdateEventDTO extends CreateEventDTO {}

export class NewGuestDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Guest name.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Guest name.',
  })
  @IsString()
  @IsNotEmpty()
  party: string;

  @ApiProperty({
    example: '+251911223344',
    description: 'Guest phone.',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'john.doe@gmail.com',
    description: 'Guest email.',
  })
  @IsString()
  @IsOptional()
  email?: string;
}

export class AddEventGuestsDTO {
  @ApiProperty({
    isArray: true,
    type: NewGuestDto,
    description: 'Array of product guests',
    example: [
      {
        party: 'Groom',
        name: 'John Doe',
        phone: '+251911223344',
        email: 'john.doe@gmail.com',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NewGuestDto)
  guests: NewGuestDto[];
}

export class InviteFollowupMessage {
  @ApiProperty({
    description: 'Followup message.',
    example:
      'Hi {guest_name}, this is a reminder about your upcoming event {event_name} which you have been invited to.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Followup interval.',
    example: FollowupIntervalEnum.ONE_DAY,
  })
  @IsEnum(FollowupIntervalEnum)
  @IsNotEmpty()
  interval: FollowupIntervalEnum;

  @ApiProperty({
    description: 'Followup interval.',
    example: FollowupConditionEnum.NO_RSVP,
  })
  @IsEnum(FollowupConditionEnum)
  @IsNotEmpty()
  condition: FollowupConditionEnum;
}

export class InviteEventGuestsDTO {
  @ApiProperty({
    isArray: true,
    type: Number,
    description: 'Array of product guests',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  guestIds: number[];

  @ApiProperty({
    example: false,
    description: 'Send email invite.',
  })
  @IsBoolean()
  @IsNotEmpty()
  sendEmailInvite: boolean;

  @ApiProperty({
    example: false,
    description: 'Send WhatsApp invite.',
  })
  @IsBoolean()
  @IsNotEmpty()
  sendWhatsAppInvite: boolean;

  @ApiProperty({
    description: 'Invitation cover image.',
    example: 'https://media.s3.amazonaws.com/avatars/avatar.png',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Invitation message.',
    example: 'Hi {guest_name}, you are cordially invited to {event_name}.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    isArray: true,
    type: InviteFollowupMessage,
    description: 'Array of followup invitations',
    example: [
      {
        interval: FollowupIntervalEnum.ONE_DAY,
        condition: FollowupConditionEnum.NO_RSVP,
        message:
          'Hi {guest_name}, this is a reminder about your upcoming event {event_name} which you have been invited to.',
      },
    ],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => InviteFollowupMessage)
  followupInvitations?: InviteFollowupMessage[];
}

export class AddMessageTemplateDTO {
  @ApiProperty({
    example: 'John Doe',
    description: 'Message template name.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: EventCategoryEnum,
    description: 'Event Type.',
    example: EventCategoryEnum.ALL,
  })
  @IsEnum(EventCategoryEnum)
  @IsNotEmpty()
  eventType: EventCategoryEnum;

  @ApiProperty({
    description: 'Message template.',
    example: 'Hello {{name}}, you are invited to {{eventType}}',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  sendFollowup: boolean;

  @ApiProperty({
    enum: FollowupConditionEnum,
    example: FollowupConditionEnum.NO_RSVP,
  })
  @IsEnum(FollowupConditionEnum)
  @IsOptional()
  followupCondition?: FollowupConditionEnum;

  @ApiProperty({
    enum: FollowupIntervalEnum,
    example: FollowupIntervalEnum.FIVE_DAYS,
  })
  @IsEnum(FollowupIntervalEnum)
  @IsOptional()
  followupInterval?: FollowupIntervalEnum;
}

export class UpdateMessageTemplateDTO {
  @ApiProperty({
    example: 'John Doe',
    description: 'Message template name.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: EventCategoryEnum,
    description: 'Event Type.',
    example: EventCategoryEnum.ALL,
  })
  @IsEnum(EventCategoryEnum)
  @IsNotEmpty()
  eventType: EventCategoryEnum;

  @ApiProperty({
    description: 'Message template.',
    example: 'Hello {{name}}, you are invited to {{eventType}}',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  sendFollowup: boolean;

  @ApiProperty({
    enum: FollowupConditionEnum,
    example: FollowupConditionEnum.NO_RSVP,
  })
  @IsEnum(FollowupConditionEnum)
  @IsOptional()
  followupCondition?: FollowupConditionEnum;

  @ApiProperty({
    enum: FollowupIntervalEnum,
    example: FollowupIntervalEnum.FIVE_DAYS,
  })
  @IsEnum(FollowupIntervalEnum)
  @IsOptional()
  followupInterval?: FollowupIntervalEnum;
}

export class AcceptRejectEventInvitationDTO {
  @ApiProperty({
    description: 'Rejection note.',
    example: 'I also have a NATO summit that day and time.',
  })
  @IsString()
  @IsOptional()
  rejectionNote?: string;
}

export class ExportGuestListDto {
  @ApiProperty({
    isArray: true,
    type: Number,
    required: true,
    example: [1, 2, 3],
    description: 'Guest Primary IDs',
  })
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  guestIds: number[];

  @ApiProperty({
    example: true,
    description: 'Include RSVP status',
  })
  @IsBoolean()
  @IsNotEmpty()
  isRSVP: boolean;

  @ApiProperty({
    example: true,
    description: 'Include Guest Name',
  })
  @IsBoolean()
  @IsNotEmpty()
  guestName: boolean;

  @ApiProperty({
    example: true,
    description: 'Include Invite Status',
  })
  @IsBoolean()
  @IsNotEmpty()
  inviteStatus: boolean;

  @ApiProperty({
    example: true,
    description: 'Include Phone Number',
  })
  @IsBoolean()
  @IsNotEmpty()
  phoneNumber: boolean;

  @ApiProperty({
    example: true,
    description: 'Include Party',
  })
  @IsBoolean()
  @IsNotEmpty()
  party: boolean;

  @ApiProperty({
    example: true,
    description: 'Include Email Address',
  })
  @IsBoolean()
  @IsNotEmpty()
  emailAddress: boolean;

  @ApiProperty({
    example: 'csv',
    enum: ['csv', 'pdf'],
    description: 'Export format',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['csv', 'pdf'])
  exportFormat: 'csv' | 'pdf';

  @ApiProperty({
    example: 'asc',
    enum: ['asc', 'desc'],
    description: 'Sort by',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['asc', 'desc'])
  sortBy: 'asc' | 'desc';
}
