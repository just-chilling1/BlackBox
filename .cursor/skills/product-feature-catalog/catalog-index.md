# Feature Catalog

**CORE** = main product workflow · **PREMIUM** = upsell / power-up module

Enable a feature via its **Feature ID** in `src/config/features.config.ts`. Full descriptions also live in `FEATURE_CATALOG` in that file.

---

## Foundation

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `training` | CORE | Training page: videos, FAQ, workflow guide, checklist | [training-support](features/training-support.md) |
| `dopamine` | CORE | Social proof toasts, earnings counters, popups, trust bar | [dopamine-engagement](features/dopamine-engagement.md) |
| `scale-upsell` | CORE | Scale-training sales page with external checkout link | [scale-training-upsell](features/scale-training-upsell.md) |

Auth, onboarding, support, and home dashboard are **built into the skeleton** (not feature flags). See [auth-onboarding](features/auth-onboarding.md).

---

## Affiliate reply workflow

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `core-workflow` | CORE | Search → analysis → radar → AI-generated replies | [core-workflow](features/core-workflow.md) |
| `extraction-workflow` | CORE | Connect → scan → extract dashboard with live status | [extraction-workflow](features/extraction-workflow.md) |
| `comment-pack` | CORE | Gold Rush: find videos → generate comment packs → share vault | [comment-pack](features/comment-pack.md) |

---

## Blog builder (money sites)

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `blog-builder` | CORE | Link → niche → theme → deploy (kickoff: first 3 steps) → hosted sites at `/sites/[slug]` | [blog-builder](features/blog-builder.md) |

---

## Content & publishing

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `article-wizard` | CORE | AI article: niche → headlines → full body | [article-wizard](features/article-wizard.md) |
| `article-images` | CORE | Hero and social images for drafts | [article-images](features/article-images.md) |
| `article-publish` | CORE | Preview, SEO meta, publish or export HTML | [article-publish](features/article-publish.md) |
| `portfolio` | CORE | Saved drafts and published articles library | [portfolio](features/portfolio.md) |
| `premium-10x` | PREMIUM | Bulk Facebook post variants from one article | [premium-10x](features/premium-10x.md) |
| `premium-infinite` | PREMIUM | Batch-generate multiple articles from one niche | [premium-infinite](features/premium-infinite.md) |
| `premium-automation` | PREMIUM | Publishing calendar and scheduled posts | [premium-automation](features/premium-automation.md) |

---

## Image & link affiliate

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `image-forge` | CORE | AI image generator from prompts or templates | [image-forge](features/image-forge.md) |
| `money-links-vault` | CORE | Save, label, and copy affiliate links | [money-links-vault](features/money-links-vault.md) |
| `launchpad` | CORE | Launch checklist: connect, create, share, track | [launchpad](features/launchpad.md) |

---

## B2B outreach

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `b2b-outreach` | CORE | Offers library → lead finder → AI email builder | [b2b-outreach](features/b2b-outreach.md) |

---

## Bridge pages & traffic

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `wealth-sync` | CORE | Affiliate URL → AI bridge/review page | [wealth-sync](features/wealth-sync.md) |
| `traffic-hub` | CORE | Outreach targets and AI comments for promotion | [traffic-hub](features/traffic-hub.md) |
| `income-calculator` | CORE | Income projection from traffic and commission | [income-calculator](features/income-calculator.md) |
| `premium-recurring` | PREMIUM | Guaranteed High-Ticket Payouts — add sections to a money page | [premium-recurring](features/premium-recurring.md) |

---

## Digital products

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `product-wizard` | CORE | Niche → ebook → sales page → publish | [product-wizard](features/product-wizard.md) |
| `niche-finder` | CORE | Discover sub-niches → start product wizard | [niche-finder](features/niche-finder.md) |

---

## Premium upsells (shared pattern)

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `premium-dfy` | PREMIUM | Done-for-you vault (keywords, articles, images, leads, products) | [premium-dfy](features/premium-dfy.md) |
| `premium-dfy-profit` | PREMIUM | One-click: link + niche → live sales page + 3 pins + article + 3 Facebook posts | [premium-dfy-profit](features/premium-dfy-profit.md) |
| `premium-instant` | PREMIUM | Pre-written social posts with images | [premium-instant](features/premium-instant.md) |
| `premium-autopilot` | PREMIUM | Pinterest posting playbook for a live money page | [premium-autopilot](features/premium-autopilot.md) |
| `premium-accelerator` | PREMIUM | 200 ready-made money pages — install + pins | [premium-accelerator](features/premium-accelerator.md) |
| `premium-social` | PREMIUM | Pin Multiplier — extra Pinterest pin batches | [premium-social](features/premium-social.md) |
| `protector` | PREMIUM | Real account status (email, session, activity) | [protector](features/protector.md) |
| `premium-license-rights` | PREMIUM | Reseller license request on Account | [premium-license-rights](features/premium-license-rights.md) |

---

## Quick pick by product type

| Building… | Enable these CORE features |
|-----------|------------------------------|
| NullPing Cash (affiliate money pages + Pinterest) | `asset-activator`, `money-page`, `traffic-pins`, `results`, `training` |
| Affiliate / reply app (CashTap AI) | `core-workflow`, `dopamine`, `training` |
| Blog / money site (Secret Millionaire) | `blog-builder`, `training`, `premium-accelerator`, `premium-recurring`, `premium-social` |
| Digital product (Click Clone Profits) | `product-wizard`, `niche-finder`, `training` |
| Comment pack / Gold Rush (Robinhood) | `comment-pack`, `training` |
| SEO / content site (Battery Profits) | `article-wizard`, `article-images`, `article-publish`, `portfolio` |
| Image + link affiliate (Q-Labs) | `image-forge`, `money-links-vault`, `launchpad` |
| Bridge + traffic (AI Wealth) | `wealth-sync`, `traffic-hub`, `income-calculator` |
| Digital product launcher | `product-wizard`, `niche-finder` |
| Monetized app (any) | Add `premium-dfy`, `premium-instant`, `premium-autopilot` as needed |

Preset arrays: `src/config/features.config.example.ts`

---

## Environment variables (by feature)

Copy **names** into `.env.local`. Never commit real keys.

### Universal (every product)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin |
| `NEXT_PUBLIC_APP_URL` | App domain |
| `NEXT_PUBLIC_PRODUCT_NAME` | Software name → `brand.productName` |
| `WEBHOOK_SIGNUP_URL` | Optional signup webhook |
| `FRESHDESK_DOMAIN` | Support API (Freshdesk tickets) |
| `FRESHDESK_API_KEY` | Support API |
| `RESEND_API_KEY` | Support API fallback |
| `RESEND_FROM_EMAIL` | Support API sender |

### AI text (RapidAPI)

| Variable | Features |
|----------|----------|
| `RAPIDAPI_KEY` | `core-workflow`, `article-wizard`, `b2b-outreach`, `wealth-sync`, `traffic-hub`, `product-wizard`, `premium-10x`, `premium-infinite` |
| `RAPIDAPI_HOST` | ChatGPT host |

### AI images

| Variable | Features |
|----------|----------|
| `RAPIDAPI_HOST_IMAGE` | `image-forge`, `article-images`, `premium-instant`, `premium-dfy` |

### Scraping

| Variable | Features |
|----------|----------|
| `SCRAPERAPI_KEY` | `core-workflow`, `article-wizard`, `wealth-sync`, `traffic-hub` |

### Optional

`RAPIDAPI_HOST_REDDIT`, `RAPIDAPI_HOST_YOUTUBE` (`core-workflow`), `NEXT_PUBLIC_SITE_URL` (`product-wizard`).

Vimeo IDs → `training.config.ts`, not env.

### Supabase tables

Add migrations when implementing: `articles`, `bridges`, `sites`, `posts`, `projects`, `user_premium_settings`, `user_training_completions`, etc. Each feature guide lists its tables.

Skeleton ships migrations for: onboarding, core-workflow user scoping, premium settings, training completions.

API routes: use `getApiUser` + `featureApiGuard(featureId)` from `src/lib/`.
