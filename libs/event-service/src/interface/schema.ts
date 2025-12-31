import { ApiProperty } from '@nestjs/swagger';
import { EventCategoryEnum, GuestPartyEnum } from '@app/common/src/constants/enums';

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