import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity()
export class SystemConfig {
    @PrimaryColumn()
    key!: string;

    @Column({ type: 'text' })
    value!: string;

    @Column({ default: 'string' })
    type!: 'string' | 'number' | 'boolean' | 'json';

    @Column({ nullable: true })
    description!: string;

    @Column({ default: 'general' })
    category!: string;

    @UpdateDateColumn()
    updatedAt!: Date;
}
