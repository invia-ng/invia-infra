import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Billing {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    default: 0,
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 100,
    description: 'Price per email',
  })
  pricePerEmail: number;

  @Column({
    default: 0,
    nullable: true,
  })
  @ApiPropertyOptional({
    example: 100,
    description: 'Price per whatsapp message',
  })
  pricePerWhatsappMessage: number;

  @Column({
    default: false,
    nullable: true,
  })
  @ApiPropertyOptional({
    example: false,
    description: 'Is enabled',
  })
  isEnabled: boolean;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}