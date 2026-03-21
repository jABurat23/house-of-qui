# ✅ Phase O — Imperial Mandate (System Control & Configuration) — Complete

**Timestamp:** 2026-03-14

## Overview

Phase O introduces **Imperial Mandate**, a centralized configuration and control system for the House of Qui. Operators can now manage system-wide feature flags, security policies, and performance settings in real-time directly from the Imperial Dashboard.

---

## What's Built

### Configuration Engine

| Component | File | Status |
|-----------|------|--------|
| SystemConfig Entity | `src/system/entities/systemConfig.entity.ts` | ✅ Complete |
| Configuration Service | `src/system/config/config.service.ts` | ✅ Complete |
| Configuration API | `src/system/config/config.controller.ts` | ✅ Complete |
| Global ConfigModule | `src/system/config/config.module.ts` | ✅ Complete |

### Integrations & UI

| Component | File | Status |
|-----------|------|--------|
| Monarch Integration | `MonarchController` (Registration Policies) | ✅ Complete |
| Audit Integration | `SystemConfigService` (Change Tracking) | ✅ Complete |
| Dashboard Panel | `qui-dashboard/src/components/SystemMandatePanel.tsx`| ✅ Complete |

---

## Controlled Mandates (Default Settings)

The system initializes with the following mandates:

| Key | Type | Category | Description |
|-----|------|----------|-------------|
| `imperial_title` | string | branding | The official name of the empire |
| `maintenance_mode` | boolean| security | Locks down all project actions |
| `registration_open`| boolean| security | Toggles new project registration |
| `seal_enforcement`| boolean| security | Makes cryptographic seals mandatory |
| `observatory_ms` | number | performance| Dashboard metrics refresh rate |

---

## Features

### 📜 Centralized Control (Typed Config)
Settings are stored with explicit types (string, number, boolean, json) in the database. The `SystemConfigService` handles automatic casting and provides a robust `get/set` API for other system components.

### 🛡️ Real-time Guardrails
The `MonarchController` now consults the Imperial Mandates before allowing critical actions:
- **Registration Open/Closed**: Blocks `qui init` if registration is disabled.
- **Seal Enforcement**: Rejects any registration attempt that lacks a valid Great Seal signature.
- **Maintenance Mode**: (WIP) Global restriction on system mutations.

### 🌐 Imperial Mandate Panel (Dashboard)
A dedicated control center on the dashboard where operators can:
- Toggle feature flags instantly.
- Modify numeric settings (like refresh rates).
- Update system strings (like the Imperial Title).
- View full descriptions and categories for every setting.

---

## How to Control

1. **Dashboard**: Navigate to the "Imperial Mandate" panel at the bottom of the dashboard.
2. **API**:
   ```bash
   # Set a mandate
   curl -X POST http://localhost:4000/system/config -H "Content-Type: application/json" -d '{"key": "maintenance_mode", "value": true}'
   ```

---

## Next Steps

**Phase P — Imperial Archive (Project Versioning & Artifacts)**
Implementing an artifact storage system where projects can upload build bundles (zips/images) for historical tracking and rollbacks.

*The Mandate is set.* 📜
