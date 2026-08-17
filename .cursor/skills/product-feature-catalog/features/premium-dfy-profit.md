# Premium Done-For-You Profit

**Feature ID:** `premium-dfy-profit`  
**Route:** `/dfy-profit`

## Description

One-click affiliate promo kit. User enters an affiliate link and picks a niche; the app generates:

1. A hosted sales page using a randomly picked template from `READY_TEMPLATES`
2. A publicly hosted authority article (`posts.status = live`)
3. Exactly 3 Facebook posts promoting the sales page

Results reuse `sites`, `posts`, and `site_facebook_posts`, so the offer also appears in `/offers`.

## User flow

```
/dfy-profit → affiliate link + niche → Generate
  → POST /api/premium/dfy-profit/start   (sales page)
  → POST /api/premium/dfy-profit/article (authority article)
  → POST /api/premium/dfy-profit/posts   (3 Facebook posts)
  → Results panel with live URLs + copy buttons
```

Stages run sequentially from the client so each AI call stays under the 120s route limit. Failed article/posts stages can be retried independently.

## APIs

| Route | Purpose |
|-------|---------|
| `POST /api/premium/dfy-profit/start` | Scrape offer, create live site, random template, generate sales page |
| `POST /api/premium/dfy-profit/article` | Authority article saved to `posts` as live |
| `POST /api/premium/dfy-profit/posts` | 3 Facebook posts via publish-kit, saved to `site_facebook_posts` |

## Module files

```
src/features/dfy-profit/
  pages/DfyProfitPage.tsx
  components/DfyResultPanel.tsx
  lib/pick-random-template.ts
  lib/generate-authority-article.ts
src/app/dfy-profit/page.tsx
src/app/api/premium/dfy-profit/{start,article,posts}/route.ts
```

## Enable

```typescript
enabledFeatures: [..., "premium-dfy-profit"]
```

## Env vars

Same as blog-builder / publish-kit: `RAPIDAPI_KEY`, `RAPIDAPI_HOST`, optional `SCRAPERAPI_KEY` / `PIXABAY_API_KEY`.
