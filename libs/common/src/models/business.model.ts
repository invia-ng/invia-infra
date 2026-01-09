import {
  Index,
  Column,
  Entity,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Account } from './account.model';
import { Subscription } from './subscription.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Business {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 'Invia Events',
    description: 'Business Name',
  })
  name: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Business avatar URL',
    example:
      'https://res.cloudinary.com/dt0epuz7w/image/upload/v1767799379/event_ypdcrh.png',
  })
  avatar: string;

  @OneToMany(() => Account, (account) => account.business)
  members: Account[];

  @OneToOne(() => Account, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'account' })
  account: Account;

  @OneToMany(() => Subscription, (subscription) => subscription.business)
  subscriptions: Subscription[];

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

export class BusinessInfo {
  @ApiProperty({
    example: '1',
    description: 'Business ID',
  })
  id: string;

  @ApiProperty({
    example: '',
    description: 'Business name',
  })
  name: string;

  @ApiProperty({
    example: '',
    description: 'Business avatar URL',
  })
  avatar: string;
}
