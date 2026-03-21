# ✅ Phase I — Plugin Architecture — Complete

**Timestamp:** 2026-03-14

## Overview

Phase I introduces a **flexible, extensible plugin system** that allows House of Qui to be enhanced without modifying core code. Plugins can:

- 🔌 **Hook into system lifecycle** (onLoad, onEnable, onDisable, onUnload)
- 📦 **Expose services** to other plugins and APIs
- 📡 **Emit/listen to events** system-wide
- 🔑 **Access core APIs** (logger, config, registry, services)
- 🎯 **Declare dependencies** on other plugins

---

## What's Built

### Core Plugin System

| Component | File | Status |
|-----------|------|--------|
| Plugin Interface | `src/plugins/base.ts` | ✅ Complete |
| Plugin Registry | `src/plugins/registry.ts` | ✅ Complete |
| Event Emitter | `src/plugins/base.ts` | ✅ Complete |
| Nest Module | `src/plugins/plugin.module.ts` | ✅ Complete |
| API Endpoints | `src/plugins/plugin.controller.ts` | ✅ Complete |

### Example Plugins

| Plugin | Purpose | File | Status |
|--------|---------|------|--------|
| **Deployment** | Manage project deployments & rollbacks | `src/plugins/deployment/` | ✅ Complete |
| **Metrics** | Collect system & app metrics | `src/plugins/metrics/` | ✅ Complete |

### Dashboard Integration

| Component | File | Status |
|-----------|------|--------|
| PluginsPanel | `qui-dashboard/src/components/PluginsPanel.tsx` | ✅ Complete |
| Dashboard Update | `qui-dashboard/src/pages/Dashboard.tsx` | ✅ Complete |

---

## API Endpoints (Phase I)

### Plugin Management
```
GET    /plugins                    # List all plugins
GET    /plugins/:id                # Get plugin details
POST   /plugins/:id/enable         # Enable plugin
POST   /plugins/:id/disable        # Disable plugin
GET    /plugins/configs/all        # Get all plugin configs
```

### Example Response
```json
{
  "id": "deployment",
  "name": "Deployment Plugin",
  "version": "1.0.0",
  "description": "Manages project deployments and releases",
  "author": "House of Qui",
  "enabled": true
}
```

---

## Plugin Features

### 🎯 Lifecycle Hooks
Each plugin implements:
```typescript
async onLoad()     // Plugin initialized
async onEnable()   // Plugin becomes active
async onDisable()  // Plugin paused
async onUnload()   // Plugin cleanup
```

### 🔧 Service Registration
Plugins expose services:
```typescript
registerService('myService', { 
  method1: () => {},
  method2: () => {} 
});

// Accessed via:
api.services.get('deployment:deploymentService')
```

### 📡 Event System
Plugins communicate via events:
```typescript
// Listen
api.events.on('plugin:registered', (config) => {});

// Emit
api.events.emit('my:event', { data: 'value' });
```

### 📍 Dependency Management
Plugins declare dependencies:
```json
{
  "id": "alerts",
  "dependencies": ["metrics", "notifications"]
}
```

---

## Built-in Plugins

### 📦 Deployment Plugin
**Purpose:** Manage project deployments and rollbacks

**Services:**
- `deploy(projectId, version, options?)` → Deploy a project
- `getDeploymentStatus(deploymentId)` → Check deployment status  
- `rollback(projectId, version)` → Rollback to previous version

**Events:**
- `deployment:ready` → Plugin fully initialized

### 📊 Metrics Plugin
**Purpose:** Collect system and application metrics

**Services:**
- `getSystemMetrics()` → CPU, memory, uptime data
- `getProjectMetrics(projectId)` → Project-specific metrics
- `recordMetric(projectId, metric, value)` → Record metrics

**Events:**
- `metrics:ready` → Plugin fully initialized
- `metric:recorded` → New metric recorded

---

## Dashboard Plugin UI

The dashboard now displays a **PluginsPanel** component showing:
- ✅ List of all installed plugins
- 🔄 Real-time enable/disable toggle
- 📝 Plugin metadata (name, version, author description)
- 🔄 Refresh button to reload plugin state

Located at bottom dashboard (side-by-side with Observatory panel).

---

## Creating a Plugin (Guide)

### 1️⃣ Create Structure
```bash
mkdir -p src/plugins/my-plugin
echo '{}' > src/plugins/my-plugin/plugin.json
touch src/plugins/my-plugin/my-plugin.ts
```

### 2️⃣ Define Metadata (plugin.json)
```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "What it does",
  "author": "You",
  "enabled": true
}
```

### 3️⃣ Implement Plugin
```typescript
import { BasePlugin, IPluginConfig, IPluginAPI } from '../base';

export class MyPlugin extends BasePlugin {
  async onLoad() {
    await super.onLoad();
    this.registerService('myService', {
      doWork: () => 'Result'
    });
  }

  async onEnable() {
    await super.onEnable();
    this.api.events.emit('my-plugin:ready');
  }
}
```

### 4️⃣ Register in System
Add to `src/plugins/registry.ts` `loadAllPlugins()`:
```typescript
this.registerPlugin(new MyPlugin(
  require('./my-plugin/plugin.json'),
  this.api
));
```

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                  House of Qui Phase I                     │
│                   Plugin Architecture                     │
└──────────────────────────────────────────────────────────┘

┌─────────────────────┐
│  PluginRegistry     │ ◄─── Manages all plugins
├─────────────────────┤
│ + registerPlugin()  │
│ + enablePlugin()    │
│ + disablePlugin()   │
│ + getPlugin()       │
│ + listPlugins()     │
└─────────────────────┘
         ▲
         │
    ┌────┴────┬────────┬─────────┐
    │          │        │         │
    ▼          ▼        ▼         ▼
┌─────────┐ ┌─────────┐ ┌──────────┐
│Base     │ │Event    │ │Plugin    │
│Plugin   │ │Emitter  │ │API       │
│(ABC)    │ │         │ │Interface │
└─────────┘ └─────────┘ └──────────┘

    │  ◄─── Extended by
    │
    ├─► DeploymentPlugin
    ├─► MetricsPlugin
    ├─► [Your Plugin]
    └─► [More Plugins]

┌──────────────────────────────────┐
│      NestJS API                  │
│   PluginController               │
│   GET/POST /plugins/:id/*        │
└──────────────────────────────────┘
         ▲
         │
┌──────────────────────────────────┐
│   Dashboard UI (React)           │
│   PluginsPanel Component         │
│   • List plugins                 │
│   • Toggle enable/disable        │
└──────────────────────────────────┘
```

---

## Testing Plugins

### Via Dashboard
1. Open http://localhost:5173/
2. Scroll to "🔌 Plugin System" panel
3. View all plugins with enable/disable toggles

### Via API
```bash
# List plugins
curl http://localhost:4000/plugins

# Get plugin details
curl http://localhost:4000/plugins/deployment

# Enable plugin
curl -X POST http://localhost:4000/plugins/deployment/enable

# Disable plugin
curl -X POST http://localhost:4000/plugins/deployment/disable
```

### Via CLI (Future)
```bash
npm run qui -- plugins list
npm run qui -- plugins enable deployment
npm run qui -- plugins disable deployment
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **BasePlugin abstract class** | Enforces lifecycle contracts; avoids boilerplate |
| **Service registry pattern** | Loose coupling between plugins; easy discovery |
| **Event emitter system** | Decoupled communication; easy to extend |
| **Dependency declaration** | Prevents loading order issues; clear contracts |
| **API injection** | Plugins get exactly what they need; testable |
| **Manual registration** | (Temporary) Keeps code simple until dynamic requires work in TS |

---

## Next Steps (Phase J — Deployments)

With plugins established, Phase J will:
- 🚀 Implement full deployment plugin capabilities
- 🐳 Add Docker integration for containerized deployments
- 🔄 Wire CI/CD pipeline hooks
- 📋 Create deployment history & rollback UI

Plugin provides foundation for:
- Deployment strategies (canary, blue-green, rolling)
- Rollback mechanisms
- Health checks during deployment
- Multi-environment support

---

## Future Plugin Ideas

- **Notifications** — Send alerts on events
- **Analytics** — Track usage and performance
- **Backup** — Automated project backups
- **Security** — Secrets management, encryption
- **Monitoring** — Advanced health checks
- **Database** — Schema migrations, backups
- **Cache** — Redis integration
- **Queue** — Async job processing
- **Storage** — S3, cloud storage
- **Logging** — Centralized logging (ELK, Datadog)

---

## Phase I Summary

✅ **Extensible architecture** — Add features without touching core  
✅ **Clear interfaces** — Plugins know what they can do  
✅ **Lifecycle management** — Control when plugins run  
✅ **Service discovery** — Plugins find each other  
✅ **Event-driven** — Loose coupling between components  
✅ **Dashboard UI** — Manage plugins visually  
✅ **Two example plugins** — Deployment & Metrics  
✅ **REST API** — Programmatic plugin control  

**Ready to build deployment system (Phase J)** 🚀
