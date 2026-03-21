import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class ProjectArtifact {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    projectId!: string;

    @Column()
    version!: string;

    @Column()
    filename!: string;

    @Column()
    path!: string;

    @Column()
    size!: number;

    @Column({ nullable: true })
    checksum!: string;

    @Column({ default: 'active' })
    status!: string; // active, archived, deleted

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Project)
    project!: Project;
}
