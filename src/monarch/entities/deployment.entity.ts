import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Deployment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  projectId!: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column()
  version!: string;

  @Column({ default: 'deploying' })
  status!: string; // deploying, success, failed, rolled_back

  @Column('simple-array', { nullable: true })
  logs!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  completedAt!: Date;
}
