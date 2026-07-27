# Premium Accelerator

**Feature ID:** `premium-accelerator`  
**Route:** `/accelerator`

## Description

200 pre-made sales pages + X threads across all niches. Templates are **generated once** and stored in Supabase (`sites` with `is_template=true`, `template_key=accelerator-{id}`). Members clone with their affiliate link — nothing regenerates on access.

## User flow

```
/accelerator → Filter by niche → Enter affiliate link → "Use this template"
  → Cloned product site + 10 X threads in Offers Library
```

## One-time seed (admin)

Set env: `TEMPLATE_OWNER_ID`, `ACCELERATOR_SEED_SECRET`

```bash
# Seed in batches of 25 until complete (200 total)
curl -X POST "http://localhost:3000/api/premium/accelerator/seed?offset=0&limit=25" \
  -H "x-accelerator-seed-secret: YOUR_SECRET"
```

Repeat with `offset=25`, `50`, … until `complete: true`.

## APIs

| Route | Purpose |
|-------|---------|
| `GET /api/premium/accelerator/templates` | List catalog + seed status |
| `POST /api/premium/accelerator/clone` | Clone template with affiliate URL |
| `POST /api/premium/accelerator/seed` | Admin batch seed |

## Enable

```typescript
enabledFeatures: [..., "premium-accelerator"]
```
