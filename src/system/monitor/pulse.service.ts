import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as os from 'os';
import { logger } from '../../core/logger';
import { PluginRegistry } from '../plugins/registry';

@Injectable()
export class PulseMonitorService implements OnModuleInit, OnModuleDestroy {
  private timer: NodeJS.Timeout | null = null;
  private checkInterval = 30000; // 30 seconds for non-intrusive heartbeat

  constructor(
    private readonly dataSource: DataSource,
    private readonly pluginRegistry: PluginRegistry,
  ) { }

  onModuleInit() {
    this.startPulse();
    logger.monarch("Imperial Pulse Monitor initialized.");
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private startPulse() {
    this.timer = setInterval(async () => {
      await this.performDiagnostics();
    }, this.checkInterval);
  }

  private async performDiagnostics() {
    const status: any = {
      db: 'OK',
      metrics: 'OFFLINE',
      memory: 'STABLE',
    };

    // 1. Check DB Connection
    try {
      await this.dataSource.query('SELECT 1');
    } catch (e) {
      status.db = 'FAILED';
    }

    // 2. Check Metrics Plugin
    const plugin = this.pluginRegistry.getPlugin('metrics');
    if (plugin && plugin.config.enabled) {
      status.metrics = 'ACTIVE';
    }

    // 3. Heartbeat log
    const dbLabel = status.db === 'OK' ? '\x1b[32m●\x1b[0m' : '\x1b[31m✖\x1b[0m';
    const metricsLabel = status.metrics === 'ACTIVE' ? '\x1b[32m●\x1b[0m' : '\x1b[38;5;220m●\x1b[0m';

    logger.system(`Heartbeat: DB ${dbLabel}  METRICS ${metricsLabel}  LOAD ${os.loadavg()[0].toFixed(2)}`);
    
    if (status.db === 'FAILED') {
        logger.error("Imperial Database Link severed. Emergency recovery required.");
    }
  }
}
