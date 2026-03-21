import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Package } from './entities/package.entity';
import { PackageInstallation } from './entities/packageInstallation.entity';
import { SealService } from '../security/sealService';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PackagesService {
    constructor(
        @InjectRepository(Package)
        private packageRepository: Repository<Package>,
        @InjectRepository(PackageInstallation)
        private installationRepository: Repository<PackageInstallation>,
        private auditService: AuditService,
    ) { }

    async findAll(query?: string): Promise<Package[]> {
        if (query) {
            return this.packageRepository.find({
                where: [
                    { name: Like(`%${query}%`) },
                    { namespace: Like(`%${query}%`) },
                    { description: Like(`%${query}%`) },
                ],
            });
        }
        return this.packageRepository.find();
    }

    async findOne(namespace: string, name: string): Promise<Package> {
        const pkg = await this.packageRepository.findOne({
            where: { namespace, name },
        });
        if (!pkg) throw new NotFoundException(`Package @${namespace}/${name} not found`);
        return pkg;
    }

    async install(projectId: string, namespace: string, name: string, version: string): Promise<PackageInstallation> {
        const pkg = await this.findOne(namespace, name);

        // In a real system, we'd verify version compatibility

        const installation = this.installationRepository.create({
            projectId,
            packageId: pkg.id,
            version: version || pkg.version,
        });

        // Increment downloads
        pkg.downloads += 1;
        await this.packageRepository.save(pkg);

        const savedInstallation = await this.installationRepository.save(installation);

        await this.auditService.recordAction({
            action: 'PACKAGE_INSTALLED',
            actor: projectId,
            targetId: savedInstallation.id,
            metadata: { package: `@${namespace}/${name}`, version: savedInstallation.version },
            level: 'info'
        });

        return savedInstallation;
    }

    async getProjectPackages(projectId: string): Promise<PackageInstallation[]> {
        return this.installationRepository.find({
            where: { projectId },
        });
    }

    async seedPackages() {
        const count = await this.packageRepository.count();
        if (count > 0) return;

        // Generate a temporary key for seeding
        const { publicKey, privateKey } = SealService.generateKeyPair();

        const initialPackages = [
            {
                namespace: 'house',
                name: 'auth',
                version: '1.2.0',
                description: 'Imperial identity and authentication middleware',
                author: 'Monarch',
                tags: ['security', 'identity', 'auth'],
                stability: 'stable',
                readme: '# House Auth\nThe standard authentication layer for all Qui projects.',
            },
            {
                namespace: 'house',
                name: 'logging',
                version: '2.0.1',
                description: 'High-performance logging system with observatory integration',
                author: 'Monarch',
                tags: ['utils', 'observatory'],
                stability: 'stable',
                readme: '# House Logging\nStandardized logging for the Empire.',
            },
            {
                namespace: 'house',
                name: 'database',
                version: '0.9.5',
                description: 'Universal database connector with auto-migration support',
                author: 'Monarch',
                tags: ['data', 'orm'],
                stability: 'beta',
                readme: '# House Database\nConnecting projects to the Imperial data stores.',
            },
            {
                namespace: 'experimental',
                name: 'automatax',
                version: '0.1.0',
                description: 'AI-driven automation workflows',
                author: 'Horizon',
                tags: ['ai', 'automation'],
                stability: 'experimental',
                readme: '# Automatax\nBeyond human-driven automation.',
            },
        ];

        for (const pkgData of initialPackages) {
            const dataToSign = SealService.canonicalize({
                namespace: pkgData.namespace,
                name: pkgData.name,
                version: pkgData.version,
                description: pkgData.description
            });

            const signature = SealService.sign(dataToSign, privateKey);

            const pkg = this.packageRepository.create({
                ...pkgData,
                publicKey,
                signature
            });
            await this.packageRepository.save(pkg);
        }
    }
}
