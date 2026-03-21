import { Injectable, OnModuleInit } from '@nestjs/common';
import { RecoveryService } from '../../monarch/recovery/recovery.service';
import { MonarchService } from '../../monarch/monarch.service';
import { TelemetryBroadcaster } from '../../modules/observatory/telemetryBroadcaster';
import { SystemConfigService } from '../config/config.service';
import { WatchtowerService } from '../watchtower/watchtower.service';

@Injectable()
export class SentryService implements OnModuleInit {
    private checkInterval: NodeJS.Timeout | null = null;

    constructor(
        private monarchService: MonarchService,
        private recoveryService: RecoveryService,
        private telemetryBroadcaster: TelemetryBroadcaster,
        private configService: SystemConfigService,
        private watchtowerService: WatchtowerService
    ) { }

    onModuleInit() {
        // Manual health monitoring only.
    }

    startHealthMonitoring() {
        // Imperial Sentry manual activation required.
        console.log('📡 [Sentry] Imperial Sentry is on watch (Manual Mode).');
    }

    async checkAllProjects() {
        const projects = await this.monarchService.getAllProjects();

        for (const project of projects) {
            // Simulate real-time metrics
            const healthScore = Math.floor(Math.random() * 20) + 81; // 81-100%
            const status = healthScore > 90 ? 'Healthy' : 'Degraded';

            this.telemetryBroadcaster.broadcastHealthReport(project.id, project.name, status, healthScore);

            // Simulate a random health failure (5% chance) for demo purposes
            const isUnhealthy = Math.random() < 0.05;

            if (isUnhealthy && project.status !== 'recovering') {
                const autoRecoverEnabled = await this.configService.get('auto_recovery_enabled', true);

                if (!autoRecoverEnabled) {
                    console.warn(`⚠️ [Sentry] Project ${project.name} is unhealthy, but Auto-Recovery is disabled by mandate.`);
                    continue;
                }

                console.warn(`🚨 [Sentry] Project ${project.name} (${project.id}) is reporting CRITICAL failures!`);

                await this.watchtowerService.triggerAlert('HEALTH_FAILURE', {
                    projectId: project.id,
                    projectName: project.name,
                    cause: 'Anomalous behavior'
                });

                try {
                    await this.recoveryService.autoRecover(project.id, 'Detected anomalous biological/digital behavior');
                } catch (err) {
                    console.error(`❌ [Sentry] Failed to initiate auto-recovery for ${project.id}`);
                }
            }
        }
    }

    stopMonitoring() {
        if (this.checkInterval) clearInterval(this.checkInterval);
    }
}
