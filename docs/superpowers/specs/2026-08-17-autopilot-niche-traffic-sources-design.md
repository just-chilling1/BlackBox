# Automated Profits — Niche-Aligned Traffic Sources — Design Spec

**Date:** 2026-08-17
**Feature ID:** `premium-autopilot`
**Route:** `/autopilot`
**Tier:** PREMIUM

## Goal

Give every canonical project niche exactly 20 traffic sources (180 total) and tie the
feature to the asset the member actually built in this product.

Today Autopilot is the only feature with its own niche taxonomy — 8 niches (Weight Loss,
Make Money Online, Health & Fitness, Tech & Gadgets, Beauty & Skincare, Relationships,
Pets, Home & Garden) holding 122 sources spread 19/18/15/16/13/13/14/14. Blog Builder,
DFY Profit, Accelerator and Recurring Stream all derive their niches from `NICHE_OPTIONS`,
so the niche a member picks when generating a site has no matching tab in Autopilot.

## Architecture

`src/features/premium-autopilot/lib/traffic-sources.ts` keeps its public surface
(`TrafficSource`, `SourceType`, `Difficulty`, `NICHES`, `SOURCES`, `filterSourcesByNiche`)
so no consumer outside the feature changes. Its body becomes composition instead of a
literal array, and `NICHES` derives from `NICHE_OPTIONS` the same way `ACCELERATOR_NICHES`
and `RECURRING_STREAM_NICHES` do.

### New modules

| Module | Contents |
|--------|----------|
| `lib/niche-profiles.ts` | Per canonical niche key: label, real community names, subreddits, hashtags, search keywords, directories, demand tier, snippet angle |
| `lib/platform-playbooks.ts` | 12 cross-platform recipes with type, difficulty, time, base traffic range, and templated instructions/description |
| `lib/curated-sources.ts` | 8 hand-written niche-specific destinations per niche (72 total) |

### Composition

Each niche gets 8 curated entries plus 12 composed playbook entries = 20 (72 curated and
108 composed across the 9 niches). Playbook templates interpolate `{COMMUNITY}`,
`{HASHTAGS}`, `{KEYWORDS}` from the niche profile. The demand tier is a numeric multiplier
(`high` 1.5, `medium` 1.0, `low` 0.7) applied to the playbook's base visitor range and
rounded, so composed estimates differ between niches without hand-writing each number.

`SOURCES` is ordered by `NICHE_OPTIONS` order, and within a niche the 8 curated entries
come before the 12 composed ones.

The 20-per-niche invariant is enforced at compile time, since the project has no test
runner: the curated map is typed as a fixed-length 8-tuple per niche key and the playbook
table as a fixed-length 12-tuple, so a miscount fails `tsc`.

### Curated destination examples

| Niche | Examples |
|-------|----------|
| Finance & Investing | Bogleheads, r/personalfinance, r/investing, Wall Street Oasis |
| Beauty & Skincare | MakeupAlley, r/SkincareAddiction, r/MakeupAddiction, EssentialDaySpa |
| Travel & Lifestyle | Lonely Planet Thorn Tree, FlyerTalk, r/solotravel, TripAdvisor forums |
| Digital Marketing | Warrior Forum, GrowthHackers, r/SEO, Digital Point |
| Business & Entrepreneurship | Indie Hackers, r/Entrepreneur, Hacker News, Product Hunt |

### IDs and existing progress

IDs become `<nicheValue>-c1..c8` for curated entries and `<nicheValue>-p-<playbookId>` for
composed ones (e.g. `health-c3`, `finance-p-reddit`). These cannot collide with the old
`wl-1` / `mmo-3` scheme, so rows already in `user_autopilot_completions` stay inert. No
migration and no id mapping: members start the new list at 0%.

## Project integration

- **Niche preselect.** On load the page calls `GET /api/blog/site?lite=1` and takes the
  newest site. Its `territory` resolves through `resolveNicheKey()` to a canonical niche.
  If the member has no saved `autopilot_selected_niche`, that niche is preselected instead
  of "All". An explicit saved choice always wins.
- **Retired niche values.** A saved value such as "Weight Loss" matches no tab in the new
  list, so it falls back to "All" rather than rendering an empty grid.
- **Graceful degradation.** No site, no confident niche match, or blog-builder disabled
  (the endpoint is behind `featureApiGuard("blog-builder")`) all fall back to "All".
- **Promotion URL prefill.** The same site fills the URL field via
  `buildOfferPageUrl(origin, slug, owner_handle)`, only when the field is empty. The
  member can overwrite it, which saves through the existing PATCH path.
- **Snippets.** Descriptions are rewritten to describe the generated niche
  questionnaire / offer page rather than an unrelated "weight loss transformation".
- **Instruction interpolation.** The current regex substitution over the words
  "your page URL" is replaced with the explicit `{LINK}` token the descriptions already
  use, so no phrasing is silently missed or mangled.

## Copy changes

- Subtitle: "100+ free traffic sources" → 180.
- Step 1: "get 100+ traffic sources specifically for your market" → "20 hand-picked
  traffic sources for the exact niche you built in".

## Constraints

- Source data stays in TypeScript; the `autopilot_sources` table in the catalog guide
  remains unused, so there is no Supabase migration in this change.
- No change to `/api/premium/autopilot/settings` or `/completions` request shapes.
- Existing pagination (`PAGE_SIZE = 24`) is unchanged; the "All" tab lists 180 with
  "Show more".

## Out of scope

- Aligning the separate hardcoded `NICHES` list inside `premium-instant`.
- Moving traffic sources into Supabase.
- AI-generated per-source outreach comments (`POST /api/generate-comment`).
- Mapping or purging stale completion rows.
