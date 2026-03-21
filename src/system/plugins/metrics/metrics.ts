import { BasePlugin, IPluginConfig, IPluginAPI } from '../base';
import * as os from 'os';

export class MetricsPlugin extends BasePlugin {
  private metrics: Map<string, any> = new Map();

  constructor(config: IPluginConfig, api: IPluginAPI) {
    super(config, api);
  }

  async onLoad(): Promise<void> {
    await super.onLoad();

    this.registerService('metricsService', {
      getSystemMetrics: this.getSystemMetrics.bind(this),
      getProjectMetrics: this.getProjectMetrics.bind(this),
      recordMetric: this.recordMetric.bind(this)
    });

    this.api.logger.info('Metrics service registered');
  }

  async onEnable(): Promise<void> {
    await super.onEnable();

    // Collect immediately, then every 5s
    this.collectSystemMetrics();
    setInterval(() => {
      this.collectSystemMetrics();
    }, 5000);

    this.api.events.emit('metrics:ready');
  }

  private collectSystemMetrics() {
    const cpuUsage = os.loadavg();
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();

    const data = {
      cpu: {
        load1m: cpuUsage[0],
        load5m: cpuUsage[1],
        load15m: cpuUsage[2]
      },
      memory: {
        heapUsed: memUsage.heapUsed / 1024 / 1024,
        heapTotal: memUsage.heapTotal / 1024 / 1024,
        external: memUsage.external / 1024 / 1024,
        rss: memUsage.rss / 1024 / 1024,
        systemTotal: totalMem / 1024 / 1024,
        systemFree: freeMem / 1024 / 1024,
        systemUsed: (totalMem - freeMem) / 1024 / 1024,
        systemUsedPct: Math.round((1 - freeMem / totalMem) * 100)
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
    this.metrics.set('system', data);
    return data;
  }

  async getSystemMetrics() {
    return this.metrics.get('system') || this.collectSystemMetrics();
  }

  async getProjectMetrics(projectId: string) {
    return (
      this.metrics.get(`project:${projectId}`) || {
        projectId,
        requests: 0,
        errors: 0,
        latency: 0,
        uptime: 0
      }
    );
  }

  async recordMetric(projectId: string, metric: string, value: number) {
    const key = `project:${projectId}`;
    const current = this.metrics.get(key) || {};
    current[metric] = value;
    this.metrics.set(key, current);

    this.api.events.emit('metric:recorded', { projectId, metric, value });
  }
}

export function createMetricsPlugin(api: IPluginAPI) {
  const config: IPluginConfig = require('./plugin.json');
  return new MetricsPlugin(config, api);
}
