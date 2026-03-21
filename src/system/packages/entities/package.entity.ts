import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Package {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    namespace!: string; // e.g. "house"

    @Column()
    name!: string; // e.g. "auth"

    @Column()
    version!: string; // e.g. "1.0.0"

    @Column({ nullable: true })
    description!: string;

    @Column({ nullable: true })
    author!: string;

    @Column('simple-array', { nullable: true })
    tags!: string[];

    @Column({ default: 'stable' })
    stability!: string; // stable, beta, experimental

    @Column({ nullable: true, type: 'text' })
    readme!: string;

    @Column({ default: 0 })
    downloads!: number;

    @Column({ nullable: true, type: 'text' })
    publicKey!: string;

    @Column({ nullable: true, type: 'text' })
    signature!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
