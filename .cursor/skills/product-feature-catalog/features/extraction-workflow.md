# Extraction Workflow

**Feature ID:** `extraction-workflow`  
**Reference:** `secretmillionaire` (`src/features/extraction-workflow/`)

## Overview

Connect → scan → extract dashboard. Replaces the default developer checklist on `/dashboard` when enabled.

## Routes

- `/dashboard` — ConnectDashboardPage (home)

## API

- `/api/extraction/session` — server-side workflow state

## Database

- `extraction_sessions` table (see reference migrations)

## Components

- `ConnectionStatus`, `ScanTerminal`, `ProfitTicker`, `GlobalNetworkMap`
- `ExtractionWorkflowProvider`

## Enable

```typescript
enabledFeatures: [..., "extraction-workflow"]
```

Do **not** enable alongside `core-workflow` — pick one primary workflow per product.
