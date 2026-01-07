import { ApiProperty } from '@nestjs/swagger';

export class PhoneContactInfo {
  @ApiProperty({
    type: String,
    example: '23',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: '+2349092019099',
  })
  phoneNumber: string;
}

export class BusinessInvitationInfo {
  @ApiProperty({
    example: '',
    description: 'Account email',
  })
  accountEmail: string;

  @ApiProperty({
    example: '',
    description: 'Business name',
  })
  businessName: string;

  @ApiProperty({
    example: '',
    description: 'Business avatar URL',
  })
  avatar: string;
}