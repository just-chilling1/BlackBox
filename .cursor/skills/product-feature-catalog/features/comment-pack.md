# Comment Pack (Gold Rush)

**Feature ID:** `comment-pack`  
**Reference:** `robinhood`

## Routes

- `/create` — Find video opportunities, generate comment packs
- `/pages` — My Vault (saved packs)
- `/share` — Affiliate link vault
- `/article/[slug]` — Public comment pack viewer (public route in proxy)

## Description

YouTube/social comment pack workflow for affiliate promotion.

## Database

Reference `scripts/001_create_schema.sql` in robinhood: `pages`, `videos`, `niches`, `offers`.

## Enable

```typescript
enabledFeatures: [..., "comment-pack"]
```

Update `navigation.config.ts` workflow steps and `bottomNavTabs` for this product type.
