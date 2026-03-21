import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity()
export class CreditTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Wallet)
  wallet!: Wallet;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column()
  type!: 'debit' | 'credit';

  @Column()
  description!: string;

  @Column({ nullable: true })
  resourceType?: string; // memory, cpu, storage

  @CreateDateColumn()
  timestamp!: Date;
}
