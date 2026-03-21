import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MonarchService } from './monarch.service';
import { generateServiceToken } from '../system/security/tokenService';
import { registry } from '../registry/projectRegistry';
import { TelemetryBroadcaster } from '../modules/observatory/telemetryBroadcaster';
import { PluginRegistry } from '../system/plugins/registry';
import { SealService } from '../system/security/sealService';
import { SystemConfigService } from '../system/config/config.service';
import { ShadowService } from './shadow/shadow.service';
import { LogisticsService } from './logistics/logistics.service';

@Controller('monarch/projects')
export class MonarchController {
  constructor(
    private readonly monarchService: MonarchService,
    private readonly telemetryBroadcaster: TelemetryBroadcaster,
    private readonly pluginRegistry: PluginRegistry,
    private readonly configService: SystemConfigService,
    private readonly shadowService: ShadowService,
    private readonly logisticsService: LogisticsService
  ) { }

  @Post()
  async createProject(@Body() body: { name: string; description: string }) {
    const project = await this.monarchService.createProject(body.name, body.description);
    await this.logisticsService.createDefaultQuota(project.id);
    return project;
  }

  @Get()
  async getAllProjects() {
    return this.monarchService.getAllProjects();
  }

  @Get('system')
  async getSystemMetrics() {
    const metricsPlugin = this.pluginRegistry.getPlugin('metrics');
    if (!metricsPlugin || !metricsPlugin.config.enabled) {
      return { status: 'Metrics unavailable' };
    }
    const metricsService = metricsPlugin.getServices().get('metricsService');
    return metricsService.getSystemMetrics();
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    const project = await this.monarchService.getProjectById(id);
    if (project && project.isShadow) {
      await this.shadowService.reportIntrusion(id, 'GET_PROJECT_DETAILS', { ip: 'hidden' });
    }
    return project;
  }

  @Get(':id/metrics')
  async getProjectMetrics(@Param('id') id: string) {
    const project = await this.monarchService.getProjectById(id);
    if (project && project.isShadow) {
      await this.shadowService.reportIntrusion(id, 'GET_PROJECT_METRICS', { ip: 'hidden' });
    }

    const metricsPlugin = this.pluginRegistry.getPlugin('metrics');
    if (!metricsPlugin || !metricsPlugin.config.enabled) {
      return { status: 'Metrics unavailable' };
    }
    const metricsService = metricsPlugin.getServices().get('metricsService');
    return metricsService.getProjectMetrics(id);
  }

  @Post('register')
  async registerProject(@Body() body: {
    name: string;
    description?: string;
    repository?: string;
    version?: string;
    publicKey?: string;
    signature?: string;
  }) {
    // Check maintenance mode
    const isMaintenance = await this.configService.get('maintenance_mode', false);
    if (isMaintenance) {
      throw new Error('System is in maintenance mode. Actions restricted.');
    }

    // Check if registration is open
    const isOpen = await this.configService.get('registration_open', true);
    if (!isOpen) {
      throw new Error('Project registration is currently closed by Imperial Mandate.');
    }

    // Check seal enforcement
    const sealEnforced = await this.configService.get('seal_enforcement', false);
    if (sealEnforced && (!body.signature || !body.publicKey)) {
      throw new Error('The Great Seal is mandatory. Unsigned registration rejected.');
    }

    // Verify signature if provided
    if (body.signature && body.publicKey) {
      const dataToVerify = SealService.canonicalize({
        name: body.name,
        description: body.description || '',
        repository: body.repository || '',
        version: body.version || '0.0.0'
      });

      const isValid = SealService.verify(dataToVerify, body.signature, body.publicKey);
      if (!isValid) {
        throw new Error('Invalid project signature');
      }
    }

    // create persistent project record
    const project = await this.monarchService.createProject(
      body.name,
      body.description || '',
      body.publicKey,
      body.signature
    );

    // establish resource quota
    await this.logisticsService.createDefaultQuota(project.id);

    // register in in-memory registry for quick discovery
    try {
      registry.register({
        id: project.id,
        name: project.name,
        description: project.description,
        repository: body.repository,
        version: body.version || '0.0.0',
        status: (project as any).status || 'active',
        createdAt: project.createdAt
      });
    } catch (e) {
      // swallow registry errors for now
    }

    // issue a long-lived service token tied to this project id
    const token = generateServiceToken(project.id);

    // broadcast registration event to dashboard via socket
    this.telemetryBroadcaster.broadcastProjectRegistered(
      project.id,
      project.name,
      body.version || '0.0.0'
    );

    return {
      project,
      token
    };

  }

  @Post(':id/deploy')
  async deployProject(@Param('id') id: string, @Body() body: { version: string }) {
    return this.monarchService.deployProject(id, body.version || 'latest');
  }

  @Get(':id/deployments')
  async getProjectDeployments(@Param('id') id: string) {
    return this.monarchService.getProjectDeployments(id);
  }

  @Post(':id/rollback')
  async rollbackProject(@Param('id') id: string, @Body() body: { artifactId: string }) {
    return this.monarchService.rollbackToArtifact(id, body.artifactId);
  }
}