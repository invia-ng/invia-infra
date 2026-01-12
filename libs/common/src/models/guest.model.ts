import {
  Index,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GuestTimelineActionEnum } from '../constants/enums';

@Entity()
export class Guest {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Guest party',
    example: 'Groom',
  })
  party: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'Tunde Ajebo',
    description: 'Guest name',
  })
  name: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'tunde@gmail.com',
    description: 'Guest email',
  })
  email: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: '+2348012345678',
    description: 'Guest phone',
  })
  phone: string;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Guest invite sent',
  })
  isInviteSent: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Guest invite delivered',
  })
  isInviteDelivered: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Guest RSVP status',
  })
  isInviteRSVP: boolean;

  @ManyToOne(() => Event, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'event' })
  event: Event;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

@Entity()
export class GuestTimeline {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: true,
    enum: GuestTimelineActionEnum,
    default: GuestTimelineActionEnum.SENT_INVITE_MESSAGE,
  })
  @ApiPropertyOptional({
    description: 'Timeline action type',
    example: GuestTimelineActionEnum.SENT_INVITE_MESSAGE,
  })
  action: GuestTimelineActionEnum;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Timeline description',
    example: 'You edited Email from old@email.com to new@email.com',
  })
  description: string;

  @ManyToOne(() => Guest, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guest' })
  guest: Guest;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

export class GuestInfo {
  @ApiProperty({ example: '75' })
  id: string;

  @ApiProperty({ example: 'Ibrahim' })
  name: string;

  @ApiProperty({
    example: 'Groom',
  })
  party: string;

  @ApiProperty({ example: 'tunde@gmail.com' })
  email: string;

  @ApiProperty({ example: '+2348012345678' })
  phone: string;

  @ApiProperty({ example: false })
  isInviteSent: boolean;

  @ApiProperty({ example: false })
  isInviteDelivered: boolean;

  @ApiProperty({ example: false })
  isInviteRSVP: boolean;
}

export class GuestsResponse {
  @ApiProperty({
    isArray: true,
    type: GuestInfo,
  })
  guests: GuestInfo[];

  @ApiProperty({
    isArray: true,
    type: String,
    description: 'Guest parties',
  })
  guestParties: string[];

  @ApiProperty({
    example: 1,
  })
  totalPages: number;

  @ApiProperty({
    example: true,
  })
  hasNextPage: boolean;
}

export class GuestTimelineInfo {
  @ApiProperty({ example: '75' })
  id: string;

  @ApiProperty({
    description: 'Timeline action type',
    example: GuestTimelineActionEnum.SENT_INVITE_MESSAGE,
  })
  action: GuestTimelineActionEnum;

  @ApiProperty({
    description: 'Timeline description',
    example: 'You edited Email from old@email.com to new@email.com',
  })
  description: string;

  @ApiProperty({
    description: 'Timeline time',
    example: '2023-01-01T00:00:00.000Z',
  })
  time: string;

  @ApiProperty({
    description: 'Timeline date',
    example: '2023-01-01T00:00:00.000Z',
  })
  date: string;
}

export class GuestProfileInfo {
  @ApiProperty({
    isArray: true,
    type: GuestTimelineInfo,
  })
  timelines: GuestTimelineInfo[];

  @ApiProperty({
    type: GuestInfo,
    description: 'Guest profile', 
  })
  profile: GuestInfo;
}
