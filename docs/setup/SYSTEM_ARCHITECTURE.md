# 🏛️ House of Qui — System Architecture

The Imperial codebase is organized into sovereign domains, ensuring clarity, security, and scalability.

## 📂 Project Structure

### 🏺 Core & Infrastructure
- `src/main.ts`: Entry point.
- `src/app.module.ts`: Root module.
- `src/core/`: Basic logging, identity, and shared utilities.
- `src/registry/`: In-memory project discovery.
- `src/server/`: Socket.io communication engine.

### 🏛️ The Monarch (Imperial Governance)
- `src/monarch/`: Core project management and deployment logic.
- `src/monarch/archive/`: Versioned artifact storage.
- `src/monarch/recovery/`: Automated rollback and healing.
- `src/monarch/shadow/`: Security honeypots and intrusion detection.
- `src/monarch/cartographer/`: Code visualization and relationship mapping.
- `src/monarch/scribe/`: Automated documentation and blueprint generation.

### 🛡️ System (Foundation)
- `src/system/security/`: **Imperial Security Authority (ISA)**, Root Seals, JWT Tokens.
- `src/system/audit/`: Global action logging.
- `src/system/watchtower/`: Multi-channel alerting and mandate verification.
- `src/system/config/`: Runtime system mandates and toggles.
- `src/system/packages/`: Imperial Package Manager.
- `src/system/plugins/`: Extensible plugin architecture (Deployment, Metrics).
- `src/system/sentry/`: Health monitoring and sentinel watch.

### ⚙️ Modules (Active Services)
- `src/modules/communication/`: The Imperial Event Bus.
- `src/modules/observatory/`: Real-time telemetry broadcasting.
- `src/modules/treasury/`: Credit management and resource billing.
- `src/modules/command/`: Remote task execution and terminal control.

### ⚖️ The Minister
- `src/minister/`: Role-based access control and high-tier permissions.

---

## 🛠️ Security Framework
All domains are protected by the **Imperial Seal** (RSA-2048), ensuring every cross-domain signal is verified and authentic.
