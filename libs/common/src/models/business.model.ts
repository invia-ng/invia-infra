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
    nullable: true,
    default: '',
  })
  @ApiPropertyOptional({
    description: 'Business avatar URL',
    example: 'https://media.s3.amazonaws.com/avatars/avatar.png',
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
