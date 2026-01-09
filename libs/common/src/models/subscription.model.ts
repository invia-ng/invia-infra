import {
  Index,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  SubscriptionStatusEnum,
  SubscriptionIntervalEnum,
  SubscriptionItemLimitEnum,
} from '../constants/enums';
import { Business } from '../models/business.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class SubscriptionPlan {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 'Pro',
    description: 'Plan Name',
  })
  name: string;

  @Column({
    type: 'text',
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 'Everything you need to create, manage, and track guest lists.',
    description: 'Plan Description',
  })
  description: string;

  @Column({
    default: 0,
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 38000,
    description: 'Plan Price NGN',
  })
  priceNGN: number;

  @Column({
    default: 0,
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 45000,
    description: 'Original Price NGN(for strikethrough)',
  })
  originalPriceNGN: number;

  @Column({
    default: 0,
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 38000,
    description: 'Plan Price USD',
  })
  priceUSD: number;

  @Column({
    default: 0,
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 45000,
    description: 'Original Price USD(for strikethrough)',
  })
  originalPriceUSD: number;

  @Column({
    type: 'enum',
    enum: SubscriptionIntervalEnum,
    default: SubscriptionIntervalEnum.MONTHLY,
  })
  @ApiPropertyOptional({
    example: 'monthly',
    description: 'Billing Interval',
  })
  interval: SubscriptionIntervalEnum;

  @Column({
    default: false,
  })
  @ApiPropertyOptional({
    example: true,
    description: 'Is this the recommended plan?',
  })
  isRecommended: boolean;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

@Entity()
export class SubscriptionPlanFeature {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Plan Feature',
    example: 'Up to 300 guests per event',
  })
  title: string;

  @ManyToOne(() => SubscriptionPlan, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'subscriptionPlan' })
  subscriptionPlan: SubscriptionPlan;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'enum',
    enum: SubscriptionStatusEnum,
    default: SubscriptionStatusEnum.ACTIVE,
  })
  @ApiPropertyOptional({
    example: 'active',
    description: 'Subscription Status',
  })
  status: SubscriptionStatusEnum;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Current Period Start Date',
  })
  subscriptionDate: Date;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Current Period End Date',
  })
  expirationDate: Date;

  @Column({
    default: 0,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Current Period End Date',
  })
  guestLimit: number;

  @Column({
    nullable: true,
    default: SubscriptionItemLimitEnum.LIMITED,
  })
  @ApiPropertyOptional({
    description: 'Current Period End Date',
    example: SubscriptionItemLimitEnum.LIMITED,
  })
  guestLimitStatus: SubscriptionItemLimitEnum;

  @Column({
    type: 'enum',
    enum: SubscriptionItemLimitEnum,
    default: SubscriptionItemLimitEnum.UNLIMITED,
  })
  @ApiPropertyOptional({
    example: 'unlimited',
    description: 'Event Limit',
  })
  eventLimit: SubscriptionItemLimitEnum;

  @Column({
    default: false,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Reusable Message Templates',
  })
  reusableMessageTemplates: boolean;

  @Column({
    default: false,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Invitation Cover Image',
  })
  invitationCoverImage: boolean;

  @Column({
    default: false,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Guest Activity Timeline',
  })
  guestActivityTimeline: boolean;

  @Column({
    default: false,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Advanced Guest Activity Timeline',
  })
  advancedGuestActivityTimeline: boolean;

  @Column({
    default: false,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Followup Messages',
  })
  followupMessages: boolean;

  @Column({
    default: false,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Manage Team Members',
  })
  manageTeamMembers: boolean;

  @Column({
    default: false,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Secure Guest Data Access',
  })
  secureGuestDataAccess: boolean;

  @Column({
    default: false,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Flexible Data Export',
  })
  flexibleDataExport: boolean;

  @ManyToOne(() => SubscriptionPlan, { eager: true })
  @JoinColumn({ name: 'planId' })
  plan: SubscriptionPlan;

  @ManyToOne(() => Business, (business) => business)
  @JoinColumn({ name: 'business' })
  business: Business;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

export class SubscriptionPlanFeatureInfo {
  @ApiProperty({
    example: '1',
    description: 'Feature ID',
  })
  id: string;

  @ApiProperty({
    example: 'Up to 300 guests per event',
    description: 'Feature Title',
  })
  title: string;
}

export class SubscriptionPlanInfo {
  @ApiProperty({
    example: '1',
    description: 'Plan ID',
  })
  id: string;

  @ApiProperty({
    example: 'Pro',
    description: 'Plan Name',
  })
  name: string;

  @ApiProperty({
    example: 'Everything you need to create, manage, and track guest lists.',
    description: 'Plan Description',
  })
  description: string;

  @ApiProperty({
    example: 38000,
    description: 'Plan Price NGN',
  })
  priceNGN: number;

  @ApiProperty({
    example: 45000,
    description: 'Original Price NGN(for strikethrough)',
  })
  originalPriceNGN: number;

  @ApiProperty({
    example: 38000,
    description: 'Plan Price USD',
  })
  priceUSD: number;

  @ApiProperty({
    example: 45000,
    description: 'Original Price USD(for strikethrough)',
  })
  originalPriceUSD: number;

  @ApiProperty({
    example: 'monthly',
    description: 'Billing Interval',
  })
  interval: SubscriptionIntervalEnum;

  @ApiProperty({
    example: true,
    description: 'Is this the recommended plan?',
  })
  isRecommended: boolean;

  @ApiProperty({
    isArray: true,
    type: SubscriptionPlanFeatureInfo,
  })
  features: SubscriptionPlanFeatureInfo[];
}

export class SubscriptionInfo {
  @ApiProperty({
    example: '1',
    description: 'Subscription ID',
  })
  id: string;

  @ApiProperty({
    example: 'active',
    description: 'Subscription status',
  })
  status: string;

  @ApiProperty({
    example: '2025-12-30T21:55:28.000Z',
    description: 'Subscription expiration date',
  })
  expirationDate: Date;

  @ApiProperty({
    example: '2025-12-30T21:55:28.000Z',
    description: 'Subscription expiration date',
  })
  subscriptionDate: Date;

  @ApiProperty({
    example: 300,
    description: 'Guest limit',
  })
  guestLimit: number;

  @ApiProperty({
    example: SubscriptionItemLimitEnum.UNLIMITED,
    description: 'Guest limit status',
  })
  guestLimitStatus: SubscriptionItemLimitEnum;

  @ApiProperty({
    example: 'unlimited',
    description: 'Event Limit',
  })
  eventLimit: SubscriptionItemLimitEnum;

  @ApiProperty({
    description: 'Reusable Message Templates',
  })
  reusableMessageTemplates: boolean;

  @ApiProperty({
    description: 'Invitation Cover Image',
  })
  invitationCoverImage: boolean;

  @ApiProperty({
    description: 'Guest Activity Timeline',
  })
  guestActivityTimeline: boolean;

  @ApiProperty({
    description: 'Advanced Guest Activity Timeline',
  })
  advancedGuestActivityTimeline: boolean;

  @ApiProperty({
    description: 'Followup Messages',
  })
  followupMessages: boolean;

  @ApiProperty({
    description: 'Manage Team Members',
  })
  manageTeamMembers: boolean;

  @ApiProperty({
    description: 'Secure Guest Data Access',
  })
  secureGuestDataAccess: boolean;

  @ApiProperty({
    description: 'Flexible Data Export',
  })
  flexibleDataExport: boolean;
}
