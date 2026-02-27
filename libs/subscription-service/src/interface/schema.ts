import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentSessionResponse {
  @ApiProperty({
    example: false,
  })
  status: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
  })
  paid_at: string;

  @ApiProperty({
    example: 'card',
  })
  channel: string;
}

export class Bank {
  @ApiProperty({
    example: 'test-bank',
    description: 'Unique identifier slug for the bank',
  })
  slug: string;

  @ApiProperty({
    example: 'Test Bank',
    description: 'Name of the bank',
  })
  name: string;

  @ApiProperty({
    example: 24,
    description: 'Unique identifier for the bank',
  })
  id: number;
}

export class ChargeResponseData {
  @ApiProperty({
    example: 'pending_bank_transfer',
    description: 'Current status of the charge attempt',
  })
  status: string;

  @ApiProperty({
    example: 'Please make a transfer to the account specified',
    description: 'Human readable message about the charge',
  })
  display_text: string;

  @ApiProperty({
    example: '4tn28gwznc',
    description: 'Unique reference for this transaction',
  })
  reference: string;

  @ApiProperty({
    example: 20000,
    description: 'Amount to be charged in smallest currency unit',
  })
  amount: number;

  @ApiProperty({
    example: 'PAYSTACK CHECKOUT',
    description: 'Name of the account to transfer to',
  })
  account_name: string;

  @ApiProperty({
    example: '1231084927',
    description: 'Account number to transfer to',
  })
  account_number: string;

  @ApiProperty({
    type: Bank,
    description: 'Bank details for the transfer',
  })
  bank: Bank;

  @ApiProperty({
    example: '2023-09-12T13:10:55.000Z',
    description: 'ISO timestamp when the account details expire',
  })
  account_expires_at: string;
}

export class ChargeResponse {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  status: boolean;

  @ApiProperty({
    example: 'Charge attempted',
    description: 'Message describing the result of the operation',
  })
  message: string;

  @ApiProperty({
    type: ChargeResponseData,
    description: 'The charge attempt details',
  })
  data: ChargeResponseData;
}

export class InvitationChargeResponse {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  status: boolean;

  @ApiProperty({
    example: 'Charge attempted',
    description: 'Message describing the result of the operation',
  })
  message: string;
  
  @ApiProperty({
    type: ChargeResponseData,
    description: 'The charge attempt details',
  })
  data: ChargeResponseData;
  
  @ApiProperty({
    example: 'Email Charge',
    description: 'Email charge details',
  })
  emailCharge: number
  
  @ApiProperty({
    example: 'Whatsapp Charge',
    description: 'Whatsapp charge details',
  })
  whatsAppCharge: number
  
  @ApiProperty({
    example: 1000,
    description: 'Discount amount',
  })
  discount: number

  @ApiProperty({
    example: 0,
    description: 'Email Discount',
  })
  emailDiscount: number

  @ApiProperty({
    example: 0,
    description: 'Whatsapp Discount',
  })
  whatsAppDiscount: number
}
