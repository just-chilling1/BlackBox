# Developer Guide

**Start here. This is the only guide you need to ship a product from this repo.**

Optional: [SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md) — manual Supabase dashboard steps if the auth script fails.

Feature implementation details (for you or Cursor): `.cursor/skills/product-feature-catalog/catalog-index.md`

---

## What this repo is

A white-label Next.js + Supabase app. Auth, onboarding, sidebar, and promo slots are already built. You **pick features**, **rebrand via config files**, and **deploy**.

Do **not** edit Shell/Sidebar unless you have to — change `src/config/` instead.

---

## Steps (do in order)

### Step 1 — Run locally

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

Optional preview without login: `DEV_BYPASS_AUTH=true` in `.env.local` (remove before production).

---

### Step 2 — Create Supabase (one project per product)

1. [supabase.com](https://supabase.com) → **New project** (do not share with other apps)
2. **Project Settings → API** — copy URL and anon key (you’ll use them in Step 3)

---

### Step 3 — Fill `.env.local`

| Variable | What to put |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase API settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon / publishable key |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally; production domain later |
| `NEXT_PUBLIC_PRODUCT_NAME` | Software name shown in the UI |
| `WEBHOOK_SIGNUP_URL` | Optional — Make.com / Zapier on signup |

Add API keys **only for features you enable** (see Step 7 and catalog appendix). Copy names from `.env.local.example`.

---

### Step 4 — Database migration

Apply once per Supabase project:

- **CLI:** `supabase db push` (linked to your project), or  
- **SQL Editor:** paste `supabase/migrations/20260617000000_skeleton_core.sql`

Confirm a `users` profile table exists (id = `auth.users.id`).

---

### Step 5 — Auth

```bash
PROJECT_REF=your-project-ref \
APP_URL=http://localhost:3000 \
npm run setup:supabase-auth
```

Use `supabase login` or `SUPABASE_ACCESS_TOKEN` if needed.

In Supabase → **Authentication → URL Configuration**, add:

```
http://localhost:3000/**
https://yourdomain.com/**
```

**Smoke test:** signup → onboarding → dashboard → logout → forgot password.

Re-run this step with production `APP_URL` before launch.

---

### Step 6 — Rebrand (config only)

Edit these in order. Product **name** comes from `NEXT_PUBLIC_PRODUCT_NAME` (not hardcoded in components).

| File | What to change |
|------|----------------|
| `src/config/brand.config.ts` | Colors, fonts, logo, metadata |
| `src/config/support.config.ts` | Support email, contact URL, copy |
| `src/config/onboarding-content.ts` | Onboarding slides, partner CTA |
| `src/config/navigation.config.ts` | Sidebar labels |
| `src/config/promos.config.ts` | Ad slots (URLs + copy) — see Step 9 |
| `src/config/dopamine.config.ts` | Engagement widgets (if `dopamine` enabled) |
| `src/config/social-proof.config.ts` | Keep `enabled: false` unless client approves |
| `public/` | Logo, favicon |

---

### Step 7 — Choose and enable features

1. Open `.cursor/skills/product-feature-catalog/catalog-index.md` — read descriptions, pick what this product needs.
2. Copy a preset from `src/config/features.config.example.ts` **or** hand-pick IDs.
3. Paste into `enabledFeatures` in `src/config/features.config.ts`.

Example:

```typescript
export const enabledFeatures: FeatureId[] = [
  "training",
  "core-workflow",
  "dopamine",
  "premium-dfy",
  "premium-instant",
  "premium-autopilot",
];
```

**Built-in (no flag):** login, signup, onboarding, home, support.  
**Needs flag:** training, workflow, premium pages, dopamine, everything in the catalog.

Add env vars for enabled features (catalog appendix at bottom of `catalog-index.md`).

---

### Step 8 — Implement features

For each enabled feature not already in the skeleton:

1. Read its guide: `.cursor/skills/product-feature-catalog/features/<name>.md`
2. Implement pages under `src/features/<module>/`
3. Add routes in `src/app/` + `navigation.config.ts`
4. Add APIs with `getApiUser` + `featureApiGuard`
5. Add Supabase migration if the guide lists tables
6. Use **`brand.productName`** and client copy — never skeleton placeholder branding

**Cursor prompt:**

```text
Implement feature "article-wizard" in product-skeleton.
Read .cursor/skills/product-feature-catalog/features/article-wizard.md and catalog-index.md.
Enable in features.config.ts, wire navigation.config.ts.
Use brand.productName for all UI copy.
```

Repeat until every enabled feature works in the browser.

---

### Step 9 — Client links and assets

Ask the client for these **before go-live**:

| Need | Config file | Field |
|------|-------------|-------|
| Support email | `support.config.ts` | `email` |
| Contact link | `support.config.ts` | `contactUrl` |
| Training videos | `training.config.ts` | `videos[].id` (Vimeo) |
| Top banner CTA | `promos.config.ts` | slot `global-top` |
| Sidebar ads | `promos.config.ts` | `sidebar-promo-1` … `3` |
| Partner / upsell URLs | `promos.config.ts`, `onboarding-content.ts` | `ctaUrl` fields |
| Logo | `public/logo.png` | + `brand.config.ts` |

Set `enabled: false` on promo slots you don’t use.

---

### Step 10 — Training page (do last)

Only after branding and features are final:

1. Fill `src/config/training.config.ts` — videos, subtitle  
2. Fill `src/config/training-content.config.ts` — FAQ, steps, tips, checklist  
3. Set `trainingContentReady = true`

**Cursor prompt:**

```text
Product is ready for launch. Read enabled features in features.config.ts and pages under src/features/.
Populate training.config.ts and training-content.config.ts for this product.
Use brand.productName. Set trainingContentReady = true. No user-facing mention of "config" or "skeleton".
```

Amber banner on `/training` disappears when `trainingContentReady` is true.

---

### Step 11 — Deploy (DigitalOcean + Supabase)

**Architecture:** Browser → your domain (DigitalOcean App Platform) → Next.js app → Supabase (DB + auth).

1. Push repo to GitHub  
2. DigitalOcean → **Apps** → **Create App** → connect repo  
3. Build: `npm run build` · Run: `npm start` · Port: `3000`  
4. Set env vars (same as `.env.local`, production `NEXT_PUBLIC_APP_URL`)  
5. **Do not** set `DEV_BYPASS_AUTH` in production  
6. Add custom domain → update `NEXT_PUBLIC_APP_URL` → redeploy  
7. Re-run Step 5 auth script with production URL  
8. Apply migration on production DB if not already done  

Optional: use repo `Dockerfile` instead of Node buildpack.

---

### Step 12 — Launch checklist

| Done |
|------|
| ☐ All placeholder URLs replaced |
| ☐ `DEV_BYPASS_AUTH` off |
| ☐ Production env vars on DigitalOcean |
| ☐ Auth script run with production domain |
| ☐ `npm run build` passes |
| ☐ Signup, onboarding, training, support tested |
| ☐ `trainingContentReady = true` |
| ☐ Client has production URL + list of live promo slots |

---

## Appendix A — How the code is organized

```
src/
  app/           # Routes (thin wrappers)
  components/    # Shell, Sidebar, promos
  config/        # Branding, features, nav, promos — EDIT THESE
  features/      # Feature modules (pages + logic)
  lib/           # Supabase, auth helpers
  proxy.ts       # Auth + onboarding gate
```

**Flow:** `proxy.ts` → login if needed → `Shell` → `Sidebar` reads `navigation.config.ts` + `features.config.ts` → promos from `promos.config.ts`.

**Promo slots:** `global-top`, `global-footer`, `sidebar-promo-1…3`, `modal-training`, `toast-withdraw`, `toast-social`. Custom ad components live in `src/features/dopamine/components/` — see catalog guide `dopamine-engagement.md` if config slots are not enough.

**Adding a feature manually:** create `src/features/my-feature/` → add ID to `FEATURE_IDS` → nav item with `feature: "my-feature"` → `FeatureGuard` on route.

---

## Appendix B — Config files (quick reference)

```
src/config/
  brand.config.ts
  support.config.ts
  training.config.ts
  training-content.config.ts
  promos.config.ts
  dopamine.config.ts
  onboarding-content.ts
  navigation.config.ts
  features.config.ts      ← FEATURE_CATALOG lists every feature ID
  features.config.example.ts  ← preset stacks to copy
  social-proof.config.ts
```

---

## Appendix C — Sidebar layout

```
Home
Workflow          ← if core-workflow (or other workflow) enabled
Resources
  Training        ← if training enabled
  Support         ← always
Scale Training    ← if scale-upsell enabled
Premium Features  ← if premium-* enabled
[Sidebar promos]
```

---

## Handoff to client

Provide: production URL, which features are enabled, which promo slots are live, Supabase access (if they manage it).
