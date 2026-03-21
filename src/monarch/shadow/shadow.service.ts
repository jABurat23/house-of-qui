import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { AuditService } from '../../system/audit/audit.service';
import { TelemetryBroadcaster } from '../../modules/observatory/telemetryBroadcaster';
import { WatchtowerService } from '../../system/watchtower/watchtower.service';
import { IsaService } from '../../system/security/isa.service';
import { logger } from '../../core/logger';

@Injectable()
export class ShadowService implements OnModuleInit {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        private auditService: AuditService,
        private telemetryBroadcaster: TelemetryBroadcaster,
        private watchtowerService: WatchtowerService,
        private isaService: IsaService
    ) { }

    async onModuleInit() {
        await this.seedHoneypots();
    }

    private async seedHoneypots() {
        // Mock honeypots removed for production environment.
    }

    async reportIntrusion(projectId: string, action: string, metadata: any) {
        const project = await this.projectRepository.findOneBy({ id: projectId });
        if (!project || !project.isShadow) return;

        logger.security(`Shadow project ${project.name} was accessed! Action: ${action}`);

        await this.auditService.recordAction({
            action: 'SHADOW_INTRUSION_DETECTED',
            actor: 'ANONYMOUS_SCANNER',
            targetId: projectId,
            metadata: {
                projectName: project.name,
                action,
                ...metadata,
                seal: this.isaService.signMandate({ projectName: project.name, action, ...metadata })
            },
            level: 'critical'
        });

        // Broadcast security alert
        this.telemetryBroadcaster.broadcastSecurityAlert({
            type: 'SHADOW_ACCESS',
            severity: 'critical',
            message: `Unauthorized access to Shadow Project: ${project.name}`,
            projectName: project.name,
            action
        });

        // Emit Watchtower Alert
        await this.watchtowerService.triggerAlert('SHADOW_INTRUSION_DETECTED', {
            projectName: project.name,
            action,
            targetId: projectId
        });
    }
}
