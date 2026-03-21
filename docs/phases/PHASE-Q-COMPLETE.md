# ✅ Phase Q — Imperial Recovery (Automated Rollbacks & Health Checks) — Complete

**Timestamp:** 2026-03-14

## Overview

Phase Q introduces the **Imperial Recovery** system, transforming the House of Qui from a passive observer into an active protector. The system now monitors project health in real-time and automatically initiates rollbacks to last-known-stable artifacts if anomalies are detected.

---

## What's Built

### Recovery Infrastructure

| Component | File | Status |
|-----------|------|--------|
| Recovery Service | `src/monarch/recovery/recovery.service.ts` | ✅ Complete |
| Recovery API | `src/monarch/recovery/recovery.controller.ts` | ✅ Complete |
| Health Sentry | `src/system/sentry/sentry.service.ts` | ✅ Complete |
| Telemetry Expansion | `TelemetryBroadcaster.ts` (Health Reports) | ✅ Complete |

### User Interface

| Component | File | Status |
|-----------|------|--------|
| One-Click Rollback | `qui-dashboard/src/components/ArchivePanel.tsx`| ✅ Complete |
| Health Visualizer | `ProjectTable.tsx` (Intensity Bars) | ✅ Complete |
| Auto-Recovery Toggle | `SystemConfigService` (Mandate Control) | ✅ Complete |

---

## Features

### 🛡️ Imperial Sentry (Health Monitoring)
A persistent background service that scans all registered projects every 30 seconds.
- **Biometric/Digital Signature Scanning**: (Simulated) Detects degraded health or anomalous behavior.
- **Live Telemetry**: Projects broadcast a "Health Score" (0-100%) and "Status" (Healthy/Degraded) to the dashboard.

### 🔄 Automated Recovery
When a project's health collapses, the Sentry triggers the Recovery System:
- **Last Stable Selection**: Automatically identifies the most recent 'active' artifact in the Imperial Archive.
- **Atomic Rollback**: Re-deploys the stable version instantly.
- **Mandate Compliance**: Respects the `auto_recovery_enabled` flag in the Imperial Mandate.

### 🌐 Recovery Dashboard
The Imperial Dashboard now displays:
- **Dynamic Health Bars**: Real-time visual indicators of project stability.
- **Rollback Confirmation**: Operators can manually trigger a recovery from the Archive panel with a single click.
- **Audit Trails**: Every recovery action (auto or manual) is etched into the Imperial Guard logs with high priority (Critical/Warning).

---

## Controlled Mandates

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `auto_recovery_enabled` | boolean | true | Toggles the Sentry's power to initiate auto-rollbacks |

---

## Next Steps

**Phase R — Imperial Communication (Cross-Project Event Bus)**
Enabling projects to communicate with each other securely through the House, using an internal event bus for synchronized actions.

*The Empire is resilient.* 🛡️
