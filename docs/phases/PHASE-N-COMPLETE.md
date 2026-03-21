# ✅ Phase N — Imperial Guard (Audit Logs) — Complete

**Timestamp:** 2026-03-14

## Overview

Phase N establishes the **Imperial Guard**, a persistent and immutable audit trail for the House of Qui. Every significant action taken by projects or operators is now recorded with metadata, timestamps, and actors, ensuring absolute traceability across the ecosystem.

---

## What's Built

### Auditing Infrastructure

| Component | File | Status |
|-----------|------|--------|
| AuditLog Entity | `src/system/entities/auditLog.entity.ts` | ✅ Complete |
| AuditService | `src/system/audit/audit.service.ts` | ✅ Complete |
| Audit API | `src/system/audit/audit.controller.ts` | ✅ Complete |
| Global AuditModule | `src/system/audit/audit.module.ts` | ✅ Complete |

### Integrations & UI

| Component | File | Status |
|-----------|------|--------|
| Monarch Integration | `MonarchService` (Project/Deploy) | ✅ Complete |
| Packages Integration | `PackagesService` (Install) | ✅ Complete |
| Dashboard Panel | `qui-dashboard/src/components/AuditLogsPanel.tsx` | ✅ Complete |

---

## Tracked Actions

The Imperial Guard currently monitors and records the following events:

| Action | Source | Level | Metadata Captured |
|--------|--------|-------|-------------------|
| `PROJECT_CREATED` | Monarch | info | Name, Signed status |
| `DEPLOYMENT_STARTED`| Monarch | info | Project, Version |
| `PACKAGE_INSTALLED` | Packages| info | Package, Version |

*Note: All logs capture a target ID and actor ID (where applicable).*

---

## Features

### 🛡️ Immutable Scrolls (AuditTrail)
Audit logs are stored in the PostgreSQL database and are designed to be append-only. The system provides a centralized service (`AuditService.recordAction`) for all other components to register events.

### 🌐 Imperial Guard Panel (Dashboard)
A new, live-refreshing panel at the bottom of the Imperial Dashboard:
- **Chronological Order**: Most recent events appear first.
- **Level Visualization**: Color-coded borders based on severity (Info 🟢, Warning 🟠, Error 🔴, Critical 🔥).
- **Metadata Inspection**: Serialized JSON data is displayed for each event (e.g., version numbers, names).
- **Real-time Updates**: Polls the API every 10 seconds to keep the scrolls current.

---

## How to View

1. **Dashboard**: Scroll to the bottom of `http://localhost:5173`.
2. **API**:
   ```bash
   curl http://localhost:4000/system/audit?limit=50
   ```

---

## Next Steps

**Phase O — Imperial Mandate (System Control & Configuration)**
A centralized configuration system to manage system-wide feature flags, plugin settings, and environment variables from the dashboard.

*The Imperial Guard is on watch.* 🛡️
