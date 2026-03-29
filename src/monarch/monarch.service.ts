import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Deployment } from './entities/deployment.entity';
import { PluginRegistry } from '../system/plugins/registry';
import { TelemetryBroadcaster } from '../modules/observatory/telemetryBroadcaster';
import { AuditService } from '../system/audit/audit.service';
import { ArchiveService } from './archive/archive.service';

@Injectable()
export class MonarchService {
  private projectsCache: Project[] | null = null;

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Deployment)
    private deploymentRepository: Repository<Deployment>,
    private pluginRegistry: PluginRegistry,
    private telemetryBroadcaster: TelemetryBroadcaster,
    private auditService: AuditService,
    private archiveService: ArchiveService
  ) { }

  async createProject(name: string, description: string, publicKey?: string, signature?: string): Promise<Project> {
    const project = this.projectRepository.create({
      name,
      description,
      publicKey,
      signature
    });

    const savedProject = await this.projectRepository.save(project);
    this.projectsCache = null; // Invalidate cache

    await this.auditService.recordAction({
      action: 'PROJECT_CREATED',
      targetId: savedProject.id,
      metadata: { name: savedProject.name, signed: !!signature },
      level: 'info'
    });

    return savedProject;
  }

  async getAllProjects(): Promise<Project[]> {
    if (this.projectsCache) return this.projectsCache;
    this.projectsCache = await this.projectRepository.find();
    return this.projectsCache;
  }

  async getProjectById(id: string): Promise<Project | null> {
    if (this.projectsCache) {
      const p = this.projectsCache.find(x => x.id === id);
      if (p) return p;
    }
    return this.projectRepository.findOneBy({ id });
  }

  async deployProject(projectId: string, version: string): Promise<Deployment> {
    const project = await this.getProjectById(projectId);
    if (!project) throw new NotFoundException('Project not found');

    const deploymentPlugin = this.pluginRegistry.getPlugin('deployment');
    if (!deploymentPlugin || !deploymentPlugin.config.enabled) {
      throw new Error('Deployment plugin is disabled or not found');
    }

    const deploymentService = deploymentPlugin.getServices().get('deploymentService');
    if (!deploymentService) throw new Error('Deployment service not available');

    let deployment = this.deploymentRepository.create({
      projectId,
      version,
      status: 'deploying',
      logs: []
    });
    deployment = await this.deploymentRepository.save(deployment);

    // Broadcast to dashboard live feed
    this.telemetryBroadcaster.broadcastDeploymentStarted(
      projectId, project.name, version, deployment.id
    );

    await this.auditService.recordAction({
      action: 'DEPLOYMENT_STARTED',
      actor: projectId,
      targetId: deployment.id,
      metadata: { projectName: project.name, version },
      level: 'info'
    });

    // Simulate async deployment process calling the plugin
    setTimeout(async () => {
      try {
        const result = await deploymentService.deploy(projectId, version);

        deployment.status = result.status;
        deployment.logs = deployment.logs || [];
        deployment.logs.push(`Initiated deployment via plugin (id: ${result.deploymentId})`);
        await this.deploymentRepository.save(deployment);

        // Wait another 3s then complete
        setTimeout(async () => {
          const finalStatus = await deploymentService.getDeploymentStatus(result.deploymentId);
          deployment.status = finalStatus.status;
          deployment.logs.push(...(finalStatus.logs || []));
          deployment.completedAt = new Date();
          await this.deploymentRepository.save(deployment);
        }, 3000);

      } catch (err: any) {
        deployment.status = 'failed';
        deployment.logs = deployment.logs || [];
        deployment.logs.push(`Error: ${err.message}`);
        deployment.completedAt = new Date();
        await this.deploymentRepository.save(deployment);
      }
    }, 1000);

    return deployment;
  }

  async getProjectDeployments(projectId: string): Promise<Deployment[]> {
    return this.deploymentRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' }
    });
  }

  async rollbackToArtifact(projectId: string, artifactId: string): Promise<Deployment> {
    const artifact = await this.archiveService.getArtifact(artifactId);
    if (artifact.projectId !== projectId) {
      throw new Error('Artifact does not belong to this project');
    }

    await this.auditService.recordAction({
      action: 'CORE_ROLLBACK_INITIATED',
      actor: projectId,
      targetId: artifactId,
      metadata: { version: artifact.version, filename: artifact.filename },
      level: 'warning'
    });

    // A rollback is essentially a re-deployment of a specifically archived version
    return this.deployProject(projectId, artifact.version);
  }
}