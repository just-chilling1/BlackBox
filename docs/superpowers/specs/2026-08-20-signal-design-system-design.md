# NullPing Cash — Signal Design System

**Date:** 2026-08-20  
**Status:** Approved for spec review  
**Approach:** Signal palette (dark product UI + mint-teal accent)

## Goal

Unify and upgrade the full product surface — member dashboard, auth/marketing chrome, and public money-page themes — around one coherent design system: clearer hierarchy, stronger contrast, less neon glow, and a “activate / performance” accent instead of cyan-as-everything.

## Non-goals

- Redesigning logo artwork from scratch (token-tint / CSS only unless assets already mismatch badly)
- Per-feature layout rewrites beyond shared component/token consistency
- Adding light mode
- Changing money-page *variation* architecture (Ocean / Forest / Sunset / Slate stay)

## Current state (baseline)

- Tokens split across `src/config/brand.config.ts`, `src/lib/brand-vars.ts`, and a large `:root` block in `src/app/globals.css`
- Accent is cyan `#22D3EE` used for CTAs, borders, glow, vault gold alias, and promo
- Fonts: Space Grotesk (brand) + Inter (UI)
- Surfaces lean glass/glow; many hardcoded `#22D3EE` / cyan rgba values in CSS and components
- Public money pages use separate theme CSS in `src/features/money-page/lib/themes.ts` (Ocean default is cyan-teal family)

## Design principles

1. **One source of truth** — brand config drives CSS vars; components use tokens, not hex literals.
2. **Signal, not glow** — accent means action (CTA, focus, success-adjacent); depth comes from surface steps and hairlines.
3. **Readable dark UI** — AA contrast for body and muted text on canvas/surface.
4. **Same product everywhere** — auth, shell, and default public Ocean theme feel related.

## 1. Color system

### Member / auth canvas

| Token role | Approx value | Notes |
|---|---|---|
| Canvas | `#080C12` | Cool charcoal, less cyan-black |
| Surface (panel) | `#121820` | Primary cards / glass replacement |
| Surface sub (sidebar) | `#0C1016` | Darker chrome |
| Surface field | `#0E141C` | Inputs inset |
| Surface tint | `#0A1F1C` | Soft signal wash under accents |
| Ink strong | `#F1F5F9` | Headings |
| Ink | `#E2E8F0` | Body |
| Ink muted | `#94A3B8` | Secondary (verify contrast on canvas) |
| Line | `rgba(241,245,249,0.08)` | Default border |
| Line strong | `rgba(241,245,249,0.16)` | Hover / emphasis |
| Line signal | `rgba(45,212,191,0.32)` | Focus / active chrome |

### Signal accent (replaces pulse cyan)

| Step | Value | Use |
|---|---|---|
| Signal 100 | `#0A1F1C` | Tint backgrounds |
| Signal 200 | `#0F2E2A` | Soft chips |
| Signal 300 | `#1A5C54` | Borders / icons muted |
| Signal 500 | `#2DD4BF` | Primary CTA, links, key UI accent |
| Signal 700 | `#5EEAD4` | Hover / readable on dark |
| Signal 900 | `#042F2A` | Text on solid signal buttons |

Rename conceptually from “pulse” → “signal” in new token names. Keep `--np-pulse-*` as **aliases** during migration so Tailwind/`@theme` and existing classes do not break in one shot; then remove aliases in a follow-up if desired.

### Semantic

- Success: keep green-adjacent (`#34D399` or slightly closer to signal — do not merge with CTA)
- Danger / warning: keep current roles (`#F87171`, `#FBBF24`)
- Promo / vault accents: map to signal 500 (drop “vault gold = cyan” confusion)

### Shadows

- Card: soft dark elevation only (no heavy cyan glow by default)
- Hover: slight lift + optional very soft signal tint (`rgba(45,212,191,0.12)` max)
- Pulse/glow shadow: reserved for intentional “live” states (generation in progress), not every button

## 2. Typography

| Role | Family | Notes |
|---|---|---|
| Brand / headings | Space Grotesk | Keep |
| UI body | Plus Jakarta Sans | Replace Inter |

### Scale (rem @ 16px root)

| Step | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| Display | 2rem | 700 | 1.15 | Rare marketing hero |
| Title | 1.5rem | 700 | 1.2 | PageHeader h1 |
| Section | 1.125rem | 600 | 1.3 | Panel titles |
| Body | 1rem | 400–500 | 1.5 | Default |
| Caption | 0.875rem | 500 | 1.4 | Meta, helpers |
| Micro | 0.75rem | 600 | 1.3 | Badges, overlines |

Load Plus Jakarta Sans via existing Next font pipeline (same pattern as Inter today). Update `brand.fonts.ui`.

## 3. Spacing & radius

**Spacing scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 (px) → `--np-space-*`

| Semantic | Token | Value |
|---|---|---|
| Panel padding | `--np-space-panel` | 24px |
| Section stack | `--np-space-section` | 24–32px |
| Control gap | `--np-space-stack` | 16–20px |

**Radius:** 8 / 12 / 16 (`sm` / `md` / `lg`). Pills only for true chips/status, not primary buttons.

## 4. Components (shared UI)

Apply tokens to:

- `PageHeader`, `GlassPanel` → prefer opaque surface + hairline (rename behavior, keep export name if needed)
- Primary / secondary / ghost button classes in `globals.css`
- `WorkflowSteps`, `EmptyState`, `ErrorBanner`, inputs (`GlassInput`)
- Sidebar + shell (`Sidebar`, `Shell`, nav active states)
- Auth pages (same canvas + signal CTA)

### Button rules

- **Primary:** `signal-500` fill, `signal-900` label, hover `signal-700` fill or brighten
- **Secondary:** transparent + `line-strong` border, ink label
- **Ghost:** text only, signal on hover
- Do not use multi-layer glow on resting primary buttons

### Hardcoded color sweep

Replace literals `#22D3EE`, `#5BE7F5`, and cyan rgba glows in app shell CSS/components with `var(--np-pulse-500)` aliases (pointing at signal) or new `--np-signal-*` names once wired.

## 5. Full-surface mapping

### Auth / marketing chrome

Same `--np-canvas`, surfaces, type, and signal CTAs as dashboard. Particle / decorative backgrounds: desaturate cyan particles to signal/slate; reduce intensity.

### Money pages (`themes.ts`)

Keep four themes. Retune **Ocean** default accents toward signal teal so visitor pages feel related to NullPing:

- Ocean accent mid ≈ `#0D9488` / `#14B8A6` family (aligned with signal, still light-theme appropriate)
- Forest / Sunset / Slate: leave structure; optional micro-contrast polish only if cheap

Money pages stay **light** canvases; do not force dark shell onto public offers.

### Blog / public site themes

Where themes consume brand accent soft/hover, map to signal scale. Do not force all blog presets to mint; only brand-default / Ocean-adjacent paths.

## 6. Token architecture

```
brand.config.ts  →  getBrandCssVars() / layout :root
                 →  globals.css :root (canonical scales)
                 →  @theme inline (Tailwind)
                 →  components
```

Rules:

1. `brand.colors.primary` = signal 500; `secondary` = signal 700  
2. `brand-vars.ts` stays the bridge for server-injected HTML vars  
3. Prefer CSS variables in components over importing hex from TS for paint  
4. Migration: pulse token names remain as aliases → signal values

## 7. Success criteria

- [ ] Member UI, auth, and default Ocean money page share one accent family
- [ ] Primary CTAs read clearly without neon glow
- [ ] No critical new hardcoded cyan in shell components after sweep
- [ ] Heading/body fonts load; Inter removed from UI path
- [ ] Spacing of PageHeader + GlassPanel + workflow pages matches scale
- [ ] Visual QA: Dashboard, Activate, Traffic pins, Auth, one published money page

## 8. Implementation order (high level)

1. Update `brand.config.ts` + `:root` token values (+ signal aliases)
2. Swap UI font to Plus Jakarta Sans in layout
3. Retune button / panel / sidebar CSS in `globals.css`
4. Sweep hardcoded cyan in layout + shared UI components
5. Retune Ocean money-page theme; spot-check auth
6. Visual pass + contrast tweaks

## Risks

- Logo PNGs may still read cyan — accept mismatch short-term or note asset update as follow-up
- Large `globals.css` — change tokens first; avoid drive-by refactors
- Cached pin OG images / marketing screenshots may still show old cyan until regenerated
