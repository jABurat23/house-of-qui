# House of Qui — Development Guide

## Quick Start

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** 12+ (running locally or via Docker)

### Setup

```bash
# 1. Install backend dependencies
npm install

# 2. Install dashboard dependencies
cd qui-dashboard && npm install && cd ..
```

Create `.env` from the template:
```bash
cp .env.example .env
# Edit .env with your database credentials and secret
```

### Database setup

```bash
psql -U postgres -c "CREATE DATABASE house_of_qui;"
```

Or via Docker:
```bash
docker run -d \
  --name qui-postgres \
  -e POSTGRES_PASSWORD=your-password \
  -e POSTGRES_DB=house_of_qui \
  -p 5432:5432 \
  postgres:15
```

---

## Running the System

### Terminal 1 — Imperial Core (API + WebSocket Gateway, Port 4000)
```bash
npm run dev
```

This starts:
- NestJS API server on **port 4000**
- TypeORM sync with PostgreSQL
- NestJS WebSocket Gateway (Socket.io) — **also on port 4000** (no separate server)
- Package registry seeding

### Terminal 2 — Dynasty Interface (Port 5173)
```bash
cd qui-dashboard
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> **Note**: The Socket.io client in `qui-dashboard/src/api/socket.ts` connects to `localhost:4000` — the same port as the REST API. This is by design since the WebSocket Gateway is integrated into the NestJS app via `@WebSocketGateway()`.

---

## Granting Throne Access (First-Time Setup)

On first run, create the Monarch user:

```bash
curl -X POST http://localhost:4000/auth/ritual/grant-throne \
  -H "Content-Type: application/json" \
  -d '{"name": "YourImperialName", "key": "YourSecurePassword"}'
```

Then visit the dashboard and complete the **Imperial Gate Ritual** (2-step login).

---

## Project Structure

```
house-of-qui/
├── .env                        # Your local environment (not committed)
├── .env.example                # Environment variable template
├── .gitignore                  # Root ignore rules
├── README.md                   # Project overview
├── package.json                # Backend dependencies
├── tsconfig.json               # Backend TypeScript config
│
├── src/                        # Imperial Core (NestJS Backend)
│   ├── main.ts                 # Entry point
│   ├── app.module.ts           # Root NestJS module
│   ├── core/                   # Logger, shared utilities
│   ├── system/
│   │   ├── auth/               # Imperial Gate (Argon2, JWT, Seal Challenge)
│   │   ├── audit/              # Audit trail + WebSocket Gateway (port 4000)
│   │   ├── watchtower/         # Alert system
│   │   ├── security/           # ISA signing, seal service
│   │   ├── packages/           # Package registry (seedable)
│   │   └── plugins/            # Plugin runtime
│   ├── monarch/                # Project management
│   │   ├── entities/           # Project, Deployment, Quota, etc.
│   │   ├── shadow/             # Shadow project honeypot system
│   │   ├── cartographer/       # Project universe graph
│   │   └── logistics/          # Resource quota tracking
│   ├── modules/
│   │   ├── treasury/           # Project wallets and credits
│   │   ├── observatory/        # Telemetry broadcaster
│   │   └── communication/      # Imperial event bus
│   └── server/                 # Legacy socket server (superseded by AuditGateway)
│
├── qui-dashboard/              # Dynasty Interface (Vite + React + Tailwind v4)
│   └── src/
│       ├── App.tsx             # Session manager
│       ├── main.tsx            # Vite entry point
│       ├── global.css          # Tailwind v4 theme + custom styles
│       ├── api/
│       │   ├── client.ts       # Axios instance (port 4000, auto-auth)
│       │   └── socket.ts       # Socket.io client (port 4000)
│       ├── types/
│       │   └── index.ts        # Shared TypeScript interfaces
│       ├── layouts/
│       │   └── CourtLayout.tsx # Main 3-column court layout
│       └── pages/
│           ├── ImperialGate.tsx  # Login ritual (2-step)
│           ├── Dashboard.tsx     # Main orchestrator + socket bindings
│           ├── Throne.tsx        # Overview chamber
│           ├── WarCouncil.tsx    # Security / threat signals
│           ├── Archives.tsx      # Audit log browser
│           ├── Treasury.tsx      # Project wallets
│           └── Forge.tsx         # Plugin / artifact registry
│
└── docs/
    ├── README.md               # Documentation index
    ├── setup/                  # Dev guides and architecture docs
    └── phases/                 # Phase implementation records
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/ritual/grant-throne` | Seed initial Monarch user |
| POST | `/auth/ritual/request` | Step 1: Verify identity + issue Seal Challenge |
| POST | `/auth/ritual/complete` | Step 2: Verify Seal + sign JWT |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| GET | `/monarch/projects` | List all projects |
| POST | `/monarch/projects/register` | Register new project + get service token |
| GET | `/monarch/projects/:id` | Get single project |

### Audit
| Method | Endpoint | Description |
|---|---|---|
| GET | `/system/audit` | Full audit log (default 100) |
| GET | `/system/audit/recent` | Last 50 events |

### Treasury
| Method | Endpoint | Description |
|---|---|---|
| GET | `/monarch/treasury/summary` | All wallets + total balance |
| GET | `/monarch/treasury/wallet/:id` | Single project wallet |

### Plugins (Forge)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/plugins` | List all registered plugins |
| GET | `/plugins/:id` | Get plugin details |
| POST | `/plugins/:id/enable` | Enable a plugin |
| POST | `/plugins/:id/disable` | Disable a plugin |

---

## WebSocket Events

All events flow through the `AuditGateway` on **port 4000**.

### Server → Dashboard
| Event | Description |
|---|---|
| `audit:broadcast` | New audit log entry (real-time) |
| `telemetry:identity` | Telemetry update (triggers project refresh) |
| `project_registered` | New project registered |
| `health_report` | Project health update |
| `security_alert` | Security event fired |
| `wallet_update` | Treasury balance changed |
| `resource_usage` | Resource quota update |

---

## CLI Commands (`qui`)

```bash
# Check system status
npm run qui -- status

# List registered projects
npm run qui -- projects

# Register a new project
npm run qui -- init --name "My Project" --version "1.0.0"
```

---

## Troubleshooting

### "Connection refused" on dashboard
- Ensure backend is running: `npm run dev` in root
- Confirm port 4000 is available
- Check database is running and accessible

### Socket events not appearing in Chronicle
- Both the REST API and Socket.io run on port 4000
- Verify `qui-dashboard/src/api/socket.ts` points to `localhost:4000`
- Check browser console for `Dynasty Dashboard connected:` in terminal output

### TypeORM sync errors  
- Verify PostgreSQL is running: `psql -U postgres -d house_of_qui`
- Check `.env` database credentials match your setup
- TypeORM will auto-sync schema on first run (synchronize: true)

### 401 Unauthorized on API calls
- The Axios client auto-attaches the JWT from `imperial_session` in localStorage
- If token expired, logout and re-authenticate via the Imperial Gate
