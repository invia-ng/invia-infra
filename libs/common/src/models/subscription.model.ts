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
} from '../constants/enums';
import { Business } from './business.model';
import { ApiPropertyOptional } from '@nestjs/swagger';

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

  @ManyToOne(() => SubscriptionPlan, { eager: true })
  @JoinColumn({ name: 'planId' })
  plan: SubscriptionPlan;

  @ManyToOne(() => Business, (business) => business.subscriptions)
  @JoinColumn({ name: 'business' })
  business: Business;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
