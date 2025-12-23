import {
  Index,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.model';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../constants/enums';

@Entity()
@Index('IDX_NOTIFICATION_ACCOUNT', ['account'])
export class Notification {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({
    nullable: true,
    default: '',
  })
  title: string;

  @Column({
    nullable: true,
    default: '',
  })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({
    type: 'enum',
    nullable: true,
    enum: NotificationType,
    default: NotificationType.MESSAGE,
  })
  notificationType: NotificationType;

  @ManyToOne(() => Account, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'account' })
  account: Account;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

export class NotificationInfo {
  @ApiProperty({ example: '75' })
  id: string;

  @ApiProperty({ example: 'New message from user' })
  title: string;

  @ApiProperty({ example: 'New message from user' })
  message: string;

  @ApiProperty({ example: 'New message from user' })
  notificationType: NotificationType;

  @ApiProperty({ example: 'New message from user' })
  isRead: boolean;

  @ApiProperty({ example: 'New message from user' })
  createdAt: Date;
}

export class NotificationsResponse {
  @ApiProperty({ isArray: true, type: NotificationInfo })
  notifications: NotificationInfo[];

  @ApiProperty({ example: 1 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;
}
