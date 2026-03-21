import { Module, OnModuleInit } from '@nestjs/common';
import { PluginRegistry } from './registry';
import { PluginController } from './plugin.controller';
import { PluginEventEmitter, IPluginAPI } from './base';
import { createDeploymentPlugin } from './deployment/deployment';
import { createMetricsPlugin } from './metrics/metrics';

@Module({
  providers: [PluginRegistry],
  controllers: [PluginController],
  exports: [PluginRegistry]
})
export class PluginModule implements OnModuleInit {
  constructor(private pluginRegistry: PluginRegistry) { }

  async onModuleInit() {
    // Initialize plugin system
    const api: IPluginAPI = {
      logger: console, // Will be replaced with proper logger
      config: new Map(),
      registry: null, // Will be set by bootstrap
      events: new PluginEventEmitter(),
      services: new Map()
    };

    await this.pluginRegistry.initialize(api);

    // Load plugins from disk
    try {
      await this.pluginRegistry.loadAllPlugins();

      // Manually register built-in plugins for now
      const deploymentPlugin = createDeploymentPlugin(api);
      this.pluginRegistry.registerPlugin(deploymentPlugin);
      await deploymentPlugin.onLoad();
      await this.pluginRegistry.enablePlugin('deployment');

      const metricsPlugin = createMetricsPlugin(api);
      this.pluginRegistry.registerPlugin(metricsPlugin);
      await metricsPlugin.onLoad();
      await this.pluginRegistry.enablePlugin('metrics');

    } catch (err) {
      console.error('Failed to load plugins:', err);
    }
  }
}
