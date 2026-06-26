# premium-10x

**Feature ID:** `premium-10x`  
**Tier:** PREMIUM

## Description

Generate many Facebook post variants (10+) from one article — different hooks, angles, CTAs.

## User flow

```
/10x → Select article from portfolio
  → AI generates post batch
  → Copy each individually
```

## Routes

`/10x` — premium nav section

## APIs

`POST /api/generate-posts` — `RAPIDAPI_KEY`

Optional: `user_powerups` table for entitlement gating.

## Implementation steps

1. Add `"premium-10x"` to `enabledFeatures`
2. Requires `portfolio` / `articles`
3. Premium upsell page styling
