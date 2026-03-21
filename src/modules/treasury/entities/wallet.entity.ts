import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from '../../../monarch/entities/project.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Project)
  @JoinColumn()
  project!: Project;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 1000.00 })
  balance!: number;

  @Column({ default: 'standard' })
  tier!: string; // standard, premium, legacy

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
