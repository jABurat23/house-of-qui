# 👑 House of Qui — Sovereign OS

> *You are not using an app. You are entering a court.*

A professional, multi-layered project management and monitoring system built with the **Dynasty Interface Framework**. The House of Qui is a sovereign operating system for managing autonomous projects, deployments, telemetry, and treasury — all secured behind a ceremonial multi-factor authentication ritual.

---

## 🏛️ System Architecture

```
house-of-qui/
├── src/                        # Imperial Core (NestJS Backend)
│   ├── app.module.ts
│   ├── main.ts
│   ├── core/                   # Logger, shared utilities
│   ├── system/                 # Auth, Audit, Bootstrap, Watchtower
│   │   ├── auth/               # Imperial Gate v2 (Argon2 + JWT + 2FA)
│   │   └── audit/              # Audit trail + real-time WebSocket gateway
│   ├── monarch/                # Project management, Shadow, Cartographer
│   ├── modules/                # Treasury, Communication, Command
│   └── server/                 # Legacy Socket.io (replaced by AuditGateway)
│
├── qui-dashboard/              # Dynasty Interface (Vite + React + Tailwind 4)
│   └── src/
│       ├── App.tsx             # Session manager (Gate → Court)
│       ├── api/                # Axios client + Socket.io client
│       ├── layouts/            # CourtLayout (triple-column court structure)
│       ├── pages/              # All court chambers
│       │   ├── ImperialGate    # Multi-step login ritual
│       │   ├── Dashboard       # Main orchestrator
│       │   ├── Throne          # Overview / Dominion Status
│       │   ├── WarCouncil      # Security / Threat Signals
│       │   ├── Archives        # Audit log browser
│       │   ├── Treasury        # Imperial Ledger / Wallets
│       │   └── Forge           # Plugin/Artifact manager
│       └── components/         # Shared panels and UI primitives
│
└── docs/                       # Architecture, phases, and setup guides
```

---

## ⚔️ Security Architecture (Imperial Gate v2)

| Layer | Name | Implementation |
|---|---|---|
| 1 | Identity | Argon2id hashed `houseKey` |
| 1.5 | Shadow Defense | Honeypot field detection |
| 2 | Seal Challenge | Server-generated phrase verification (ceremonial 2FA) |
| 3 | Imperial Session | JWT with IP + User-Agent fingerprinting, 1hr expiry |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+

### Setup

```bash
# 1. Install backend dependencies
npm install

# 2. Install dashboard dependencies
cd qui-dashboard && npm install && cd ..

# 3. Setup the database
psql -U postgres -c "CREATE DATABASE house_of_qui;"
```

Create a `.env` file (see `.env.example`):
```env
IMPERIAL_SECRET=your-jwt-secret-here
DB_PASSWORD=your-db-password
```

### Run

```bash
# Terminal 1 — Imperial Core (port 4000)
npm run dev

# Terminal 2 — Dynasty Interface (port 5173)
cd qui-dashboard && npm run dev
```

### Grant the Throne (First-time setup)

```bash
curl -X POST http://localhost:4000/auth/ritual/grant-throne \
  -H "Content-Type: application/json" \
  -d '{"name": "YourName", "key": "YourPassword"}'
```

Then visit [http://localhost:5173](http://localhost:5173) and perform the Imperial Ritual.

---

## 🧩 Technology Stack

### Backend
- **NestJS** — Sovereign API framework
- **TypeORM + PostgreSQL** — Imperial data persistence
- **Argon2** — Cryptographic identity hashing
- **Socket.io (NestJS Gateway)** — Real-time telemetry broadcasting
- **JWT** — Session fingerprinting

### Frontend
- **React + Vite** — High-performance court interface
- **Tailwind CSS v4** — Native CSS-first design engine
- **Framer Motion** — Ceremonial transitions
- **Lucide React** — Sovereign iconography

---

## 🏯 Court Chambers

| Chamber | Route | Description |
|---|---|---|
| Throne Chamber | `/` | Imperial Pulse, Dominion Status |
| War Council | `/security` | Threat Signals, Battle Records |
| Grand Archives | `/archives` | Recorded Events, Audit Chronicle |
| Imperial Treasury | `/treasury` | Project Wallets, Imperial Ledger |
| The Forge | `/forge` | System Artifacts, Plugin Registry |

---

## 📜 API Reference

### Auth Rituals
| Endpoint | Method | Description |
|---|---|---|
| `/auth/ritual/grant-throne` | POST | Seed initial Monarch user |
| `/auth/ritual/request` | POST | Layer 1+2: Verify + Issue Seal |
| `/auth/ritual/complete` | POST | Layer 2+3: Verify Seal + Sign JWT |

### Projects
| Endpoint | Method | Description |
|---|---|---|
| `/monarch/projects` | GET | List all mandates |
| `/monarch/projects/register` | POST | Register new project + get token |

### Audit
| Endpoint | Method | Description |
|---|---|---|
| `/system/audit` | GET | Full audit log |
| `/system/audit/recent` | GET | Last 50 events |

### Treasury
| Endpoint | Method | Description |
|---|---|---|
| `/monarch/treasury/summary` | GET | All wallets + total balance |
| `/monarch/treasury/wallet/:id` | GET | Single project wallet |

---

## 📁 Documentation

See the [`docs/`](./docs/) directory for:
- **`docs/setup/`** — Development guides and architecture overview
- **`docs/phases/`** — Detailed phase-by-phase implementation records

---

*House of Qui — Sovereign OS. All rights reserved.*
