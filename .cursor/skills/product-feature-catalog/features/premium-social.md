# Premium Social (Social Payouts / 10X)

**Feature ID:** `premium-social` (implements skeleton `premium-10x` bulk post flow)  
**Route:** `/social-payouts`

## Description

Bulk-generate 10+ Facebook post variants from a member's offer/site — different hooks, angles, CTAs. Maps to the skeleton **10X** feature.

## User flow

```
/social-payouts → Select offer from library → Generate 10X posts → Copy each
```

## APIs

| Route | Purpose |
|-------|---------|
| `POST /api/premium/social-payouts` | Generate 10 posts via AI, save to `site_facebook_posts` |
| `GET /api/premium/social-payouts?siteId=` | List saved posts |

Requires `RAPIDAPI_KEY` for generation.

## Enable

```typescript
enabledFeatures: [..., "premium-social", "blog-builder"]
```
