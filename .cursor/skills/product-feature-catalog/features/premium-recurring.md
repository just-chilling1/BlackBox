# premium-recurring (Recurring Stream)

**Feature ID:** `premium-recurring`  
**Route:** `/recurring-wealth` (nav label: **Guaranteed High-Ticket Payouts**)

## Description

100 ready-to-publish authority articles stored in `premium_article_templates`. Seeded once; members preview/copy with their affiliate link woven in.

## User flow

```
/recurring-wealth → Filter by niche → Enter link → Expand article → Copy
```

## One-time seed (admin)

Set env: `RECURRING_SEED_SECRET`

```bash
curl -X PUT "http://localhost:3000/api/premium/recurring-stream/articles" \
  -H "x-recurring-seed-secret: YOUR_SECRET"
```

## APIs

| Route | Purpose |
|-------|---------|
| `GET /api/premium/recurring-stream/articles` | List articles |
| `POST /api/premium/recurring-stream/articles` | Get HTML with affiliate link |
| `PUT /api/premium/recurring-stream/articles` | Admin seed |

## Enable

```typescript
enabledFeatures: [..., "premium-recurring"]
```
