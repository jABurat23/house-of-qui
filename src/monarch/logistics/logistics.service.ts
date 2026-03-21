import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceQuota } from '../entities/quota.entity';
import { Project } from '../entities/project.entity';
import { AuditService } from '../../system/audit/audit.service';
import { TelemetryBroadcaster } from '../../modules/observatory/telemetryBroadcaster';
import { WatchtowerService } from '../../system/watchtower/watchtower.service';
import { logger } from '../../core/logger';

@Injectable()
export class LogisticsService implements OnModuleInit {
    constructor(
        @InjectRepository(ResourceQuota)
        private quotaRepository: Repository<ResourceQuota>,
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        private auditService: AuditService,
        private telemetryBroadcaster: TelemetryBroadcaster,
        private watchtowerService: WatchtowerService
    ) { }

    async onModuleInit() {
        await this.seedAllQuotas();
        // Manual usage reports only.
    }

    private async seedAllQuotas() {
        const projects = await this.projectRepository.find();
        for (const p of projects) {
            const existing = await this.getQuota(p.id);
            if (!existing) {
                await this.createDefaultQuota(p.id);
                logger.logistics(`Quota established for ${p.name}`);
            }
        }
    }

    async createDefaultQuota(projectId: string) {
        const project = await this.projectRepository.findOneBy({ id: projectId });
        if (!project) return;

        const quota = this.quotaRepository.create({ project });
        return this.quotaRepository.save(quota);
    }

    async getQuota(projectId: string) {
        return this.quotaRepository.findOne({
            where: { project: { id: projectId } },
            relations: ['project']
        });
    }

    async updateQuota(projectId: string, updates: Partial<ResourceQuota>) {
        const quota = await this.getQuota(projectId);
        if (!quota) throw new Error('Quota not found');

        Object.assign(quota, updates);
        const saved = await this.quotaRepository.save(quota);

        await this.auditService.recordAction({
            action: 'RESOURCE_QUOTA_UPDATED',
            actor: 'SYSTEM',
            targetId: projectId,
            metadata: updates,
            level: 'warning'
        });

        return saved;
    }

    async checkDeploymentFeasibility(projectId: string, estimatedMemory: number) {
        const quota = await this.getQuota(projectId);
        if (!quota) return true;

        if (estimatedMemory > quota.memoryLimit) {
            await this.auditService.recordAction({
                action: 'DEPLOYMENT_BLOCKED_BY_QUOTA',
                actor: 'SYSTEM',
                targetId: projectId,
                metadata: { requested: estimatedMemory, limit: quota.memoryLimit, resource: 'memory' },
                level: 'critical'
            });

            await this.watchtowerService.triggerAlert('DEPLOYMENT_BLOCKED_BY_QUOTA', {
                projectId,
                requested: estimatedMemory,
                limit: quota.memoryLimit
            });

            return false;
        }

        return true;
    }

    async broadcastLiveUsage() {
        const quotas = await this.quotaRepository.find({ relations: ['project'] });

        for (const quota of quotas) {
            // Simulate real-time usage metrics centered around 40-70% of quota
            const usage = {
                memory: Math.floor(quota.memoryLimit * (0.4 + Math.random() * 0.3)),
                cpu: Math.floor(quota.cpuLimit * (0.2 + Math.random() * 0.5)),
                storage: Math.floor(quota.storageLimit * (0.6 + Math.random() * 0.1)),
            };

            this.telemetryBroadcaster.broadcastResourceUsage(quota.project.id, quota.project.name, usage, {
                memory: quota.memoryLimit,
                cpu: quota.cpuLimit,
                storage: quota.storageLimit
            });
        }
    }
}
