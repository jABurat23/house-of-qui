import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    action!: string; // e.g., "PROJECT_REGISTERED", "DEPLOYMENT_STARTED", "PACKAGE_INSTALLED"

    @Column({ nullable: true })
    actor!: string; // ID of the project/user who performed the action

    @Column({ nullable: true })
    targetId!: string; // ID of the affected entity

    @Column({ type: 'json', nullable: true })
    metadata!: any; // Additional details (serialized JSON)

    @Column({ default: 'info' })
    level!: string; // info, warning, error, critical

    @Column({ nullable: true })
    ipAddress!: string;

    @CreateDateColumn()
    timestamp!: Date;
}
