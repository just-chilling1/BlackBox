# Blog Builder

**Feature ID:** `blog-builder`  
**Reference implementation:** `secretmillionaire` (`src/features/blog-builder/`)

## Workflow (4 steps)

1. `/arm-links` — Add affiliate link (Content Reserve)
2. `/territory` — Pick niche
3. `/theme` — Choose template, colors, fonts
4. `/deploy` — AI generation + publish

## Resource routes

- `/link-vault` — Manage saved links
- `/asset` — My websites vault
- `/sites/[siteSlug]` — Public hosted site (no auth)

## API routes

Session/vault: `session`, `link-vault`

Generation: `create-site`, `publish`, `generate-deploy-batch`, `generate-one-post`, `deploy-state`, `scrape`, `trend-angles`, `prefetch-images`, `attach-site-images`, `quota`, `track-click`, `site`, `posts/[postId]`

## Database

- `blog_builder_sessions`, `link_vault` (kickoff)
- `sites`, `posts`, `affiliate_clicks`, `affiliate_scrape_cache` (generation)
- `sites.theme_config` jsonb — user theme overrides from Step 3

## Enable

```typescript
enabledFeatures: ["training", "blog-builder", "dopamine"]
```

## Env vars (generation)

```
SUPABASE_SERVICE_ROLE_KEY
RAPIDAPI_KEY
RAPIDAPI_HOST=chatgpt-42.p.rapidapi.com
PIXABAY_API_KEY
RAPIDAPI_IMAGE_HOST
SCRAPER_API_KEY
TEXT_GENERATION_CONCURRENCY=3
```

Copy values from your Supabase dashboard and RapidAPI account.
