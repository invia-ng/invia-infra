import { FollowupConditionEnum, FollowupIntervalEnum } from '@app/common/src/constants/enums';
import { InviteFollowupMessage } from '@app/event-service/src/interface';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ProcessInviteEventGuestsBillingDTO {
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
	@IsOptional()
	@IsString()
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
		required: false,
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
	@ValidateNested({ each: true })
	@Type(() => InviteFollowupMessage)
	@Transform(({ value: InviteFollowupMessage }) => InviteFollowupMessage || [])
	followupInvitations?: InviteFollowupMessage[];
}