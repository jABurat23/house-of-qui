import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AlertChannel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  type!: 'webhook' | 'email' | 'discord';

  @Column()
  endpoint!: string;

  @Column({ default: true })
  enabled!: boolean;

  @Column({ type: 'simple-array' })
  subscribedEvents!: string[]; // e.g., 'SECURITY_INTRUSION', 'HEALTH_FAILURE', 'QUOTA_VIOLATION'

  @CreateDateColumn()
  createdAt!: Date;
}
