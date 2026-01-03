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
import { GuestPartyEnum } from '../constants/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GuestPartyInfo } from '@app/event-service/src/interface/schema';

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