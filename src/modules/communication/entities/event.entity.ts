import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ImperialEvent {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    sourceProjectId!: string;

    @Column()
    eventType!: string; // e.g., 'DATA_SYNC', 'HEARTBEAT', 'USER_ACTION'

    @Column({ type: 'jsonb', nullable: true })
    payload!: any;

    @Column({ default: 'broadcast' })
    targetType!: string; // broadcast, direct

    @Column({ nullable: true })
    targetProjectId?: string;

    @CreateDateColumn()
    createdAt!: Date;
}
