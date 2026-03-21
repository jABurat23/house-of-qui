# Phase I — Plugin Architecture — Implementation Guide

## System Architecture

The plugin system allows the House of Qui to extend its capabilities without modifying core code. Plugins can:
- Hook into system lifecycle (onLoad, onEnable, onDisable, onUnload)
- Expose services to other plugins and the API
- Emit and listen to events
- Access core APIs (logger, config, registry, services)

## Plugin Structure

### Directory Layout
```
src/plugins/
├── base.ts                    # Plugin interface & abstract class
├── registry.ts                # Plugin registry & loader
├── plugin.module.ts           # Nest module
├── plugin.controller.ts        # API endpoints
├── deployment/
│   ├── plugin.json            # Metadata
│   └── deployment.ts          # Implementation
└── metrics/
    ├── plugin.json            # Metadata
    └── metrics.ts             # Implementation
```

### Plugin Manifest (plugin.json)

```json
{
  "id": "deployment",
  "name": "Deployment Plugin",
  "version": "1.0.0",
  "description": "Manages project deployments and releases",
  "author": "House of Qui",
  "dependencies": [],
  "enabled": true
}
```

### Plugin Implementation

```typescript
import { BasePlugin, IPluginConfig, IPluginAPI } from '../base';

export class DeploymentPlugin extends BasePlugin {
  constructor(config: IPluginConfig, api: IPluginAPI) {
    super(config, api);
  }

  async onLoad(): Promise<void> {
    await super.onLoad();
    
    // Register services
    this.registerService('deploymentService', {
      deploy: this.deploy.bind(this),
      rollback: this.rollback.bind(this)
    });
  }

  async onEnable(): Promise<void> {
    await super.onEnable();
    // Start functionality
    this.api.events.emit('deployment:ready');
  }

  async deploy(projectId: string, version: string) {
    // Implementation
    return { projectId, version, status: 'deploying' };
  }

  async rollback(projectId: string, version: string) {
    // Implementation
    return { projectId, version, status: 'rolled_back' };
  }
}
```

## API Endpoints

### List All Plugins
```bash
GET http://localhost:4000/plugins
```

Response:
```json
[
  {
    "id": "deployment",
    "name": "Deployment Plugin",
    "version": "1.0.0",
    "description": "Manages project deployments and releases",
    "author": "House of Qui",
    "enabled": true
  },
  {
    "id": "metrics",
    "name": "Metrics Plugin",
    "version": "1.0.0",
    "description": "Collects and exposes system and application metrics",
    "enabled": true
  }
]
```

### Get Plugin Details
```bash
GET http://localhost:4000/plugins/deployment
```

Response:
```json
{
  "id": "deployment",
  "name": "Deployment Plugin",
  "version": "1.0.0",
  "description": "Manages project deployments and releases",
  "author": "House of Qui",
  "dependencies": [],
  "services": ["deploymentService"]
}
```

### Enable Plugin
```bash
POST http://localhost:4000/plugins/deployment/enable
```

Response:
```json
{
  "status": "enabled",
  "pluginId": "deployment"
}
```

### Disable Plugin
```bash
POST http://localhost:4000/plugins/deployment/disable
```

Response:
```json
{
  "status": "disabled",
  "pluginId": "deployment"
}
```

### Get Plugin Configs
```bash
GET http://localhost:4000/plugins/configs/all
```

## Plugin System Interfaces

### BasePlugin

All plugins extend `BasePlugin` and must implement:

```typescript
abstract class BasePlugin implements IPlugin {
  config: IPluginConfig;
  api: IPluginAPI;
  
  // Lifecycle hooks (override these)
  async onLoad(): Promise<void>;
  async onEnable(): Promise<void>;
  async onDisable(): Promise<void>;
  async onUnload(): Promise<void>;
  
  // Service management
  getServices(): Map<string, any>;
  protected registerService(name: string, service: any);
  protected getService(pluginId: string, serviceName: string): any;
}
```

### PluginEventEmitter

Plugins communicate via event emitter:

```typescript
// Listen to events
api.events.on('deployment:ready', () => {
  // Handle deployment ready
});

// Emit events
api.events.emit('my:event', { data: 'value' });
```

### IPluginAPI

Each plugin receives this API interface:

```typescript
interface IPluginAPI {
  logger: any;                    // Logging service
  config: Map<string, any>;       // Plugin-specific config
  registry: any;                  // Project registry (core)
  events: PluginEventEmitter;     // Event bus
  services: Map<string, any>;     // All registered services
}
```

Access services:
```typescript
const deployment = this.api.services.get('deployment:deploymentService');
const metrics = this.api.services.get('metrics:metricsService');
```

## Built-in Plugins

### Deployment Plugin

Manages project deployments and rollbacks.

**Services:**
- `deploy(projectId, version, options?)` — Deploy a project
- `getDeploymentStatus(deploymentId)` — Check deployment status
- `rollback(projectId, version)` — Rollback to previous version

**Events:**
- `deployment:ready` — Plugin fully initialized

### Metrics Plugin

Collects system and application metrics.

**Services:**
- `getSystemMetrics()` — Get CPU, memory, uptime data
- `getProjectMetrics(projectId)` — Get project-specific metrics
- `recordMetric(projectId, metric, value)` — Record a metric value

**Events:**
- `metrics:ready` — Plugin fully initialized
- `metric:recorded` — New metric recorded

## Creating a Custom Plugin

### Step 1: Create Plugin Directory
```bash
mkdir -p src/plugins/my-plugin
```

### Step 2: Create plugin.json
```json
{
  "id": "my-plugin",
  "name": "My Custom Plugin",
  "version": "1.0.0",
  "description": "My plugin description",
  "author": "My Name",
  "dependencies": ["deployment"],
  "enabled": true
}
```

### Step 3: Create Plugin Class
```typescript
// src/plugins/my-plugin/my-plugin.ts
import { BasePlugin, IPluginConfig, IPluginAPI } from '../base';

export class MyPlugin extends BasePlugin {
  async onLoad() {
    await super.onLoad();
    this.registerService('myService', {
      doSomething: () => 'Hello from my plugin!'
    });
  }

  async onEnable() {
    await super.onEnable();
    this.api.events.emit('my-plugin:ready');
  }
}

export function createMyPlugin(api: IPluginAPI) {
  const config: IPluginConfig = require('./plugin.json');
  return new MyPlugin(config, api);
}
```

### Step 4: Register in PluginRegistry
In `src/plugins/registry.ts`, add manual registration in `loadAllPlugins()`:

```typescript
import { DeploymentPlugin } from './deployment/deployment';
import { MetricsPlugin } from './metrics/metrics';
import { MyPlugin } from './my-plugin/my-plugin';

async loadAllPlugins() {
  // ... existing code ...
  
  // Manual registration (until dynamic loading is fully implemented)
  this.registerPlugin(new DeploymentPlugin(
    require('./deployment/plugin.json'),
    this.api
  ));
  
  this.registerPlugin(new MetricsPlugin(
    require('./metrics/plugin.json'),
    this.api
  ));
  
  this.registerPlugin(new MyPlugin(
    require('./my-plugin/plugin.json'),
    this.api
  ));
}
```

## Plugin Dependencies

Plugins can depend on other plugins. Dependencies are checked at load time:

```json
{
  "id": "alerts",
  "dependencies": ["metrics", "notifications"]
}
```

The registry will fail to load the plugin if dependencies aren't already loaded.

Access dependency services:
```typescript
// In AlertPlugin
const metrics = this.getService('metrics', 'metricsService');
const notifier = this.getService('notifications', 'notificationService');
```

## Testing Your Plugin

### Via CLI
```bash
# List all plugins
npm run qui -- plugins

# Get plugin status
npm run qui -- plugins status deployment
```

### Via API
```bash
# List plugins
curl http://localhost:4000/plugins

# Get plugin
curl http://localhost:4000/plugins/deployment

# Enable plugin
curl -X POST http://localhost:4000/plugins/deployment/enable

# Disable plugin
curl -X POST http://localhost:4000/plugins/deployment/disable
```

### In Code
```typescript
// In any Nest service
constructor(private pluginRegistry: PluginRegistry) {}

someMethod() {
  const plugin = this.pluginRegistry.getPlugin('deployment');
  const service = plugin?.getServices().get('deploymentService');
  await service?.deploy('project-id', '1.0.0');
}
```

## Events System

Plugins can emit and listen to events system-wide:

```typescript
// Listen for project registration
this.api.events.on('plugin:registered', (config) => {
  console.log('Plugin registered:', config.name);
});

// Listen for deployment events
this.api.events.on('deployment:started', (data) => {
  this.api.logger.info('Deployment started:', data);
});

// Emit custom events
this.api.events.emit('myEvent', { data: 'value' });
```

## Plugin Lifecycle

```
┌─────────────────────────────────────────┐
│         Plugin Lifecycle Flow           │
└─────────────────────────────────────────┘

System boots
    ↓
[onLoad]  → Plugin initializes and registers services
    ↓
Plugin registered event emitted
    ↓
API becomes available
    ↓
[onEnable]  → Plugin becomes active (periodic tasks start)
    ↓
Plugin is fully operational
    ↓
[onDisable]  → Plugin deactivated (tasks stop)
    ↓
[onUnload]  → Plugin cleanup
    ↓
Plugin removed from registry
```

## Future Enhancements

- [ ] Dynamic plugin loading from npm packages
- [ ] Plugin rollback and versioning
- [ ] Plugin marketplace & discovery
- [ ] Plugin isolation and sandboxing
- [ ] Plugin configuration UI in dashboard
- [ ] Plugin auto-restart on crash
- [ ] Plugin resource limits (CPU, memory)
- [ ] Plugin permission system

---

**Phase I implementation provides a foundation for extensible architecture** 🔌
