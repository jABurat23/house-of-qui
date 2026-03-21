import { Injectable } from '@nestjs/common';
import { BasePlugin, IPlugin, IPluginConfig, IPluginAPI, PluginEventEmitter } from './base';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PluginRegistry {
  private plugins: Map<string, IPlugin> = new Map();
  private configs: Map<string, IPluginConfig> = new Map();
  private eventEmitter: PluginEventEmitter = new PluginEventEmitter();
  private pluginsDir: string;
  private api!: IPluginAPI;

  constructor() {
    this.pluginsDir = path.join(process.cwd(), 'src/plugins');
  }

  /**
   * Initialize the plugin system with core API
   */
  async initialize(api: IPluginAPI) {
    this.api = api;
    api.events = this.eventEmitter;
    console.log('🔌 Plugin registry initialized');
  }

  /**
   * Load all plugins from the plugins directory
   */
  async loadAllPlugins() {
    const pluginDirs = this.getPluginDirectories();

    for (const dir of pluginDirs) {
      try {
        await this.loadPlugin(dir);
      } catch (err) {
        console.error(`Failed to load plugin from ${dir}:`, err);
      }
    }

    console.log(`✅ Loaded ${this.plugins.size} plugins`);
  }

  /**
   * Load a specific plugin from directory
   */
  async loadPlugin(pluginPath: string) {
    const configPath = path.join(pluginPath, 'plugin.json');

    if (!fs.existsSync(configPath)) {
      throw new Error(`No plugin.json found in ${pluginPath}`);
    }

    const config: IPluginConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    this.configs.set(config.id, config);

    // Check dependencies
    if (config.dependencies) {
      for (const dep of config.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Plugin ${config.id} depends on ${dep} which is not loaded`);
        }
      }
    }

    // Dynamically require the plugin module
    const mainPath = path.join(pluginPath, config.id + '.ts');
    if (!fs.existsSync(mainPath)) {
      throw new Error(`Plugin main file not found: ${mainPath}`);
    }

    // For TypeScript, we'd typically use dynamic import
    // For now, plugins must be manually registered
    console.log(`📦 Plugin ${config.id} loaded from manifest`);
  }

  /**
   * Register a plugin instance (called by plugins)
   */
  registerPlugin(plugin: IPlugin) {
    const id = plugin.config.id;

    if (this.plugins.has(id)) {
      throw new Error(`Plugin ${id} is already registered`);
    }

    this.plugins.set(id, plugin);
    this.eventEmitter.emit('plugin:registered', plugin.config);
    console.log(`✅ Plugin ${id} (v${plugin.config.version}) registered`);
  }

  /**
   * Enable a plugin
   */
  async enablePlugin(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    await plugin.onEnable();
    this.eventEmitter.emit('plugin:enabled', pluginId);
    console.log(`✨ Plugin ${pluginId} enabled`);
  }

  /**
   * Disable a plugin
   */
  async disablePlugin(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    await plugin.onDisable();
    this.eventEmitter.emit('plugin:disabled', pluginId);
    console.log(`⏸️  Plugin ${pluginId} disabled`);
  }

  /**
   * Get plugin by ID
   */
  getPlugin(pluginId: string): IPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * List all plugins
   */
  listPlugins(): Array<{ config: IPluginConfig; plugin: IPlugin }> {
    return Array.from(this.plugins.values()).map(plugin => ({
      config: plugin.config,
      plugin
    }));
  }

  /**
   * Get all plugin configs
   */
  getPluginConfigs(): IPluginConfig[] {
    return Array.from(this.configs.values());
  }

  /**
   * Get plugin directories from plugins folder
   */
  private getPluginDirectories(): string[] {
    if (!fs.existsSync(this.pluginsDir)) {
      fs.mkdirSync(this.pluginsDir, { recursive: true });
      return [];
    }

    return fs
      .readdirSync(this.pluginsDir)
      .map(dir => path.join(this.pluginsDir, dir))
      .filter(dir => fs.statSync(dir).isDirectory());
  }
}
