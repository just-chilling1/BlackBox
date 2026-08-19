# Phase 2 — Generate the Thumbnails

One 16:9 image per video, generated with the image-generation tool, saved to
`training-video-system/{software-slug}/thumbnails/` as `{prefix}-thumb-{NN}-{slug}.png`
(prefix = software initials, e.g. `pl`, `rh`, `bp`, `ccp`, `sms`, `ct`, `ql`, `aw`).

## Step 1 — Derive the software's visual identity

Every software gets its OWN style. Build it from two sources:

1. **Brand colors** — read the app's `globals.css` (or theme file) and extract the real hex values: background, primary accent, secondary accent.
2. **A visual metaphor** that matches the product's concept. Examples used:

| Software | Palette | Metaphor |
|---|---|---|
| Profit Loop | magenta `#d946ef` + violet on near-black | glowing loop/circuit energy |
| CashTap AI | gold + purple-blue on black | contactless tap-to-pay ripples, phone |
| Q-Labs 2000 | amber + emerald on black | dark sci-fi laboratory, beakers, hex grid |
| AI Wealth | electric cyan + purple on black | holographic UI, circuit-board traces |

Lock a consistent kit for the whole set: number-badge shape (e.g. rounded app-icon square, glowing ring), wordmark text + corner placement, headline treatment (bold condensed white/cream with accent glow).

## Step 2 — The 3 dashboard thumbnails (character-fronted)

Requires the character portrait the user provides. Pass it via `reference_image_paths` AND describe the person in the prompt (age, hair, facial hair, clothing) so likeness holds. Character sits on the right third; headline on the left. Fixed titles and poses:

| # | Title | Pose |
|---|---|---|
| 1 | WATCH THIS FIRST | facing the viewer directly |
| 2 | HOW THE MONEY FLOWS | head TURNED so he's clearly looking LEFT at the text, pointing at a glowing money-flow diagram (product → page/message → visitors → dollar coin) |
| 3 | YOUR 5-MINUTE TOUR | looking LEFT at the text, arms crossed, floating dashboard UI panel + a "5 MIN" clock/stopwatch icon |

Vary the poses — if 2 and 3 come back with the same pose as 1, regenerate (this happened; the user rejects same-pose sets).

## Step 3 — Academy thumbnails (04+, no character)

One per academy video, numbered continuing from 04. Title = the feature's exact user-facing UI label (from `00-setup.md`), e.g. "CHECK DEMAND", "THE AI PROFIT MACHINE". Compose around an illustration of the feature (dashboard panels, icons, the metaphor objects). Upgrade videos get a "PREMIUM" badge.

## Prompt skeleton

> Premium YouTube-style training video thumbnail, 16:9, {style descriptor} for a software called "{NAME}". {Background + palette + metaphor}. {Character block if dashboard}. Large bold condensed white headline text on the left: "{TITLE}" with {accent} glow. Number badge "{N}" in top-left corner as {badge kit}. {Wordmark spec} in the {corner}. High contrast, punchy, premium, cinematic.

## QA before saving

- Zoom in on the wordmark and any UI text — generation can misspell (a "PROFIT LCOP" typo shipped once and needed a regen).
- Number badge correct, style consistent with the rest of the set.
- Copy finals from the generation output dir into the software's `thumbnails/` folder.
