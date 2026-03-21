import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum ImperialRole {
  MONARCH = 'monarch',
  MINISTER = 'minister',
  OBSERVER = 'observer'
}

@Entity('imperial_identities')
export class ImperialUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  imperialName: string = '';

  @Column()
  houseKey: string = ''; // Argon2 hashed

  @Column({
    type: 'enum',
    enum: ImperialRole,
    default: ImperialRole.OBSERVER
  })
  role: ImperialRole = ImperialRole.OBSERVER;

  @Column({ default: 1 })
  clearanceLevel: number = 1;

  @CreateDateColumn()
  grantedAt: Date = new Date();
}
