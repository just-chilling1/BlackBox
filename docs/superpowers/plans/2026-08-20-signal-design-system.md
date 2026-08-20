# Signal Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Roll out the Signal design system (mint-teal accent, cooler charcoal surfaces, Plus Jakarta Sans, reduced glow) across member UI, auth, and Ocean money-page theme.

**Architecture:** Update `brand.config.ts` as source of truth; mirror values into `globals.css` `:root` with `--np-signal-*` tokens aliased by existing `--np-pulse-*`; swap UI font in `layout.tsx`; retune buttons/panels/sidebar CSS; sweep hardcoded cyan; retune Ocean theme.

**Tech Stack:** Next.js App Router, Tailwind v4 `@theme`, CSS custom properties, `next/font/google`

## Global Constraints

- Keep dark mode only; no light shell
- Keep money-page themes Ocean | Forest | Sunset | Slate (retune Ocean only)
- Keep `--np-pulse-*` names as aliases to signal values (no mass class rename)
- Prefer tokens over hex in shell components
- Do not redesign logo PNGs in this pass
- Product name remains NullPing Cash from `brand.config.ts`

## File map

| File | Role |
|---|---|
| `src/config/brand.config.ts` | Brand color + font names |
| `src/lib/brand-vars.ts` | Injected HTML CSS vars |
| `src/app/globals.css` | Canonical `:root` tokens, buttons, panels, cyan sweep |
| `src/app/layout.tsx` | Plus Jakarta Sans load |
| `src/features/money-page/lib/themes.ts` | Ocean theme retune |
| `src/components/ui/particle-background.tsx` (if cyan hardcoded) | Particle tint |
| Shared UI using brand hex | Token / class alignment |

---

### Task 1: Brand config + injected vars

**Files:**
- Modify: `src/config/brand.config.ts`
- Modify: `src/lib/brand-vars.ts`
- Test: manual assert via reading exported values / `npx tsx` one-liner

- [ ] **Step 1:** Set brand colors to Signal values

```ts
colors: {
  primary: "#2DD4BF",
  secondary: "#5EEAD4",
  promoAccent: "#2DD4BF",
  promoCta: "#2DD4BF",
  page: "#080C12",
  sidebar: "#0C1016",
  panel: "#121820",
  authPage: "#080C12",
  textHeading: "#F1F5F9",
  textPrimary: "#E2E8F0",
  textMuted: "#94A3B8",
  panelGlass: "#121820",
  borderGlow: "rgba(45, 212, 191, 0.12)",
  borderTeal: "rgba(45, 212, 191, 0.32)",
  border: "rgba(241, 245, 249, 0.08)",
  encryptedGreen: "#34D399",
  vaultGold: "#2DD4BF",
},
fonts: {
  brand: "Space Grotesk",
  ui: "Plus Jakarta Sans",
},
```

- [ ] **Step 2:** Update `brand-vars.ts` `--brand-tint` to `#0A1F1C` and ensure vars map to new brand colors (no hardcoded old cyan).

- [ ] **Step 3:** Commit brand config + brand-vars only.

---

### Task 2: Canonical CSS tokens in globals.css

**Files:**
- Modify: `src/app/globals.css` (`:root` block ~lines 60–169)

- [ ] **Step 1:** Add `--np-signal-*` scale; point `--np-pulse-*` at the same values; update canvas/surface/ink/line/gradients/shadows/spacing/radius per spec.

Key values:
- `--np-canvas: #080C12`
- `--np-surface: #121820`
- `--np-surface-sub: #0C1016`
- `--np-surface-field: #0E141C`
- `--np-surface-tint: #0A1F1C`
- `--np-ink-strong: #F1F5F9`
- `--np-ink: #E2E8F0`
- `--np-ink-4` / muted: `#94A3B8`
- `--np-signal-500` / `--np-pulse-500`: `#2DD4BF`
- `--np-signal-700` / `--np-pulse-700`: `#5EEAD4`
- `--np-signal-900` / `--np-pulse-900`: `#042F2A`
- `--np-shadow-pulse` softer: `0 4px 18px -4px rgba(45, 212, 191, 0.35)`
- `--np-shadow-hover` without heavy glow
- `--np-r-sm: 8px; --np-r-md: 12px; --np-r-lg: 16px`
- `--np-space-panel: 1.5rem; --np-space-section: 1.5rem; --np-space-stack: 1.25rem`
- `--font-ui`: Plus Jakarta stack via `--font-plus-jakarta`

- [ ] **Step 2:** Commit token block.

---

### Task 3: UI font — Plus Jakarta Sans

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css` (`--font-ui`)

- [ ] **Step 1:** Replace Inter import with:

```ts
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});
```

Use `plusJakarta.variable` on `<html>` className. Keep Space Grotesk.

- [ ] **Step 2:** Set `--font-ui: var(--font-plus-jakarta), "Plus Jakarta Sans", system-ui, sans-serif;`

- [ ] **Step 3:** Commit font swap.

---

### Task 4: Buttons, panels, cyan sweep in globals.css

**Files:**
- Modify: `src/app/globals.css` (btn / panel / focus / particle-related rules with `#22D3EE` or `rgba(34, 211, 238, …)`)

- [ ] **Step 1:** Primary buttons: solid `var(--np-pulse-500)` fill, color `var(--np-pulse-900)`, remove resting neon multi-shadow; hover brighten to pulse-700.
- [ ] **Step 2:** Replace remaining hardcoded cyan hex/rgba in shell CSS with `var(--np-pulse-500)` / `rgba(45, 212, 191, …)`.
- [ ] **Step 3:** Soften glass panel borders to `--np-line` / `--np-line-pulse`.
- [ ] **Step 4:** Commit CSS component retune.

---

### Task 5: Shared components + particles + pin OG accent

**Files:**
- Modify as needed: `src/components/ui/particle-background.tsx`, `src/components/ui/glass-panel.tsx`, `src/components/layout/Sidebar.tsx`, `src/app/api/pins/[pinId]/image/route.tsx` (brand label color `#2DD4BF`)
- Grep: `#22D3EE|#5BE7F5|34, 211, 238` under `src/components` and `src/app` (exclude money-page Forest/Sunset/Slate)

- [ ] **Step 1:** Sweep grep hits in shell/components to tokens or signal hex.
- [ ] **Step 2:** Commit.

---

### Task 6: Ocean money-page theme

**Files:**
- Modify: `src/features/money-page/lib/themes.ts` (Ocean entry only)

- [ ] **Step 1:** Retune Ocean:

```ts
swatch: "#14B8A6",
css: {
  accent: "#0F766E",
  accentMid: "#14B8A6",
  accentDark: "#115E59",
  accentRgb: "15, 118, 110",
  accentMidRgb: "20, 184, 166",
  ctaPanelEnd: "#134E4A",
  // keep light bg / bgSoft / heroEnd structure
}
```

- [ ] **Step 2:** Commit.

---

### Task 7: Visual verification

- [ ] **Step 1:** `npx tsc --noEmit` or `npm run build` (if time allows prefer `tsc`)
- [ ] **Step 2:** Grep confirm no critical shell `#22D3EE` left in `globals.css` `:root` / buttons
- [ ] **Step 3:** Note manual QA pages: Dashboard, Auth, Activate, Traffic, one money page

---

## Spec coverage

| Spec section | Task |
|---|---|
| Color system | 1–2 |
| Typography | 3 |
| Spacing & radius | 2 |
| Components / buttons | 4–5 |
| Auth chrome | 1–4 (shared tokens) |
| Ocean money page | 6 |
| Token architecture | 1–2 |
| Hardcoded cyan sweep | 4–5 |
