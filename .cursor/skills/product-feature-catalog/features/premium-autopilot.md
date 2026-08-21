# premium-autopilot

**Feature ID:** `premium-autopilot`  
**Tier:** PREMIUM

## Description

Curated traffic source checklist for a live money page. User selects a money page (promotion URL), browses forums/groups/directories by niche, copies suggested snippets with tracking links, and marks sources complete.

## User flow

```
/autopilot → Select live money page (saved to profile)
  → Filter sources by niche (20 per niche, 180 total)
  → Each row: name, link, copy-ready description
  → Mark complete → progress tracked → visits in Results
```

## Routes

| Route | Nav label |
|-------|-----------|
| `/autopilot` | Automated Profits |

## APIs

| Endpoint | Purpose |
|----------|---------|
| `GET/PATCH /api/premium/autopilot/settings` | Promotion URL + selected niche |
| `GET/POST/DELETE /api/premium/autopilot/completions` | Track completed sources |
| `GET /api/assets/list` | Live money pages for the picker |

## Env vars

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Supabase

- `user_premium_settings.autopilot_promotion_url`
- `user_premium_settings.autopilot_selected_niche`
- `user_autopilot_completions` — user_id, source_id

## Implementation steps

1. Add `"premium-autopilot"` to `enabledFeatures`
2. Add to `premiumNav` as Automated Profits
3. Catalog: 8 curated + 12 platform playbooks × 9 niches in `src/features/premium-autopilot/lib/`
4. Page: `AutopilotPage.tsx` with LiveAssetPicker + niche filters

## Branding

Customize nav label and page intro. Source names are generic (Reddit, Facebook Groups) — no third-party product names in UI beyond the destination sites themselves.
