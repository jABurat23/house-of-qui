import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectArtifact } from '../entities/artifact.entity';
import * as fs from 'fs';
import * as path from 'path';
import { AuditService } from '../../system/audit/audit.service';

@Injectable()
export class ArchiveService {
    private readonly storagePath = path.join(process.cwd(), 'imperial_archive');

    constructor(
        @InjectRepository(ProjectArtifact)
        private artifactRepository: Repository<ProjectArtifact>,
        private auditService: AuditService,
    ) {
        if (!fs.existsSync(this.storagePath)) {
            fs.mkdirSync(this.storagePath, { recursive: true });
        }
    }

    async createArtifact(projectId: string, version: string, filename: string, buffer: Buffer): Promise<ProjectArtifact> {
        const projectDir = path.join(this.storagePath, projectId);
        if (!fs.existsSync(projectDir)) {
            fs.mkdirSync(projectDir, { recursive: true });
        }

        const filePath = path.join(projectDir, `${version}_${filename}`);
        fs.writeFileSync(filePath, buffer);

        const artifact = this.artifactRepository.create({
            projectId,
            version,
            filename,
            path: filePath,
            size: buffer.length,
            status: 'active'
        });

        const saved = await this.artifactRepository.save(artifact);

        await this.auditService.recordAction({
            action: 'ARTIFACT_UPLOADED',
            actor: projectId,
            targetId: saved.id,
            metadata: { version, filename, size: buffer.length },
            level: 'info'
        });

        return saved;
    }

    async getArtifactsByProject(projectId: string): Promise<ProjectArtifact[]> {
        return this.artifactRepository.find({
            where: { projectId },
            order: { createdAt: 'DESC' }
        });
    }

    async getArtifact(id: string): Promise<ProjectArtifact> {
        const artifact = await this.artifactRepository.findOneBy({ id });
        if (!artifact) throw new NotFoundException('Artifact not found');
        return artifact;
    }
}
