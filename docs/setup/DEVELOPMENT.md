# House of Qui — Development Guide

## Quick Start

### Prerequisites
- **Node.js** 18+ 
- **PostgreSQL** 12+ (running locally or via Docker)
- **npm** or **yarn**

### Setup

1. **Install dependencies** (root and dashboard):
```bash
npm install
cd qui-dashboard && npm install && cd ..
```

2. **Configure database**:
Create a PostgreSQL database named `house_of_qui`:
```bash
createdb house_of_qui
```

Or use Docker:
```bash
docker run -d \
  --name qui-postgres \
  -e POSTGRES_PASSWORD=qui_the_great \
  -e POSTGRES_DB=house_of_qui \
  -p 5432:5432 \
  postgres:15
```

3. **Environment (optional)**:
Create a `.env` file in the root:
```
QUI_SECRET=your-custom-secret-key
```

---

## Running the System

### Start the Backend API Server (Port 4000)
```bash
npm run dev
```

This runs:
- NestJS API server (port 4000)
- TypeORM with PostgreSQL
- Bootstrap system initialization

### Start the Socket.IO Server (Port 3000)
In a separate terminal, from `src/server/server.ts`:
```bash
# The server currently runs within the bootstrap process
# It listens on port 3000 for dashboard connections
```

**Note**: Currently the socket server is initialized in `src/system/bootstrap.ts`. It will emit events when projects register.

### Start the Dashboard (Port 5173)
```bash
cd qui-dashboard
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Phase H — Autonomous Projects (Current)

### Registering a Project

Use the `qui init` CLI command to register a new project:

```bash
npm run qui -- init \
  --name "My Project" \
  --description "My awesome project" \
  --repository "https://github.com/user/project" \
  --version "1.0.0"
```

Output:
```
Project registered:
{ id: 'uuid...', name: 'My Project', ... }
Service token (store this securely):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### What Happens When You Register

1. **Backend registers project**:
   - Creates persistent record in PostgreSQL (`Project` entity)
   - Registers in in-memory registry for fast lookup
   - Generates a service token (JWT, 7-day expiry)

2. **Dashboard receives event**:
   - Socket.io broadcasts `project_registered` event
   - Dashboard listens and refreshes project list
   - New project appears in the **ProjectTable** component

3. **Telemetry ready**:
   - Project can send heartbeats using the token
   - Observatory tracks project health

---

## Project Structure

```
house-of-qui/
├── src/
│   ├── app.module.ts           # Nest root module
│   ├── main.ts                 # Entry point
│   ├── cli/
│   │   └── commands/
│   │       ├── init.ts         # 🆕 `qui init` command
│   │       ├── projects.ts     # List projects
│   │       └── status.ts       # System status
│   ├── monarch/
│   │   ├── monarch.controller.ts  # 🔄 Updated: emits socket on register
│   │   ├── monarch.service.ts     # CRUD service
│   │   ├── monarch.module.ts      # Provides TelemetryBroadcaster
│   │   └── entities/project.entity.ts
│   ├── observatory/
│   │   ├── telemetryStore.ts      # In-memory telemetry cache
│   │   ├── telemetryBroadcaster.ts # 🆕 Socket.io client for emitting events
│   │   └── telemetryTypes.ts
│   ├── registry/
│   │   ├── projectRegistry.ts     # Registry singleton
│   │   └── projectTypes.ts
│   ├── security/
│   │   ├── tokenService.ts        # JWT generation & verification
│   │   └── authMiddleware.ts
│   ├── server/
│   │   └── server.ts              # Socket.io server (port 3000)
│   └── system/
│       └── bootstrap.ts           # System initialization
│
└── qui-dashboard/
    └── src/
        ├── pages/
        │   └── Dashboard.tsx       # 🔄 Updated: listens for project_registered
        ├── components/
        │   ├── ProjectTable.tsx    # 🔄 Updated: better styling
        │   ├── ObservatoryPanel.tsx # 🔄 Updated: shows registrations + telemetry
        │   └── SystemHealth.tsx
        ├── api/
        │   ├── client.ts           # Axios instance (port 4000)
        │   └── socket.ts           # Socket.io client (port 3000)
        └── types/project.ts        # Project interface
```

---

## API Endpoints

### Projects

- `POST /monarch/projects` — Create project
- `GET /monarch/projects` — List all projects
- `GET /monarch/projects/:id` — Get project by ID
- **`POST /monarch/projects/register`** — 🆕 Register & get token

**Example: Register a project via API**
```bash
curl -X POST http://localhost:4000/monarch/projects/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nexus A06",
    "description": "Android tools",
    "repository": "https://github.com/user/nexus",
    "version": "0.1.0"
  }'
```

Response:
```json
{
  "project": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "name": "Nexus A06",
    "description": "Android tools",
    "status": "active",
    "createdAt": "2026-03-12T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## CLI Commands

### `qui status`
Check system health:
```bash
npm run qui -- status
```

### `qui projects`
List all registered projects:
```bash
npm run qui -- projects
```

### `qui init` (Phase H)
Register a new project:
```bash
npm run qui -- init --name "My Project"
```

---

## Socket Events

### Server → Dashboard

- **`project_registered`** — New project registered
  ```json
  {
    "projectId": "uuid",
    "name": "Project Name",
    "version": "1.0.0",
    "timestamp": "2026-03-12T10:00:00Z"
  }
  ```

- **`telemetry_update`** — Project sent heartbeat
  ```json
  {
    "projectId": "uuid",
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2026-03-12T10:00:00Z"
  }
  ```

### Dashboard → Server

- **`connect`** — Dashboard connected
- **`disconnect`** — Dashboard disconnected

---

## Debugging

### View logs
```bash
# Backend logs (NestJS)
npm run dev

# Dashboard console
# Open DevTools (F12) → Console tab
```

### Test API directly
```bash
# Get projects
curl http://localhost:4000/monarch/projects

# Register a project
curl -X POST http://localhost:4000/monarch/projects/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","version":"0.1.0"}'
```

### Reset database
```bash
# Drop and recreate
dropdb house_of_qui
createdb house_of_qui
npm run dev  # TypeORM will sync schema
```

---

## What's Next (Phase I+)

- **Phase I** — Plugin architecture for extensibility
- **Phase J** — Deployment system (`qui deploy`)
- **Phase K** — Enhanced monitoring (CPU, memory, logs)
- **Phase L** — Package registry (`qui install house/auth`)

---

## Troubleshooting

### Dashboard shows "No projects registered yet"
- Ensure backend API is running on port 4000: `npm run dev`
- Check browser console for network errors
- Verify CORS is enabled (should be in server.ts)

### `qui init` fails with "ECONNREFUSED"
- Backend API must be running: `npm run dev`
- Check if port 4000 is in use: `lsof -i :4000`
- Database must be running: `psql -U postgres -d house_of_qui`

### Socket events not showing in Observatory
- Dashboard must connect to socket server on port 3000
- Check `qui-dashboard/src/api/socket.ts` baseURL
- Ensure backend socket server is initialized in bootstrap

### TypeORM sync errors
- Verify PostgreSQL is running and accessible
- Check `src/app.module.ts` for correct credentials
- View error logs in terminal running `npm run dev`

---

## Development Workflow

1. **Make changes** to backend (src/) or frontend (qui-dashboard/src/)
2. **Backend auto-reloads** via ts-node-dev (watch mode)
3. **Dashboard auto-reloads** via Vite HMR
4. **Test via CLI** or dashboard UI
5. **Check socket events** in Observatory panel

---
