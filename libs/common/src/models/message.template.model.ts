import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from './business.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventCategoryEnum, FollowupConditionEnum, FollowupIntervalEnum } from '../constants/enums';

@Entity()
export class MessageTemplate {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 'Mega weddings template',
    description: 'Template name',
  })
  name: string;

  @Column({
    type: 'enum',
    enum: EventCategoryEnum,
    nullable: true,
  })
  @ApiPropertyOptional({
    enum: EventCategoryEnum,
    description: 'Event type',
    example: EventCategoryEnum.WEDDING,
  })
  eventType: EventCategoryEnum;

  @Column({
    type: 'text',
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: 'Hi {guest_name}, you are cordially invited to {event_name}.',
    description: 'Message content',
  })
  message: string;
  
  @Column({
    default: false,
    nullable: true,
  })
  @ApiPropertyOptional({ 
    example: false
  })
  sendFollowup: boolean;
  
  @Column({
    type: 'enum',
    enum: FollowupConditionEnum,
    nullable: true,
  })
  @ApiPropertyOptional({ 
    enum: FollowupConditionEnum,
    example: FollowupConditionEnum.NO_RSVP,
  })
  followupCondition: FollowupConditionEnum;
  
  @Column({
    type: 'enum',
    nullable: true,
    enum: FollowupIntervalEnum,
  })
  @ApiPropertyOptional({ 
    enum: FollowupIntervalEnum,
    example: FollowupIntervalEnum.FIVE_DAYS,
  })
  followupInterval: FollowupIntervalEnum;
  
  @ManyToOne(() => Business, {
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

export class MessageTemplateInfo {
  @ApiProperty({
		example: '1',
	})
	id: string;

  @ApiProperty({
		example: 'Mega weddings template',
	})
	name: string;

	@ApiProperty({
		enum: EventCategoryEnum,
		example: EventCategoryEnum.WEDDING,
	})
	eventType: EventCategoryEnum;

	@ApiProperty({
		example: 'Hi {guest_name}, you are cordially invited to {event_name}.',
	})
	message: string;

	@ApiProperty({
		example: false
	})
	sendFollowup: boolean;

	@ApiProperty({
		enum: FollowupConditionEnum,
		example: FollowupConditionEnum.NO_RSVP,
	})
	followupCondition: FollowupConditionEnum;

	@ApiProperty({
		enum: FollowupIntervalEnum,
		example: FollowupIntervalEnum.FIVE_DAYS,
	})
	followupInterval: FollowupIntervalEnum;
}

export class MessageTemplatesResponse {
	@ApiProperty({
		isArray: true,
		type: MessageTemplateInfo,
	})
	messages: MessageTemplateInfo[];

  @ApiProperty({
    example: 1,
  })
  totalPages: number;

  @ApiProperty({
    example: true,
  })
  hasNextPage: boolean;
}
