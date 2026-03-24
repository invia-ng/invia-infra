import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.model';
import { Guest } from './guest.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  FollowupConditionEnum,
  FollowupIntervalEnum,
} from '../constants/enums';
import { Business } from './business.model';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Send whats app invite',
  })
  sendWhatsAppInvite: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Send email invite',
  })
  sendEmailInvite: boolean;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Invitation cover image',
    example: 'https://media.s3.amazonaws.com/avatars/avatar.png',
  })
  image: string;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Invitation message',
    example:
      "Hi Mr & Mrs Ademola, you are cordially invited to Mr. & Mrs. Williams' Wedding.",
  })
  message: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'dk2025-12-30T21:43:45.300Zks',
    description: 'Invitation hash',
  })
  hash: string;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Guest invite sent',
  })
  isEmailInviteSent: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Guest invite delivered',
  })
  isEmailInviteDelivered: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Guest invite sent',
  })
  isWhatsAppInviteSent: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Guest invite delivered',
  })
  isWhatsAppInviteDelivered: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Guest RSVP status',
  })
  isRSVP: boolean;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Rejection note.',
    example: 'I also have a NATO summit that day and time.',
  })
  rejectionNote: string;

  @ManyToOne(() => Event, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'event' })
  event: Event;

  @ManyToOne(() => Guest, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'guest' })
  guest: Guest;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

@Entity()
export class FollowupInvitation {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Followup Invitation message',
    example:
      "Hi Mr & Mrs Ademola, you are cordially invited to Mr. & Mrs. Williams' Wedding.",
  })
  message: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'dk2025-12-30T21:43:45.300Zks',
    description: 'Followup invitation hash',
  })
  hash: string;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Guest invite sent',
  })
  isSent: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Guest invite delivered',
  })
  isDelivered: boolean;

  @Column({
    nullable: true,
    type: 'enum',
    enum: FollowupIntervalEnum,
    default: FollowupIntervalEnum.ONE_DAY,
  })
  @ApiPropertyOptional({
    description: 'Followup interval',
    example: FollowupIntervalEnum.ONE_DAY,
  })
  interval: FollowupIntervalEnum;

  @Column({
    nullable: true,
    type: 'enum',
    enum: FollowupConditionEnum,
    default: FollowupConditionEnum.RSVP,
  })
  @ApiPropertyOptional({
    description: 'Followup condition',
    example: FollowupConditionEnum.RSVP,
  })
  condition: FollowupConditionEnum;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Followup date time',
    example: '2025-12-30T21:55:28.000Z',
  })
  dateTime: Date;

  @ManyToOne(() => Invitation, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'invitation' })
  invitation: Invitation;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

@Entity()
export class InvitationPayment {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    default: 0,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Amount paid',
    example: 10000,
  })
  amountPaid: number;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 'INV-1234567890',
    description: 'Payment reference',
  })
  paymentReference: string;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Followup date time',
    example: '2025-12-30T21:55:28.000Z',
  })
  dateTime: Date;

  @ManyToOne(() => Event, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'event' })
  event: Event;

  @ManyToOne(() => Business, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'business' })
  business: Business;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
