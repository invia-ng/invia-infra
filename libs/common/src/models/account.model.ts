import {
  Index,
  Column,
  Entity,
  JoinTable,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountStatus, AccountRole } from '../constants/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Business } from './business.model';

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
    description: 'Email verification hash e.g ja92jkAjj11ma2',
  })
  emailVerificationHash: string;

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
    default:
      'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767799165/Screenshot_2026-01-07_at_16.19.18_nvaxru.png',
  })
  @ApiPropertyOptional({
    example:
      'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767799165/Screenshot_2026-01-07_at_16.19.18_nvaxru.png',
    description: 'Avatar URL',
  })
  avatar: string;

  @Column({
    type: 'enum',
    enum: AccountRole,
    default: AccountRole.OWNER,
  })
  @ApiPropertyOptional({
    example: AccountRole.OWNER,
    description: 'User role',
  })
  role: AccountRole;

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

  @Column({ default: '', nullable: true })
  @ApiPropertyOptional({
    description: 'Business invitation hash',
  })
  invitationHash: string;

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

  @ManyToOne('Business', 'members', { onDelete: 'CASCADE' })
  business: Business;

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

  @ApiProperty({ example: '8054618649' })
  phoneNumber: string;

  @ApiProperty({ example: 'gibrahim@yopmail.com' })
  email: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767799165/Screenshot_2026-01-07_at_16.19.18_nvaxru.png',
  })
  avatar: string;

  @ApiProperty({ example: 'CUSTOMER', enum: AccountRole })
  role: AccountRole;

  @ApiProperty({ example: 'active', enum: AccountStatus })
  status: AccountStatus;

  @ApiProperty({ example: false })
  isAccountDisabled: boolean;

  @ApiProperty({ example: false })
  isPasswordUpdated: boolean;

  @ApiProperty({ example: false })
  isBusinessProfileUpdated: boolean;

  @ApiProperty({ example: 'Pro' })
  subscriptionPlan: string;
}

export class BusinessMemberInfo {
  @ApiProperty({ example: '75' })
  id: string;

  @ApiProperty({ example: 'Ibrahim' })
  name: string;

  @ApiProperty({ example: '+2348054618649' })
  phoneNumber: string;

  @ApiProperty({ example: 'gibrahim@gmail.com' })
  email: string;

  @ApiProperty({ example: 'MEMBER', enum: AccountRole })
  role: AccountRole;

  @ApiProperty({ example: false })
  isInvitationAccepted: boolean;
}
