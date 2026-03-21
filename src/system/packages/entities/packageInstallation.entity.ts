import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class PackageInstallation {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    packageId!: string;

    @Column()
    projectId!: string;

    @Column()
    version!: string;

    @CreateDateColumn()
    installedAt!: Date;
}
