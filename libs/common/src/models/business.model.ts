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
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Business Email',
    example: 'beduevents@gmail.com',
  })
  email: string;

  @Column({
    nullable: false,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'New email address e.g tundeomotayo11@gmail.com.',
  })
  newEmail: string;

  @Column({
    default: '',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Business Send From Email',
    example: 'beduevents@tryinvia.com',
  })
  sendFromEmail: string;

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    example: '+2348054618649',
    description: 'Phone number',
  })
  phone: string;

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

  @Column({
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Activation code by e.g 5492',
  })
  activationCode: string;

  @Column({
    default: null,
    nullable: true,
    type: 'timestamp',
  })
  @ApiPropertyOptional({
    description: 'Activation code expires by e.g 2024-11-10_T_11:29:22',
  })
  activationCodeExpires: Date;

  @OneToMany(() => Account, (account) => account.business, {
    eager: true,
  })
  members: Account[];

  @OneToOne(() => Account, {
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
    description: 'Business email',
  })
  email: string;

  @ApiProperty({
    example: '',
    description: 'Business phone',
  })
  phone: string;

  @ApiProperty({
    example: '',
    description: 'Business avatar URL',
  })
  avatar: string;
}
