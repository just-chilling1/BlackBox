# Premium Done-For-You Profit

**Feature ID:** `premium-dfy-profit`  
**Route:** `/dfy-profit`

## Description

One-click affiliate promo kit. User enters an affiliate link and picks a niche; the app generates:

1. A hosted sales page using a randomly picked template from `READY_TEMPLATES`
2. A 10-post X story thread with three visuals
3. A copy-ready authority article, previewed inside the app
4. Exactly 3 Facebook posts promoting the sales page, with visuals on two variants

Sales pages reuse `sites`; Facebook posts and X threads are saved to their existing
offer tables. The authority article is intentionally not published online.

## User flow

```
/dfy-profit → affiliate link + niche → Generate
  → POST /api/premium/dfy-profit/start   (sales page)
  → POST /api/premium/dfy-profit/x-thread (10-post X thread)
  → POST /api/premium/dfy-profit/article (authority article)
  → POST /api/premium/dfy-profit/posts   (3 Facebook posts)
  → Results panel with an article preview and copy buttons
```

Stages run sequentially from the client so each AI call stays under the 120s route limit. Failed article/posts stages can be retried independently.

## APIs

| Route | Purpose |
|-------|---------|
| `POST /api/premium/dfy-profit/start` | Scrape offer, create live site, random template, generate sales page |
| `POST /api/premium/dfy-profit/article` | Copyable, in-app authority article |
| `POST /api/premium/dfy-profit/posts` | 3 Facebook posts via publish-kit; two include saved image URLs |
| `POST /api/premium/dfy-profit/x-thread` | 10-post X story thread with three saved image URLs |

## Module files

```
src/features/dfy-profit/
  pages/DfyProfitPage.tsx
  components/DfyResultPanel.tsx
  lib/pick-random-template.ts
  lib/generate-authority-article.ts
src/app/dfy-profit/page.tsx
src/app/api/premium/dfy-profit/{start,article,posts,x-thread}/route.ts
```

## Enable

```typescript
enabledFeatures: [..., "premium-dfy-profit"]
```

## Env vars

Same as blog-builder / publish-kit: `RAPIDAPI_KEY`, `RAPIDAPI_HOST`, optional `SCRAPERAPI_KEY` / `PIXABAY_API_KEY`.
