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
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  trimTransformer,
  toLowerCaseTransformer,
} from '@app/common/src/helpers/local-class-validator';
import { EventCategoryEnum, FollowupConditionEnum, FollowupIntervalEnum, GuestPartyEnum } from '@app/common/src/constants/enums';

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
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty({
    example: 'Zumji Event Center',
    description: 'Event location.',
  })
  @IsNotEmpty()
  @IsString()
  location: string;
}

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
  @IsEnum(GuestPartyEnum)
  @IsNotEmpty()
  party: GuestPartyEnum;

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
        name: 'John Doe',
        phone: '+251911223344',
        party: GuestPartyEnum.GROOM,
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
