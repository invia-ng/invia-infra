import {
  Index,
  Column,
  Entity,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountStatus, UserRole } from '../constants/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
@Index('IDX_USER_EMAIL', ['email'])
export class Account {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'Kunle',
    description: 'Name',
  })
  name: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'Kunle',
    description: 'First name',
  })
  firstName: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'Adeboye',
    description: 'Last name',
  })
  lastName: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'Ade Events',
    description: 'Business name',
  })
  businessName: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: '+2348054618649',
    description: 'Phone number',
  })
  phoneNumber: string;

  @Column({
    nullable: false,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'kunle@yopmail.com',
    description: 'Email',
  })
  email: string;

  @Column({
    nullable: false,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'New email address e.g tundeomotayo11@gmail.com.',
  })
  newEmail: string;

  @Column({
    nullable: false,
    default: '',
  })
  @ApiPropertyOptional({
    example: '',
    description: 'Password',
  })
  password: string;

  @Column({
    nullable: true,
    default: 'https://livestocx-media.s3.amazonaws.com/avatars/avatar.png',
  })
  @ApiPropertyOptional({
    example: 'https://media.s3.amazonaws.com/avatars/avatar.png',
    description: 'Avatar URL',
  })
  avatar: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'https://media.s3.amazonaws.com/avatars/avatar.png',
    description: 'Business avatar URL',
  })
  businessAvatar: string;
  
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @ApiPropertyOptional({
    example: UserRole.CUSTOMER,
    description: 'User role',
  })
  role: UserRole;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Is account disabled',
  })
  isAccountDisabled: boolean;

  @Column({ default: '', nullable: true })
  @ApiPropertyOptional({
    description: 'Signup verification hash',
  })
  signupVerificationHash: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Activation code by e.g 5492',
  })
  activationCode: string;

  @Column({
    default: null,
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Activation code expires by e.g 2024-11-10_T_11:29:22',
  })
  activationCodeExpires: Date;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  @ApiPropertyOptional({
    description: 'Account status e.g PENDING',
  })
  status: AccountStatus;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Password reset code by e.g 5492',
  })
  passwordResetCode: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Password reset token by e.g ja92jkAjj11ma2',
  })
  passwordResetToken: string;

  @Column({
    default: null,
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Password reset code expires by e.g 2024-11-10_T_11:29:22',
  })
  passwordResetCodeExpires: Date;
  
  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Is password updated',
  })
  isPasswordUpdated: boolean;
  
  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Is business profile updated',
  })
  isBusinessProfileUpdated: boolean;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

export class AccountInfo {
  @ApiProperty({ example: '75' })
  id: string;

  @ApiProperty({ example: 'Ibrahim' })
  name: string;

  @ApiProperty({ example: 'Ibrahim' })
  firstName: string;

  @ApiProperty({ example: 'Gyang' })
  lastName: string;

  @ApiProperty({ example: '8054618649' })
  phoneNumber: string;

  @ApiProperty({ example: 'gibrahim@yopmail.com' })
  email: string;

  @ApiProperty({
    example: 'https://livestocx-media.s3.amazonaws.com/avatars/avatar.png',
  })
  avatar: string;

  @ApiProperty({ example: 'CUSTOMER', enum: UserRole })
  role: UserRole;

  @ApiProperty({ example: 'active', enum: AccountStatus })
  status: AccountStatus;

  @ApiProperty({ example: false })
  isAccountDisabled: boolean;

  // @ApiProperty({ example: 'https://lit.jpg' })
  // businessAvatar: string;

  // @ApiProperty({ example: 'Ade Events' })
  // businessName: string;

  @ApiProperty({ example: false })
  isPasswordUpdated: boolean;

  @ApiProperty({ example: false })
  isBusinessProfileUpdated: boolean;
}
