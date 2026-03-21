import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Project } from '../../entities/project.entity';

@Entity()
export class ProjectChronicle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Project, { nullable: true })
  @JoinColumn()
  project?: Project;

  @Column({ type: 'text' })
  content!: string; // Markdown documentation

  @Column({ type: 'text', nullable: true })
  diagram!: string; // Mermaid diagram source

  @Column({ type: 'jsonb', nullable: true })
  metadata!: any; // Methods, imports, summary

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
