# premium-10x

**Feature ID:** `premium-10x`  
**Tier:** PREMIUM  
**Alias of:** `premium-social` (Instant Income)

## Description

Generate many Facebook post variants (10+) from one live money page — different hooks, angles, CTAs.

## User flow

```
/social-payouts → Select live money page
  → AI generates post batch
  → Copy each individually
```

## Routes

`/social-payouts` — premium nav section (user label: Instant Income)

## APIs

`POST /api/premium/social-payouts` — `RAPIDAPI_KEY`

## Implementation steps

1. Add `"premium-social"` (or `"premium-10x"`) to `enabledFeatures`
2. Requires `money-page` / live assets
3. Premium upsell page styling
