---
name: training-video-pipeline
description: End-to-end pipeline for producing a software product's full training-video package - TTS-ready scripts (ElevenLabs v3), YouTube-style thumbnails, and the first 2 rendered dashboard videos (Remotion). Use when the user asks to create training videos, training scripts, video thumbnails, or run "the training video system" on a new software/member-area product.
---

# Training Video Pipeline

Produces the complete training-video package for a member-area software product, in three phases. Each phase has its own detailed guide — read the guide for the phase you're executing.

| Phase | Deliverable | Guide |
|---|---|---|
| 1. Scripts | `00-setup.md` + one TTS-ready script per video (10–13 files) | [phase1-scripts.md](phase1-scripts.md) |
| 2. Thumbnails | One 16:9 thumbnail per video, branded per software | [phase2-thumbnails.md](phase2-thumbnails.md) |
| 3. Videos | Rendered MP4s for dashboard videos 1 & 2 from the owner's voiceover MP3s | [phase3-videos.md](phase3-videos.md) |

## Inputs required from the user

- **Phase 1:** path to the software's repo (and its sales funnel HTML if available).
- **Phase 2:** a character portrait image (transparent/white background) for the 3 dashboard thumbnails. Academy thumbnails need no character.
- **Phase 3:** voiceover MP3s (one per video), recorded from the Phase 1 scripts. Everything else — running the app locally, bypassing login, screenshots — the agent does itself.

## Preflight checks (run before starting any phase)

- [ ] Repo path exists and is a git repo; `git fetch` + confirm clean/ff-only pull so you're on the latest UI before mining or writing.
- [ ] Identify the framework (Next.js, etc.) and the auth layer.
- [ ] Verify user-supplied file paths character-by-character (`ls | cat -A`) — trailing spaces have broken runs before.
- [ ] Phase 1: `assets/HUMAN-TUTORIAL-STYLE.md` read and applied to every script; `assets/ACADEMY-SERIES-STYLE.md` read and applied to every academy script.
- [ ] Phase 1 live audit: app running on localhost with auth/onboarding bypassed (prefer the product's built-in env bypass if it ships one); every scripted page loaded and clicked through; any code patches reverted.
- [ ] Phase 2: character image received and readable.
- [ ] Phase 3: MP3s exist and decode (check durations); app's deps install and dev server starts; disk has space for renders.
- [ ] Output folder `training-video-system/{software-slug}/` created with `thumbnails/` and `videos/` subfolders.

## Output layout (keep everything here)

All output lives in `{output-root}/training-video-system/{software-slug}/`. Ask the user for the output root (or reuse the one from earlier in the conversation); if none is given, create `training-video-system/` in the workspace root.

```
{software-slug}/
├── 00-setup.md            # Phase 1 artifact (facts, branding map, UI labels, jargon)
├── 01-buyers-remorse.md   # scripts, numbered in viewing order
├── 02-disconnect.md
├── 03-quick-overview.md
├── 04+ ...                # academy scripts (core app, then upgrades)
├── thumbnails/            # {prefix}-thumb-NN-{slug}.png
└── videos/                # rendered MP4s
```

The canonical voice examples are bundled in `assets/voice-reference/` — the skill needs no external folder or past product repo to run.

## The video roster (same for every software)

**Track A — 3 dashboard videos** (character-fronted, play on the dashboard):
1. **Buyer's Remorse** — public title "Watch This First" — 10+ min, kills post-purchase regret.
2. **Disconnect** — public title "How The Money Flows" — 10+ min, explains the money model + jargon.
3. **Quick Overview** — public title "Your 5-Minute Tour" — 3–5 min shallow tour.

**Track B — Academy videos** (Training area): 1–3 videos for the core app (max 3), plus exactly 1 per premium upgrade.

## Standing policies (apply in every phase)

- **Pull the product repo first** (`git pull --ff-only`) before mining UI or writing scripts. Scripts must match the latest build.
- Use ONLY current user-facing names from the app's UI — never old/internal names (apps get renamed; Phase 1 builds a branding map).
- Money claims follow the product's own funnel copy (ignore FTC-safe wording).
- **Free-training ad only where a real wait happens.** Academy videos pitch the free training ONLY if the tool has an on-screen generation/build wait (site build, thread/clone/post generation) — woven into that wait moment, max once. Videos with no loading state (libraries, security/account pages, tours of static pages) get ZERO ad mentions. Dashboard videos use the **real** CTA placement mined from the app (do not assume a banner under the Home video; many apps use sidebar Exclusive Offers, a gold dashboard card, or a bonus-training button). Document every banner type and its destination URL in `00-setup.md`.
- **Fluid free-training mentions only.** When the banner appears, weave it into the moment like a real tutor noticing something useful on screen. Never narrate the production rule out loud — ban phrases like "one mention per video, so here it is", "once per video, so here it is", "this is the one time I'll mention it", or any meta aside about how many times you'll pitch it.
- **Academy scripts follow `assets/ACADEMY-SERIES-STYLE.md`** — the series arc (first/welcome-back/final openers, numbered premium features, sign-offs), the recurring blocks (prerequisite callback, support close, "Here is how:" click paths, both-ways premium navigation), and the owner's merged-paragraph casual voice. The bundled `assets/voice-reference/` scripts are the canonical reference.
- **On-screen numbers win.** When a page displays concrete numbers or advice (best-practice cards, posting limits, time windows, counts), the script's guidance must match them — never contradict what the member reads on screen.
- **Owner-edited scripts get surgical rewrites.** When updating an existing hand-edited script to match new UI, preserve the owner's sentences and voice; change ONLY the claims the live audit disproved, plus genuine misspellings (TTS must pronounce words correctly). Never re-generate the whole script from scratch.
- **No loop-repeat.** Do not open a walkthrough with "here's the full loop / station one of the loop / where this sits in the money flow" and then later re-narrate that same end-to-end loop again. One short orientation breath is enough; the mini-scenario demonstrates *this feature's workflow* with a concrete example — it does not restate Disconnect's whole money model.
- Never invent proof/testimonials — rewrite around missing proof; do not leave `[OWNER INPUT: ...]` in the final spoken script.
- Scripts are read by ElevenLabs v3 in a **human tutorial voice** — see `assets/HUMAN-TUTORIAL-STYLE.md`. Pure spoken paragraphs + audio tags only (no metadata headers, beat markers, or screen cues in the delivered files).

## Bundled assets (in `assets/`)

- `TRAINING_VIDEO_SYSTEM.md` — master script template (execute this in Phase 1)
- `pre-training-video-script-guide.md` — beat sheets for videos 1 & 2
- `HUMAN-TUTORIAL-STYLE.md` — writing-for-the-ear + tutor moves + ElevenLabs v3 tag rules (mandatory voice)
- `ACADEMY-SERIES-STYLE.md` — academy series arc, recurring blocks, ad-placement rule, owner voice (mandatory for Track B)
- `voice-reference/` — canonical owner-approved scripts (taste anchors; see its README)
- `SCRIPT_REWRITE_TEMPLATE.md` — only for converting OLD recorded transcripts
- `transcribe.py` — mlx-whisper word-level transcription
- `align.py` — worked example: anchors → slide timings + captions (set `BASE` to the new working dir)
- `capture.js`, `signup-capture.js` — Playwright screenshot capture
- `remotion/` — the full Remotion video project source (copy + rebrand per software)
