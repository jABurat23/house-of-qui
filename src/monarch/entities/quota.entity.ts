import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class ResourceQuota {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => Project)
    @JoinColumn()
    project!: Project;

    @Column({ default: 512 }) // MB
    memoryLimit!: number;

    @Column({ default: 1000 }) // millicores (1 CPU)
    cpuLimit!: number;

    @Column({ default: 1024 }) // MB
    storageLimit!: number;

    @Column({ default: 100 }) // Max concurrent requests/s
    requestRateLimit!: number;

    @Column({ default: 0 }) // MB — updated by real usage reporters
    usedMemory!: number;

    @Column({ default: 0 }) // millicores — updated by real usage reporters
    usedCpu!: number;

    @Column({ default: 0 }) // MB — updated by real usage reporters
    usedStorage!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
