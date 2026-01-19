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
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  trimTransformer,
  capitalizeTransformer,
  toLowerCaseTransformer,
  capitalizeWordsTransformer,
} from '../../../common/src/helpers/local-class-validator';
import { AccountRole } from 'libs/common/src/constants/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountInfo } from '@app/common/src/models/account.model';

export class InitializeNewAccountDTO {
  @ApiProperty({
    example: 'kunleadeboye@gmail.com',
    description: 'Email address of the user.',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;

  @Transform(({ value }) => capitalizeTransformer(value))
  @ApiProperty({
    example: 'Kunle',
    description: 'Personal name of the user.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateAccountDTO {
  @ApiProperty({
    example: 'kunleadeboye@gmail.com',
    description: 'Email address of the user.',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Password for the user account.',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @Transform(({ value }) => capitalizeTransformer(value))
  @ApiProperty({
    example: 'Kunle',
    description: 'First name of the user.',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Transform(({ value }) => capitalizeTransformer(value))
  @ApiProperty({
    example: 'Adeboye',
    description: 'Last name of the user.',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Transform(({ value }) => trimTransformer(value))
  @ApiPropertyOptional({
    example: '+2348123456789',
    description: 'Phone number of the user.',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @Transform(({ value }) => trimTransformer(value))
  @ApiProperty({
    example: 'LVSX1902123',
    description: 'Referral code of the user (Optional).',
  })
  @IsOptional()
  @IsString()
  referralCode: string;

  @Transform(({ value }) => trimTransformer(value))
  @ApiProperty({
    example: 'HEAR ABOUT US',
    description: 'How did you hear about Livestocx?',
  })
  @IsOptional()
  @IsString()
  referral_source: string;

  @ApiProperty({
    example: 'ADMIN',
    default: AccountRole.ADMIN,
    description: 'Role of the user.',
  })
  @IsEnum(AccountRole)
  @IsOptional()
  role: AccountRole;

  @ApiPropertyOptional({
    example: 'Lagos',
    description: 'State of the user.',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    capitalizeWordsTransformer(value),
  )
  state: string;

  @ApiPropertyOptional({
    example: 'Ikeja',
    description: 'City of the user.',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    capitalizeWordsTransformer(value),
  )
  city: string;

  @ApiPropertyOptional({
    example: 'Business Name',
    description: 'Name of the business.',
  })
  @IsString()
  @IsOptional()
  businessName: string;

  @ApiPropertyOptional({
    example: 'Business Address',
    description: 'Address of the business.',
  })
  @IsString()
  @IsOptional()
  businessAddress: string;
}

export class CompleteSignupVerificationDTO {
  @ApiProperty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsHash('sha256')
  signupVerificationHash: string;
}

export class CreateAccountPasswordDTO {
  @ApiProperty({
    example: 'Password123',
    description: 'Password for the user account.',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class InitializeBusinessProfileDTO {
  @ApiProperty({
    example: 'Business Avatar',
    description: 'Avatar of the business.',
  })
  @IsString()
  @IsNotEmpty()
  businessAvatar: string;

  @ApiProperty({
    example: 'Business Name',
    description: 'Name of the business.',
  })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({
    example: 'beduevents@tryinvia.com',
    description: 'Email of the business.',
  })
  @IsEmail()
  @IsNotEmpty()
  businessEmail: string;
}

export class OAuthSigninDTO {
  @ApiProperty({
    example: 'kunle@gmail.com',
    description: 'Account email.',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({
    example: 'kunle@gmail.com',
    description: 'Account email.',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;
}

export class ResetPasswordDTO {
  @ApiProperty({
    example: 'Password@123',
    description: 'Account password.',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;

  @ApiProperty({
    example: 'a7c9c7a9-249a-2890-8396-1643b5dbca72',
    description: 'Password reset token.',
  })
  @IsString()
  @IsOptional()
  passwordResetToken: string;

  @ApiProperty({
    example: 29,
    description: 'Account Id.',
  })
  @IsString()
  @IsOptional()
  accountId: string;
}

export class ResetPasswordVerificationDTO {
  @ApiProperty({
    example: 'kunle@gmail.com',
    description: 'Account email.',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;

  @ApiProperty({
    example: '2938',
    description: 'Password reset token.',
  })
  @IsString()
  otp: string;
}

export class SignupResponsePayload {
  @ApiProperty()
  signupVerificationHash: string;
}

export class NewAccountInfo {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: AccountInfo })
  accountInfo: AccountInfo;
}

export class SignupVerificationResponsePayload {
  @ApiProperty()
  token: string;
}

export class SigninResponsePayload extends SignupVerificationResponsePayload {}

export class ResetPasswordOTPVerificationResponsePayload {
  @ApiProperty({
    example: '23',
    description: 'Account Id.',
  })
  accountId: string;

  @ApiProperty({
    example: 'Random UUID',
    description: 'Password reset token',
  })
  passwordResetToken: string;
}

export class SigninDTO {
  @ApiProperty({
    example: 'kunle@gmail.com',
    description: 'Account email.',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => trimTransformer(toLowerCaseTransformer(value)))
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'Account password.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AvailabilityCheckInfo {
  @ApiProperty({ type: Boolean, example: false })
  isAvailable: boolean;
}
