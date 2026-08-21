# Premium Done-For-You Profit (One-Click Kit)

**Feature ID:** `premium-dfy-profit`  
**Route:** `/dfy-profit`

## Description

One-click promo kit. User applies an affiliate link and picks a niche (same list as Guaranteed High-Ticket Payouts); the app generates:

1. A hosted **sales page** (random `READY_TEMPLATES` design, published live)
2. **3 Pinterest pins** with images
3. One **authority article** (saved to the offer library)
4. **3 Facebook posts** promoting the hosted sales URL

## User flow

```
/dfy-profit → Apply Link + niche → Generate
  → POST /api/premium/dfy-profit/start   (live sales page)
  → POST /api/pins/generate              (3 pins with images)
  → POST /api/premium/dfy-profit/article (authority article)
  → POST /api/premium/dfy-profit/posts   (3 Facebook posts)
  → Results: open live page, copy pins / article / posts
```

Each stage after the sales page is independently retryable.

## APIs

| Route | Purpose |
|-------|---------|
| `POST /api/premium/dfy-profit/start` | Scrape offer, create live sales page with a random template |
| `POST /api/pins/generate` | 3 Pinterest pins with images (`{ siteId, count: 3 }`) |
| `POST /api/premium/dfy-profit/article` | Authority article saved to `site_recurring_articles` |
| `POST /api/premium/dfy-profit/posts` | 3 Facebook posts saved to `site_facebook_posts` |

Niches come from `PREMIUM_NICHE_OPTIONS` in [`src/lib/premium-niches.ts`](../../../src/lib/premium-niches.ts).

## Module files

```
src/features/dfy-profit/
  pages/DfyProfitPage.tsx
  components/DfyResultPanel.tsx
  lib/pick-random-template.ts
  lib/generate-authority-article.ts
  lib/load-owned-site.ts
src/app/dfy-profit/page.tsx
src/app/api/premium/dfy-profit/start/route.ts
src/app/api/premium/dfy-profit/article/route.ts
src/app/api/premium/dfy-profit/posts/route.ts
```

## Enable

```typescript
enabledFeatures: [..., "premium-dfy-profit"]
```
