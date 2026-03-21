import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ default: 'active' })
  status!: string;

  @Column({ default: false })
  isShadow!: boolean;

  @Column({ default: 'OPERATOR' })
  requiredRole!: string; // OPERATOR, ARCHIVIST, OVERSEER

  @Column({ nullable: true, type: 'text' })
  publicKey!: string;

  @Column({ nullable: true, type: 'text' })
  signature!: string;

  @CreateDateColumn()
  createdAt!: Date;
}