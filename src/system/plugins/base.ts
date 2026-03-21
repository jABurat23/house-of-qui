/**
 * Plugin interface and base classes
 * Defines the contract all House plugins must implement
 */

export interface IPluginConfig {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: string;
  dependencies?: string[];
  enabled?: boolean;
}

export interface IPluginAPI {
  logger: any;
  config: Map<string, any>;
  registry: any;
  events: PluginEventEmitter;
  services: Map<string, any>;
}

export interface IPlugin {
  config: IPluginConfig;
  api: IPluginAPI;

  // Lifecycle hooks
  onLoad(): Promise<void>;
  onEnable(): Promise<void>;
  onDisable(): Promise<void>;
  onUnload(): Promise<void>;

  // Plugin must expose its services
  getServices(): Map<string, any>;
}

export class PluginEventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, handler: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  off(event: string, handler: Function) {
    if (!this.listeners.has(event)) return;
    const handlers = this.listeners.get(event)!;
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  emit(event: string, data?: any) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.forEach(handler => {
      try {
        handler(data);
      } catch (err) {
        console.error(`Error in event handler for ${event}:`, err);
      }
    });
  }
}

/**
 * Base class for all House plugins
 * Plugins extend this class and implement required methods
 */
export abstract class BasePlugin implements IPlugin {
  config: IPluginConfig;
  api: IPluginAPI;
  protected services: Map<string, any> = new Map();

  constructor(config: IPluginConfig, api: IPluginAPI) {
    this.config = config;
    this.api = api;
  }

  async onLoad(): Promise<void> {
    this.api.logger.info(`Plugin ${this.config.id} loaded`);
  }

  async onEnable(): Promise<void> {
    this.api.logger.info(`Plugin ${this.config.id} enabled`);
  }

  async onDisable(): Promise<void> {
    this.api.logger.info(`Plugin ${this.config.id} disabled`);
  }

  async onUnload(): Promise<void> {
    this.api.logger.info(`Plugin ${this.config.id} unloaded`);
  }

  getServices(): Map<string, any> {
    return this.services;
  }

  /**
   * Helper: Register a service exposed by this plugin
   */
  protected registerService(name: string, service: any) {
    this.services.set(name, service);
    this.api.services.set(`${this.config.id}:${name}`, service);
  }

  /**
   * Helper: Get service from another plugin
   */
  protected getService(pluginId: string, serviceName: string): any {
    return this.api.services.get(`${pluginId}:${serviceName}`);
  }
}
