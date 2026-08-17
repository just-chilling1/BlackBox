# Done-For-You Profit — Design Spec

**Date:** 2026-08-17  
**Feature ID:** `premium-dfy-profit`  
**Route:** `/dfy-profit`  
**Tier:** PREMIUM

## Goal

One-click generation of a complete affiliate promo kit from an affiliate link + niche:

1. Hosted sales page (random design from the 3 existing `READY_TEMPLATES`)
2. Publicly hosted authority article
3. Exactly 3 Facebook posts promoting the sales page

## Architecture

Standalone premium page that orchestrates existing generators. No new database tables.

### Reused building blocks

| Asset | Generator / storage |
|-------|---------------------|
| Sales page | `generateProductSite()` → `sites.sales_page_html` |
| Template | `pickRandomTemplate()` over `READY_TEMPLATES` |
| Authority article | `generateBlogPostContent({ contentTier: "authority" })` → `posts` (`status: "live"`) |
| Facebook posts | `generateFacebookPostsForOffer({ postCount: 3 })` → `site_facebook_posts` |

### Staged API (client-driven)

Three sequential calls avoid platform timeouts (each AI stage allows up to 120s):

1. `POST /api/premium/dfy-profit/start` — scrape, create site, pick template, generate sales page
2. `POST /api/premium/dfy-profit/article` — authority article, live
3. `POST /api/premium/dfy-profit/posts` — 3 Facebook posts pointed at the hosted offer URL

Each stage is independently retryable.

## User flow

```
/dfy-profit → enter affiliate link + pick niche → Generate
  → sales page live at /sites/[slug] (or handle-scoped URL)
  → authority article live at /sites/[slug]/[postSlug]
  → 3 Facebook posts with copy buttons
  → offer also appears in /offers
```

## Constraints

- Random template from existing 3 designs only (no new themes in v1)
- Article is publicly hosted (`posts.status = "live"`), not draft-only
- Facebook posts promote the hosted sales page (tracked), not the raw affiliate URL
- Feature gated via `FeatureGuard` + `featureApiGuard("premium-dfy-profit")`
- Existing `premium-dfy` catalog id is left untouched

## Out of scope

- New visual templates beyond the 3 ready ones
- X threads / recurring stream clone
- Editing the generated assets in-place (users can use Offers Library)
