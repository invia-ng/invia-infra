import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invitation } from './invitation.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmailWhatsappMessageAttemptStatusEnum } from '../constants/enums';

@Entity()
export class EmailWhatsappMessageAttempt {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 'whatsapp',
    description: 'Delivery channel: email | whatsapp',
  })
  channel: string;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 'wamid.HBgNMjM0OTAzMDMxNDc3NhUCABEYEjMwMEI1MDVDNDUyMzFFQkVGRQA=',
    description: 'WhatsApp message id from Meta (whatsapp channel)',
  })
  wamid: string;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 're_123abc456def',
    description: 'Email id from Resend API (email channel)',
  })
  resendEmailId: string;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 'accepted',
    description:
      'Message status: accepted | sent | delivered | failed | bounced | complained',
  })
  status: string;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    example: '131049',
    description: 'Provider error code when delivery fails',
  })
  errorCode: string;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    example:
      'This message was not delivered to maintain healthy ecosystem engagement.',
    description: 'Provider error message when delivery fails',
  })
  errorMessage: string;

  @Column({
    default: 0,
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 1,
    description: 'Send attempt number',
  })
  attemptNumber: number;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Scheduled time for the next retry',
    example: '2025-12-30T21:55:28.000Z',
  })
  nextRetryAt: Date;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Time of the last send attempt',
    example: '2025-12-30T21:55:28.000Z',
  })
  lastAttemptAt: Date;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Time the message was delivered',
    example: '2025-12-30T21:55:28.000Z',
  })
  deliveredAt: Date;

  @ManyToOne(() => Invitation, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitation' })
  invitation: Invitation;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

export class EmailWhatsappMessageAttemptInfo {
  @ApiProperty({
    example: '1',
  })
  id: string;

  @ApiProperty({
    example: 'whatsapp',
  })
  channel: string;

  @ApiProperty({
    example: 'wamid.HBgNMjM0OTAzMDMxNDc3NhUCABEYEjMwMEI1MDVDNDUyMzFFQkVGRQA=',
  })
  wamid: string;

  @ApiProperty({
    example: 're_123abc456def',
  })
  resendEmailId: string;

  @ApiProperty({
    example: 'accepted',
  })
  status: EmailWhatsappMessageAttemptStatusEnum;

  @ApiProperty({
    example: '131049',
  })
  errorCode: string;

  @ApiProperty({
    example:
      'This message was not delivered to maintain healthy ecosystem engagement.',
  })
  errorMessage: string;

  @ApiProperty({
    example: 1,
  })
  attemptNumber: number;

  @ApiProperty({
    example: '2025-12-30T21:55:28.000Z',
  })
  nextRetryAt: Date;

  @ApiProperty({
    example: '2025-12-30T21:55:28.000Z',
  })
  lastAttemptAt: Date;

  @ApiProperty({
    example: '2025-12-30T21:55:28.000Z',
  })
  deliveredAt: Date;

  @ApiProperty({
    example: 1,
  })
  invitation: number;
}
