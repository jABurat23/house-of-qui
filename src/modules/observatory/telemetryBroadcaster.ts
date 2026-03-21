import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { AuditGateway } from '../../system/audit/audit.gateway';

@Injectable()
export class TelemetryBroadcaster {
  constructor(
    @Inject(forwardRef(() => AuditGateway))
    private auditGateway: AuditGateway
  ) {}

  broadcastProjectRegistered(projectId: string, name: string, version: string) {
    this.auditGateway.server?.emit('project_registered', {
      projectId,
      name,
      version,
      timestamp: new Date()
    });
  }

  broadcastTelemetryUpdate(projectId: string, status: string, version: string) {
    this.auditGateway.server?.emit('telemetry_update', {
      projectId,
      status,
      version,
      timestamp: new Date()
    });
  }

  broadcastDeploymentStarted(projectId: string, name: string, version: string, deploymentId: string) {
    this.auditGateway.server?.emit('deployment_started', {
      projectId,
      name,
      version,
      status: 'deploying',
      deploymentId,
      timestamp: new Date()
    });
  }

  broadcastHealthReport(projectId: string, name: string, status: string, score: number) {
    this.auditGateway.server?.emit('health_report', {
      projectId,
      name,
      status,
      score,
      timestamp: new Date()
    });
  }

  broadcastSecurityAlert(alert: any) {
    this.auditGateway.server?.emit('security_alert', {
      ...alert,
      timestamp: new Date()
    });
  }

  broadcastResourceUsage(projectId: string, name: string, usage: any, limits: any) {
    this.auditGateway.server?.emit('resource_usage', {
      projectId,
      name,
      usage,
      limits,
      timestamp: new Date()
    });
  }

  broadcastWalletUpdate(projectId: string, balance: number, lastTx: any) {
    this.auditGateway.server?.emit('wallet_update', {
      projectId,
      balance,
      lastTransaction: lastTx,
      timestamp: new Date()
    });
  }

  broadcastAlert(alert: any) {
    this.auditGateway.server?.emit('system_alert', {
      ...alert,
      timestamp: new Date()
    });
  }
}

