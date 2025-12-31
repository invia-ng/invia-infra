import {
  Index,
  Column,
  Entity,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AccountStatus, EventCategoryEnum, UserRole } from '../constants/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Business } from './business.model';

@Entity()
export class Event {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: true,
    type: 'enum',
    enum: EventCategoryEnum,
    default: EventCategoryEnum.OTHERS,
  })
  @ApiPropertyOptional({
    description: 'Event category',
    example: EventCategoryEnum.OTHERS,
  })
  category: EventCategoryEnum;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'Bunke Dinner',
    description: 'Event name',
  })
  name: string;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiPropertyOptional({
    example: '2025-12-30T21:55:28.000Z',
    description: 'Event date',
  })
  date: Date;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: '14:00',
    description: 'Event time',
  })
  time: string;
  
  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'Zumji Event Center',
    description: 'Event location',
  })
  location: string;
  
  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'dk2025-12-30T21:43:45.300Zks',
    description: 'Event hash',
  })
  hash: string;

  @OneToOne(() => Business, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'business' })
  business: Business;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

export class EventInfo {
  @ApiProperty({ example: '75' })
  id: string;

  @ApiProperty({ example: 'Ibrahim' })
  name: string;

  @ApiProperty({ 
    enum: EventCategoryEnum,
    example: EventCategoryEnum.OTHERS,
  })
  category: EventCategoryEnum;

  @ApiProperty({ example: '2025-12-30T21:55:28.000Z' })
  date: Date;

  @ApiProperty({ example: '14:00' })
  time: string;

  @ApiProperty({ example: 'Zumji Event Center' })
  location: string;

  @ApiProperty({ example: 'dk2025-12-30T21:43:45.300Zks' })
  hash: string;

  @ApiProperty({
    example: 1,
  })
  totalInvites: number;

  @ApiProperty({
    example: 1,
  })
  sentInvites: number;

  @ApiProperty({
    example: 1,
  })
  acceptedInvites: number;

  @ApiProperty({
    example: 1,
  })
  pendingInvites: number;

  @ApiProperty({
    example: 1,
  })
  failedInvites: number;

}

export class EventsResponse {
    @ApiProperty({
    isArray: true,
    type: EventInfo,
  })
  events: EventInfo[];

  @ApiProperty({
    example: 1,
  })
  totalPages: number;

  @ApiProperty({
    example: true,
  })
  hasNextPage: boolean;
}