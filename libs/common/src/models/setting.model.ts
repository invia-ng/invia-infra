import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({
    nullable: true,
    default: false,
  })
  isSMTPEnabled: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  isKibaMailEnabled: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  isResendAPIEnabled: boolean;

  @Column({
    default: 0,
    nullable: true,
  })
  position: number;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
