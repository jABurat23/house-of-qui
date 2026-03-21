import { Injectable } from '@nestjs/common';
import { MonarchService } from '../monarch.service';
import { AuditService } from '../../system/audit/audit.service';
import { ArchiveService } from '../archive/archive.service';

@Injectable()
export class RecoveryService {
    constructor(
        private monarchService: MonarchService,
        private auditService: AuditService,
        private archiveService: ArchiveService
    ) { }

    async autoRecover(projectId: string, reason: string) {
        console.warn(`🚨 [Recovery] Auto-recovery triggered for ${projectId}. Reason: ${reason}`);

        await this.auditService.recordAction({
            action: 'AUTO_RECOVERY_TRIGGERED',
            actor: 'SYSTEM',
            targetId: projectId,
            metadata: { reason },
            level: 'critical'
        });

        // Find the last known STABLE artifact for this project
        const artifacts = await this.archiveService.getArtifactsByProject(projectId);
        const stableArtifact = artifacts.find(a => a.status === 'active'); // For now, just the latest active one

        if (stableArtifact) {
            console.log(`🛡️ [Recovery] Rolling back project ${projectId} to v${stableArtifact.version}`);
            return this.monarchService.rollbackToArtifact(projectId, stableArtifact.id);
        } else {
            console.error(`❌ [Recovery] No artifacts found to recover project ${projectId}`);
            throw new Error('No recovery artifacts available');
        }
    }
}
