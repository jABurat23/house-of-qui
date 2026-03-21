import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username: string = '';

  @Column()
  password: string = '';

  @ManyToOne(() => Role)
  role!: Role;
}