# Premium Done-For-You Profit (One-Click Asset)

**Feature ID:** `premium-dfy-profit`  
**Route:** `/dfy-profit`

## Description

One-click NullPing asset. User applies an affiliate link and picks a niche; the app generates:

1. A hosted **money page** (same core asset type as Activate)
2. **10 Pinterest pins** with images (same Traffic workflow)

Matches the core product loop: money page → pins → results.

## User flow

```
/dfy-profit → Apply Link + niche → Generate
  → POST /api/premium/dfy-profit/start   (money page)
  → POST /api/pins/generate              (10 pins with images)
  → Results: open/edit money page, view pins, continue to Results
```

## APIs

| Route | Purpose |
|-------|---------|
| `POST /api/premium/dfy-profit/start` | Scrape offer, create live money page |
| `POST /api/pins/generate` | 10 Pinterest pins with images for the site |

Legacy routes (`article`, `posts`, `x-thread`) remain but are unused by the current UI.

## Module files

```
src/features/dfy-profit/
  pages/DfyProfitPage.tsx
  components/DfyResultPanel.tsx
  lib/pick-random-template.ts
src/app/dfy-profit/page.tsx
src/app/api/premium/dfy-profit/start/route.ts
```

## Enable

```typescript
enabledFeatures: [..., "premium-dfy-profit"]
```
