import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ImperialCommand {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  targetProjectId!: string;

  @Column()
  command!: string;

  @Column({ type: 'json', nullable: true })
  args?: any;

  @Column({ default: 'pending' })
  status!: 'pending' | 'executing' | 'completed' | 'failed';

  @Column({ type: 'text', nullable: true })
  output?: string;

  @Column({ type: 'text', nullable: true })
  error?: string;

  @Column({ nullable: true })
  executedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
