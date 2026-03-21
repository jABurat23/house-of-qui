import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PluginRegistry } from './registry';

@Controller('plugins')
export class PluginController {
  constructor(private pluginRegistry: PluginRegistry) {}

  @Get()
  async listPlugins() {
    const plugins = this.pluginRegistry.listPlugins();
    return plugins.map(p => ({
      id: p.config.id,
      name: p.config.name,
      version: p.config.version,
      description: p.config.description,
      author: p.config.author,
      enabled: p.config.enabled !== false
    }));
  }

  @Get(':id')
  async getPlugin(@Param('id') id: string) {
    const plugin = this.pluginRegistry.getPlugin(id);
    if (!plugin) {
      return { error: 'Plugin not found' };
    }

    return {
      id: plugin.config.id,
      name: plugin.config.name,
      version: plugin.config.version,
      description: plugin.config.description,
      author: plugin.config.author,
      dependencies: plugin.config.dependencies || [],
      services: Array.from(plugin.getServices().keys())
    };
  }

  @Post(':id/enable')
  async enablePlugin(@Param('id') id: string) {
    try {
      await this.pluginRegistry.enablePlugin(id);
      return { status: 'enabled', pluginId: id };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  @Post(':id/disable')
  async disablePlugin(@Param('id') id: string) {
    try {
      await this.pluginRegistry.disablePlugin(id);
      return { status: 'disabled', pluginId: id };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  @Get('configs/all')
  async getPluginConfigs() {
    return this.pluginRegistry.getPluginConfigs();
  }
}
