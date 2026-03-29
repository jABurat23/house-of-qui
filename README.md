# House of Qui

> *"The official system dynasty for premium, secure, and observable projects."*

---

## Imperial Court Hierarchy

<img width="1536" height="1024" alt="House of Qui Imperial Blueprint" src="https://github.com/user-attachments/assets/6b2f12c1-bb2f-483e-9239-e00bb0861372" />

| Rank | Module | Responsibility |
|------|--------|---------------|
| 👑 **Monarch** | `src/monarch/` | Supreme authority — core governance, API orchestration, project registry |
| ⚔️ **Right Minister** | `src/minister/` | Security, RBAC, vault, policy enforcement, ISA seal |
| 🔭 **Observatory** | `src/modules/observatory/` | Telemetry broadcasting, real-time event streaming |
| 🏛️ **System** | `src/system/` | Audit, plugins, packages, config, watchtower, pulse monitor |
| 🖥️ **Dashboard** | `qui-dashboard/` | Sovereign OS — React dashboard with URL-based navigation |

---

## Tech Stack

**Backend**
- [NestJS](https://nestjs.com/) — Imperial API core (port `4000`)
- [TypeORM](https://typeorm.io/) + PostgreSQL — Sovereign data persistence
- [Socket.io](https://socket.io/) — Real-time telemetry & audit broadcasting
- [Pino](https://getpino.io/) — Structured logging with themed terminal output
- `ts-node-dev` — Hot-reload development server

**Dashboard (`qui-dashboard/`)**
- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) — Frontend framework
- [React Router DOM](https://reactrouter.com/) — URL-based multi-chamber navigation
- [Framer Motion](https://www.framer.com/motion/) — Fluid transitions and animations
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- [Lucide React](https://lucide.dev/) — Imperial icon set

---

## Project Structure

```
house-of-qui/
├── README.md
├── package.json               # Backend scripts & deps
├── docs/                      # Architecture diagrams & phase chronicles
├── src/
│   ├── main.ts                # Entrypoint
│   ├── app.module.ts          # NestJS root module
│   ├── core/
│   │   └── logger.ts          # ImperialLogger — themed terminal output
│   ├── monarch/               # Project registry, deployments, rollbacks, archive
│   ├── minister/              # Right Minister — security, governance
│   ├── modules/
│   │   ├── command/           # Remote command execution
│   │   ├── communication/     # Imperial event bus
│   │   ├── observatory/       # Telemetry broadcasting
│   │   └── treasury/          # Imperial fiscal module
│   ├── system/
│   │   ├── audit/             # AuditLog service & real-time gateway
│   │   ├── auth/              # Authentication & session management
│   │   ├── config/            # System configuration (toggles, flags)
│   │   ├── monitor/           # Pulse Monitor (real-time diagnostics)
│   │   ├── packages/          # Package registry & seeding
│   │   ├── plugins/           # Plugin system (metrics, deployment)
│   │   ├── sentry/            # Intrusion detection & anomaly tracking
│   │   ├── security/          # ISA root seal, token signing
│   │   └── watchtower/        # Alert channels & event routing
│   └── registry/              # In-memory project discovery registry
└── qui-dashboard/             # Sovereign OS — React Dashboard
    └── src/
        ├── pages/
        │   ├── Throne.tsx         # Overview — sovereign metrics
        │   ├── WarCouncil.tsx     # Security — threat signals
        │   ├── Archives.tsx       # Grand Archives — audit logs
        │   ├── Treasury.tsx       # Fiscal overview
        │   ├── Forge.tsx          # Project forge & deployments
        │   ├── CommandCenter.tsx  # Remote command execution UI
        │   └── Settings.tsx       # Theme & session settings
        ├── layouts/
        │   └── CourtLayout.tsx    # Collapsible sidebar + chronicle drawer
        └── api/
            ├── client.ts          # Axios Imperial API client
            └── socket.ts          # Socket.io real-time client
```

---

## Getting Started

**Prerequisites:** Node.js 18+, PostgreSQL

### 1. Clone & Install

```bash
git clone https://github.com/jABurat23/house-of-qui.git
cd house-of-qui
npm install
cd qui-dashboard && npm install && cd ..
```

### 2. Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE house_of_qui;"
```

### 3. Run the System

```bash
# Terminal 1 — Imperial API (port 4000)
npm run dev

# Terminal 2 — Sovereign Dashboard (port 5173)
cd qui-dashboard && npm run dev
```

### 4. Access

| Service | URL |
|---------|-----|
| 🖥️ Dashboard | http://localhost:5173 |
| 🏛️ API Core | http://localhost:4000 |

---

## CLI — The `qui` Command

```bash
# Project management
qui project init
qui project update
qui status

# Deployment
qui deploy api

# Security
qui security audit
qui vault list

# Observability
qui monitor metrics
qui logs fetch

# Plugins
qui plugin install
```

---

## Dashboard Chambers

| Chamber | Path | Purpose |
|---------|------|---------|
| 👑 Throne | `/overview` | Sovereign metrics & project overview |
| 🖥️ Command Center | `/command` | Remote command execution |
| ⚔️ War Council | `/security` | Security events & threat signals |
| 📜 Grand Archives | `/archives` | Audit log history |
| 💰 Treasury | `/treasury` | Fiscal reserves & transactions |
| ⚒️ The Forge | `/forge` | Project builds & deployments |
| ⚙️ Settings | `/settings` | Theme, session & preferences |

---

## Terminal Logging

The system uses a themed **ImperialLogger** for all backend output:

```
[HH:MM:SS] █ MONARCH   :: Imperial API core active on port 4000.
[HH:MM:SS] █ SYSTEM    :: Heartbeat: DB ●  METRICS ●  LOAD 0.12
[HH:MM:SS] █ SECURITY  :: Imperial Root Seal loaded.
[HH:MM:SS] █ LOGISTICS :: Imperial library archives synchronized.
```

Real-time **Pulse Monitor** runs every 30 seconds to verify database and plugin health.

---

## Status

**Private & Proprietary** — House of Qui is **exclusive** and **not open-source**.

---

*House of Qui — governing official projects like an imperial dynasty.*
