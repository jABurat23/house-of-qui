# Phase H — Autonomous Project System

## What is Phase H?

Projects can now **self-organize** by registering with the House of Qui. They run `qui init` and automatically:
- Register with the House
- Get a unique service token
- Connect to telemetry
- Appear on the Imperial Dashboard in real-time

---

## Implementation Summary

### New Files
- **`src/cli/commands/init.ts`** — `qui init` CLI command
- **`src/observatory/telemetryBroadcaster.ts`** — Socket.io broadcaster service

### Updated Files
- **`src/cli/cli.ts`** — Registered the `init` command
- **`src/monarch/monarch.controller.ts`** — Added `/register` endpoint + socket emission
- **`src/monarch/monarch.module.ts`** — Provides `TelemetryBroadcaster` service
- **`qui-dashboard/src/pages/Dashboard.tsx`** — Listens for `project_registered` events
- **`qui-dashboard/src/components/ProjectTable.tsx`** — Enhanced with styling + id preview
- **`qui-dashboard/src/components/ObservatoryPanel.tsx`** — Shows both registrations & telemetry

---

## How It Works

### Step 1: Project Calls `qui init`

```bash
npm run qui -- init \
  --name "Nexus A06" \
  --description "Android tools" \
  --repository "https://github.com/user/nexus" \
  --version "0.1.0"
```

### Step 2: Backend Processes Registration

```
CLI → API (port 4000) 
  → MonarchController.registerProject()
    → MonarchService.createProject() [save to DB]
    → registry.register() [in-memory]
    → generateServiceToken() [JWT, 7-day expiry]
    → telemetryBroadcaster.broadcastProjectRegistered()
      → Socket.io (port 3000) emits "project_registered"
```

### Step 3: Dashboard Receives Event (Real-Time)

```
Socket.io Server (port 3000)
  → broadcasts "project_registered" event
    → Dashboard.tsx listens & calls GET /monarch/projects
      → ProjectTable refreshes & displays new project
      → ObservatoryPanel shows registration in event log
```

### Step 4: Project Stores Token

```
Response to CLI:
{
  "project": { id, name, version, ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Project saves token for:
- Authentication with House APIs
- Telemetry heartbeats
- Future deployments
```

---

## API Reference

### POST `/monarch/projects/register`

**Request:**
```json
{
  "name": "My Project",
  "description": "Optional description",
  "repository": "https://github.com/user/repo",
  "version": "1.0.0"
}
```

**Response:**
```json
{
  "project": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "My Project",
    "description": "Optional description",
    "status": "active",
    "createdAt": "2026-03-12T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0IjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwiaWF0IjoxNzEwMjAwMDAwLCJleHAiOjE3MTA4MDQwMDB9..."
}
```

**Status Codes:**
- `201` — Project registered successfully
- `400` — Bad request (missing/invalid fields)
- `500` — Server error

---

## CLI Reference

### `qui init`

Register a new project and receive a service token.

**Usage:**
```bash
npm run qui -- init [OPTIONS]
```

**Options:**
- `-n, --name <name>` — Project name (default: "unnamed-project")
- `-d, --description <description>` — Project description
- `-r, --repository <repository>` — Repository URL
- `-v, --version <version>` — Project version (default: "0.0.0")

**Example:**
```bash
npm run qui -- init \
  --name "Portfolio App" \
  --description "My portfolio website" \
  --repository "https://github.com/user/portfolio" \
  --version "1.2.3"
```

**Output:**
```
Project registered:
{
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  name: 'Portfolio App',
  description: 'My portfolio website',
  status: 'active',
  createdAt: 2026-03-12T10:00:00.000Z
}
Service token (store this securely):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Socket Events

### `project_registered`

Emitted when a new project registers. Dashboard listens and auto-refreshes.

**Payload:**
```json
{
  "projectId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "Portfolio App",
  "version": "1.2.3",
  "timestamp": "2026-03-12T10:00:00Z"
}
```

### `telemetry_update`

Emitted when a project sends a heartbeat (from `POST /projects/telemetry` — not yet wired).

**Payload:**
```json
{
  "projectId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status": "healthy",
  "version": "1.2.3",
  "timestamp": "2026-03-12T10:00:00Z"
}
```

---

## Testing Phase H

### Quick Test

1. **Start backend:**
   ```bash
   npm run dev
   ```

2. **Start dashboard:**
   ```bash
   cd qui-dashboard && npm run dev
   ```

3. **Open dashboard:**
   - Browser: [http://localhost:5173](http://localhost:5173)

4. **Register a project (new terminal):**
   ```bash
   npm run qui -- init \
     --name "Test Project" \
     --version "0.1.0"
   ```

5. **Watch dashboard:**
   - New project appears in the **ProjectTable**
   - Registration event logs in **ObservatoryPanel**

---

## Data Flow Diagram

```
CLI Terminal
    |
    v
[qui init --name "Nexus"]
    |
    | HTTP POST
    v
NestJS API (4000)
    |
    +---> MonarchController
             |
             +---> MonarchService.create() ---> PostgreSQL DB
             |
             +---> registry.register() ---> In-Memory Map
             |
             +---> generateServiceToken() ---> JWT (7 days)
             |
             +---> TelemetryBroadcaster
                      |
                      | Socket.io Client
                      v
                   Socket.io Server (3000)
                      |
                      | broadcast
                      v
                   Dashboard Socket.io Client
                      |
                      v
                   [project_registered event]
                      |
                      v
                   Dashboard.tsx refresh
                      |
                      v
                   ProjectTable + ObservatoryPanel update
```

---

## Next Steps (Phase I+)

### Phase I — Plugin Architecture
- Plugins installed: `qui install house/auth`
- Enables extensibility without core rewrites

### Phase J — Deployment System
- `qui deploy nexus-a06`
- Docker integration
- CI/CD pipeline support

### Phase K — Enhanced Observatory V2
- Track CPU, memory, errors, latency
- Full DevOps monitoring dashboard

### Phase L — House Package System
- `qui install house/logger`
- Private package registry for shared libraries

---

## Troubleshooting

### Token not issued
- Check database is running: `psql -d house_of_qui`
- Check API logs for errors in `npm run dev` terminal

### Dashboard doesn't refresh on registration
- Verify socket server is running (should see "House of Qui Core running" in logs)
- Check browser console for socket.io connection errors
- Verify CORS is set up correctly in socket.io server

### Project not appearing in table
- Check MongoDB/PostgreSQL connection
- Try refreshing dashboard manually (F5)
- Check developer console (F12) for network errors

---

## Security Notes

- **Service tokens** are JWT-based, 7-day expiry
- **Store tokens securely** — treat like API keys
- Tokens are tied to `projectId` in the payload
- **Future**: Add token rotation and revocation endpoints
- **Future**: Encrypt tokens at rest in database

---
