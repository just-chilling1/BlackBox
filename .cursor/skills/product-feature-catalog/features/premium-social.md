# Premium Social (Instant Income)

**Feature ID:** `premium-social` (implements skeleton `premium-10x` bulk post flow)  
**Route:** `/social-payouts`  
**User-facing name:** Instant Income

## Description

Bulk-generate 10 Facebook post variants from a live money page — different hooks, angles, CTAs. Each post includes the money-page URL with `?src=facebook` for Results attribution.

## User flow

```
/social-payouts → Select live money page → Generate 10 posts → Copy each into Facebook groups
```

## APIs

| Route | Purpose |
|-------|---------|
| `POST /api/premium/social-payouts` | Generate 10 posts via AI, save to `site_facebook_posts` |
| `GET /api/premium/social-payouts?siteId=` | List saved posts |

Requires `RAPIDAPI_KEY` for generation. Shares the Facebook post vault with Done-For-You Profit.

## Enable

```typescript
enabledFeatures: [..., "premium-social", "money-page"]
```
