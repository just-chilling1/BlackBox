# Training Video System — Master Template

The complete playbook for producing every training video a software product ships
with. Reusable across all products. Fill in Part 1 once per product, then produce
the videos in Part 2 (Dashboard) and Part 3 (Academy) following their specs.

**Companion files (keep all four together in each project):**
- `pre-training-video-script-guide.md` — the full operating manual for the
  Buyer's Remorse and Disconnect videos (beat sheets, psychology, craft rules).
  Dashboard videos 1 and 2 are written by executing that guide.
- `HUMAN-TUTORIAL-STYLE.md` — mandatory voice: writing for the ear, tutor moves,
  ElevenLabs v3 audio tags, TTS-ready file format (no metadata / beat markers).
- `SCRIPT_REWRITE_TEMPLATE.md` — used only when converting OLD transcripts of an
  existing product into clean scripts. This file is for writing NEW videos.

**Overrides to the guide (product-line policy):**
- Ignore the guide's FTC compliance section (Part 5.8) and FTC-safe wording
  rules. Money claims follow the product's funnel copy: compelling and specific
  where the funnel already makes the claim (e.g. "$1,000–$5,000 per day" style
  CTAs). Match the sales page's energy — the videos should never be more timid
  than the page that sold the product.
- The Buyer's Remorse micro-action IS the free-training CTA (see 2.1), not an
  in-app feature walkthrough — but the CTA must point at the **real** placement
  mined from the current Home / Exclusive Offers / bonus-training UI. Never
  invent "the banner below this video" if Home has no banner there.
- Delivered scripts follow `HUMAN-TUTORIAL-STYLE.md` format: pure spoken
  paragraphs + audio tags only (no header blocks, beat markers, or SCREEN cues).

---

# PART 1 — PRODUCT SETUP (fill once per product, before writing anything)

Mine the repo first. Follow the Repo Mining Protocol in the guide (Part 3) and
produce its four artifacts. Then complete the additions below.

## 1.1 The guide's four artifacts (required)

- [ ] **Product Fact Sheet** — promise, price, dream customer, Point A → Point B,
      vehicle, mechanism, unfair advantage, core loop, first win, proof, guarantee.
- [ ] **Jargon Ledger** — every term a beginner won't know, scored and ranked,
      with plain definition + everyday analogy + why-you-care per term.
- [ ] **Money Map** — the numbered chain of where the user's money comes from,
      the weakest link, and what the software changes about it.
- [ ] **First Win** — smallest visible-result action (used in the Disconnect
      video close; the Buyer's Remorse CTA is the free training instead).

## 1.2 Branding map

| Old / internal name | Current user-facing name |
|---|---|
| | |

Every script uses ONLY current user-facing names. If the app's sidebar, page
title, or button text says it differently, the script follows the app.

## 1.3 UI inventory (exact labels only)

- **Sidebar / nav items:**
- **Page titles:**
- **Key buttons per feature:**
- **Every LOADING state in the app** (critical — see 1.5): list each place the
  user triggers something that loads (generating, searching, unlocking,
  saving). These are the free-training CTA moments.

## 1.4 The free training (mine every offer surface)

Products often have MORE THAN ONE offer banner. Record each one separately.

For each banner / CTA surface:
- **Component name** (e.g. EarningsBanner, WelcomeOfferBanner, Exclusive Offers row, yellow Step 2 button)
- **Verbatim on-screen copy** (headline, sub, CTA label)
- **Destination URL** (do not assume every "Free Training" label goes to the same webinar — some go to sister offers)
- **Where it appears** (Home under video? sidebar Exclusive Offers? generation loading states? Contact Support success?)

Also record:
- **The one-line spoken pitch** that matches the CURRENT banner language (e.g. "scale to one thousand — even five thousand dollars a day" — not stale "multiply" copy from an older build)
- **Scarcity angle** actually on screen
- **Video 01 CTA placement** (the real click path a member can take while watching Home video 1)

## 1.5 Free-training mention map

Rule: **each video mentions the free training at most ONCE**, placed at the most
natural moment for THAT video:
- **Video 01:** the real Home CTA mined in 1.4 (sidebar Exclusive Offers, yellow bonus button, etc.) — never a fictional under-video banner.
- **Academy / walkthrough videos:** the loading/generating moment when the on-screen banner actually appears.
- If a video has no loading moment, the mention goes where the user journey naturally pauses.

| Video | The loading moment used | Approx. timestamp target |
|---|---|---|
| | | |

## 1.6 Video roster

| # | Track | Video | Feature(s) covered | Target length |
|---|---|---|---|---|
| 1 | Dashboard | Buyer's Remorse | — | 10+ min |
| 2 | Dashboard | Disconnect | — | 10+ min |
| 3 | Dashboard | Quick Overview | whole app, shallow | 3–5 min |
| 4+ | Academy | one per main function block (max 3) | | 5+ min each |
| … | Academy | one per upgrade | | 5+ min each |

**How to split the main-app Academy videos:** count the distinct jobs the core
software does. One job (e.g. generate + a vault to save results) = 1 video. Two
clearly separate workflows = 2 videos. Never more than 3 for the core app.
Upgrades always get exactly 1 video each.

---

# PART 2 — TRACK A: THE 3 DASHBOARD VIDEOS

These play in the dashboard, in order. Each video should feel like it hands the
viewer to the free-training CTA at its peak moment — but only using a CTA that
actually exists on that screen (mined in 1.4).

## 2.1 Video 1 — Buyer's Remorse (10+ min, ≥1,600 words)

**Write it by executing the guide, Part 4, beat by beat.** All 12 beats, all
word budgets, all craft rules — then deliver the final file in the pure spoken
format from `HUMAN-TUTORIAL-STYLE.md` (no headers / beat markers). Summary of
the job: the buyer just paid and the doubt voice is coming tonight. Kill the
regret, re-sell the decision as identity, name their exact doubts verbatim,
normalize with the psychology, future-pace the destination, arm them against
skeptical friends, tell the honest-effort truth, then convert the restored
excitement into ONE action.

**Product-line modifications to the guide:**
- **Beat 10 (micro-action) = the free training.** The action uses the REAL
  Home CTA from 1.4. Examples that are valid only when they exist in that app:
  "scroll to Step 2: Bonus training and hit the yellow button", or "look at the
  sidebar → Exclusive Offers → Watch this Free training / Fast Cash Training".
  Never say "look right below this video at the Free Training banner" unless
  that banner is actually rendered under the Home video in the current build.
  Sell it as the single highest-leverage thing they can do in the next 5
  minutes. Use the scarcity angle from 1.4. This is the video's ONE
  free-training mention, so make it land hard.
- **Beat 11 / map:** only claim "two more short videos right here on this
  dashboard" if Home actually stacks those videos. Many apps have ONE Home
  intro video and put the rest in Training — say that instead.
- **Beat 12 (open loop)** points to Video 2: "next video, I'll show you exactly
  how this machine turns clicks into commissions and what every word in this
  app means — most people skip it and stay confused; don't be most people."
- Money language follows the funnel, not the FTC section: if the funnel promises
  a number, the script may use it with full confidence.
- Voice: match the hand-cleaned BatteryProfits `01-buyers-remorse.md` register
  (human, flowing, persuasive — not listicle, not aphorism-stacked).

**QA:** run the guide's 4.9 rubric (skip the compliance items) + Part 5 below.

## 2.2 Video 2 — Disconnect (10+ min, ≥1,600 words)

**Write it by executing the guide, Part 5, beat by beat.** All 10 beats. Summary
of the job: close the gap between the promise they bought and the machine they
now own. One-sentence money model + one everyday master analogy, then who pays
whom and why, then where the software sits (the weakest link it automates), then
Jargon School (6–10 terms: definition ≤15 words + analogy + why-you-care +
`(SCREEN:)` cue), then one named character running one full loop end-to-end
using every term, then the three doubts (vehicle / me / circumstances), then the
honest math, then how to consume the training, then the First Win close.

**Product-line modifications:**
- The free-training mention (once) goes in the beat where the screen naturally
  shows something generating — usually the software-walkthrough beat (Beat 4) or
  the story pass (Beat 6). Weave it in fluidly as something appearing on screen
  ("and see that banner under the progress bar? that's the free training…").
  Never announce the production rule ("one mention per video, so here it is").
- Beat 8 honest math may use the funnel's numbers; keep it concrete and simple
  enough to do in your head.

**QA:** run the guide's 5.10 rubric (skip the compliance items) + Part 5 below.

## 2.3 Video 3 — Quick Overview (3–5 min, ~450–750 words)

A fast, confident lap around the whole product. NOT training — orientation.
The viewer should end knowing what exists, where it lives, and what order to
do things in. Details are the Academy's job, and the script says so.

**Beat sheet:**

| # | Beat | Words | Job |
|---|---|---|---|
| 1 | Hook | 40–60 | "Let me give you the full tour in five minutes — where everything is and what to do first." |
| 2 | The dashboard | 60–90 | What they're looking at right now: stats, quick actions, these videos, the banner |
| 3 | The core function(s) | 120–180 | Walk the sidebar top to bottom: each main feature in 2–3 sentences — what it does, when to use it. No how-to. |
| 4 | The vault/save/tracking areas | 50–80 | Where their work lives and why that matters |
| 5 | The upgrades | 60–90 | Name each upgrade in one sentence of benefit ("if you have X, it's here; if not, this is what it does") |
| 6 | The Academy hand-off | 60–90 | "Every one of these has a full training in the Academy — that's your next stop." Consumption order. |
| 7 | Close | 40–60 | One free-training mention if not used earlier + "start with the Academy, see you there." |

**Rules:**
- Never explain HOW to use a feature — only WHAT it is and WHEN they'd click it.
- Every page named must match the UI inventory (1.3) exactly.
- Pace is quicker than the first two videos, but still human — a friend walking
  you through their house, not an airport announcement.

---

# PART 3 — TRACK B: THE ACADEMY VIDEOS (value bombs)

Full, detailed trainings. One per core function block (max 3 for the main app),
one per upgrade. **Minimum 5 minutes each (≥750 words at 145wpm) — but length
follows value; a 9-minute video that's all substance beats a 5-minute one that
made the floor.**

## 3.1 The standard every Academy video must hit

Each video is a mini YouTube masterclass, not a screen tour. The test: if this
video were posted publicly, would people comment "can't believe this is free"?
Every video must contain ALL of:

1. **The walkthrough** — every click of the feature's workflow, in the exact
   order a user performs it, using exact UI labels.
2. **Best practices** — at least 3 concrete "do it this way, not that way"
   moments (e.g. which niches to pick, how many comments per day, when to
   re-run, what to avoid).
3. **A "get more out of it" layer** — at least 2 power moves a casual user
   would never discover (combos with other features, scaling patterns,
   delegation, tracking).
4. **The why underneath** — for each major step, one sentence on WHY it works,
   so the user trusts the process instead of memorizing clicks.
5. **A concrete mini-scenario** — at least once, ground the workflow in a
   named example ("say you're promoting a weight-loss product…") and run real
   steps with it.

## 3.2 Beat sheet (every Academy video)

| # | Beat | Job |
|---|---|---|
| 1 | Hook | What they'll be able to DO by the end of this video, in one sentence. No throat-clearing. |
| 2 | Decision reinforcement (UPGRADE VIDEOS ONLY) | 30–60 seconds: "upgrading to this was the smart move, here's what you just skipped past everyone else on." Warm, proud, brief — then straight to work. |
| 3 | The big picture | **One short breath only** — what this page is for ("this is where the pictures come from"). Do NOT open with "Station N of the loop / Where this sits in the money flow / Remember the model…" and then later restate that same loop. |
| 4 | The walkthrough | Step-by-step with exact labels, one action per breath. Spoken format only in the delivered file (no `(SCREEN:)` cues left in). |
| 5 | The free-training moment | When the walkthrough hits the feature's loading state (see 1.5), notice the banner **fluidly** for ~20–35 seconds: what it is, the scarcity line, "register while this finishes." Once per video. **Never** say "one mention per video, so here it is" or any meta about mention count. |
| 6 | Best practices + power moves | The 3.1 items #2 and #3 — the value-bomb core |
| 7 | Mini-scenario | Run **this feature's workflow** once with a named example (topic → clicks → result on this page). Do **not** re-narrate the whole product money loop (image→link→pin→commission etc.) — Disconnect already did that. |
| 8 | Common mistakes | 1–3 things people do wrong with this exact feature and the fix |
| 9 | The action close | The exact thing to do the moment the video ends — specific, small, today |

## 3.3 Voice: the amazing founder

Every script must sound like the software's inventor personally showing a friend
around — someone brilliant who's made real money with this exact tool and is
genuinely excited to hand over the keys. Concretely:

- First person singular throughout. "I built this because…", "what I do is…",
  "trust me on this one."
- **Insider generosity:** at least twice per video, share something framed as
  privileged knowledge — "here's what nobody tells you", "we tested this for
  months so you don't have to", "this next part is where our top members
  separate from everyone else."
- **Predictions:** tell them what they'll see/feel before they see it ("the
  first time you hit this button you're going to think it broke — it didn't,
  it's doing X").
- **Ownership language:** "your vault", "your machine", "your first commission"
  — never "the user's".
- Human texture: contractions, short sentences, occasional dry humor, real
  enthusiasm at the genuinely good parts. Never corporate, never monotone-hype.
- It must survive the read-aloud test: if a sentence can't be spoken in one
  breath, split it.

## 3.4 What Academy videos must NEVER do

- Explain a Jargon Ledger term from scratch — that's the Disconnect video's
  job; a 5-word reminder is fine ("your niche — the aisle you own").
- Mention the free training more than once.
- Narrate the free-training production rule ("one mention per video, so here
  it is", "once per video…", etc.). The pitch must sound like natural speech.
- Restate the full money loop twice — no "Station one / where this sits…"
  orientation plus a second end-to-end loop in the mini-scenario.
- Describe UI that doesn't exist in the current build (verify against 1.3).
- Read the screen ("now I am clicking the blue button") without adding intent
  ("I'm clicking Generate — this is where the AI takes over").
- Pad. If a beat has nothing valuable, cut it and let the video be shorter —
  but if it's under 5 minutes, the video is missing best practices or power
  moves, not words.

---

# PART 4 — UNIVERSAL CRAFT RULES (all videos, both tracks)

## 4.0 ElevenLabs v3 delivery spec (scripts are read by Eleven v3)

Scripts must sound like a human talking, not an essay being read. Two layers:

**Layer 1 — write like real speech.**
- Use spoken connectors constantly: "Well…", "Look —", "Okay, so…", "Now…",
  "Honestly?", "And listen…", "Here's the thing…", "you know what's funny?",
  "Right?", "Anyway —". A narration paragraph with zero connectors is a fail.
- Let thoughts breathe: trailing ellipses for hesitation ("and that's…
  that's the whole game"), short fragments, rhetorical questions the narrator
  answers himself, occasional restarts ("It's — okay, let me say it this way.").
- Vary sentence length hard: a long flowing sentence followed by a two-word
  punch. Like this.
- CAPS for single-word emphasis, sparingly (1–2 per beat max): "you do it ONCE."

**Layer 2 — v3 audio tags (square brackets, not spoken aloud).**
- Emotional/delivery tags placed immediately before the text they affect:
  [warmly], [excited], [chuckles], [sighs], [pause], [whispers], [serious],
  [curious], [confident], [laughs softly].
- Budget: roughly one tag per 3–5 sentences. Tags support the text — the words
  themselves must already carry the emotion (v3 reads surrounding context).
- Max 2 stacked tags, never contradictory ones.
- Standard punctuation does the rhythm work: ellipses = pauses, dashes = beats,
  exclamation marks still ≤2 per script.

**Production notes (put at the top of every delivered script):**
- Generate per beat — each request under ~2,000 characters (v3 reliability limit).
- Voice: Instant Voice Clone or designed voice (PVCs aren't v3-optimized yet).
- Settings: stability 0.3–0.5 (higher flattens the tags), similarity 0.7–0.9.
- v3 is non-deterministic: generate 2–3 takes per beat and keep the best.

These mirror the guide's Part 6 — the essentials:

- **Pacing math:** 145 wpm. 10 min ≈ 1,600 words (floor for videos 1–2).
  5 min ≈ 750 words (floor for Academy). 3–5 min ≈ 450–750 (Overview).
  State word count + estimated runtime on every delivered script.
- **Write for the ear:** short sentences (avg <15 words), contractions always,
  second person present tense, one idea per sentence, no rattled-off lists —
  narrate sequences as steps in time.
- **Retention:** open with a pattern interrupt, plant an open loop every 60–90
  seconds and close every one, re-engagement spike every ~2 minutes ("here's
  the part nobody tells you…"), never signal the ending early.
- **TTS-clean ≠ sterile:** no transcript artifacts ("uh", "um", accidental
  repeats, broken retakes) — but DELIBERATE spoken connectors, hesitations,
  and restarts per 4.0 Layer 1 are required, not forbidden. The test: does it
  sound like a person talking, or an article being read? Numbers rounded for
  speech unless the exact number is the point.
- **Screen cues:** `(SCREEN: ...)` on its own line wherever the visuals carry
  the meaning — every walkthrough step, every jargon term, every money moment.
- **Format:** header block (script name, version, word count, runtime, sources
  mined, owner-input count), beat markers as `--- BEAT N: NAME ---` comments,
  `[PAUSE]` / *emphasis* cues sparingly. Filename:
  `{product-slug}-{video-slug}-script-v{n}.md`.
- **Never invent facts.** Every product claim traceable to the repo, funnel, or
  owner input. Missing data gets `[OWNER INPUT: what's needed]`, never a guess.

---

# PART 5 — FINAL QA (run per script before generating audio)

**Every video:**
- [ ] Length floor met (V1–2: ≥1,600 words · Academy: ≥750 · Overview: 450–750)
- [ ] Word count + runtime stated in header
- [ ] Free training mentioned exactly ONCE, at the mapped loading moment (1.5)
- [ ] Every page/button name matches the UI inventory (1.3) exactly
- [ ] No old/internal names (1.2); no removed-UI references
- [ ] No jargon before the Disconnect video defined it (or 5-word reminder used)
- [ ] Reads aloud clean: contractions, one-breath sentences, no stumbles
- [ ] Sounds like the founder talking to one person — zero corporate tone
- [ ] Human-speech pass (4.0): spoken connectors present in most paragraphs,
      ellipses/dashes for breath, v3 audio tags ~1 per 3–5 sentences, ≤2 caps
      emphases per beat
- [ ] `(SCREEN:)` cues present at every visual-dependent moment
- [ ] Ends with a specific action, never "good luck" or "enjoy"

**Video 1 (Buyer's Remorse):** guide rubric 4.9 passed (minus compliance items);
micro-action is the free-training banner; open loop to Video 2 present.

**Video 2 (Disconnect):** guide rubric 5.10 passed (minus compliance items);
master analogy present; all Ledger terms defined-before-use; story pass re-uses
every term.

**Video 3 (Overview):** no how-to anywhere; every feature named; Academy
hand-off with consumption order present.

**Academy videos:** all five 3.1 elements present; ≥3 best practices; ≥2 power
moves; mini-scenario runs THIS feature's workflow only (no full money-loop restatement); upgrade videos open with 30–60s
decision reinforcement; common-mistakes beat present.

---

# PART 6 — PRODUCTION ORDER (per product)

1. Complete Part 1 (mine the repo, fill every table).
2. Write Video 1 (Buyer's Remorse) → QA → deliver.
3. Write Video 2 (Disconnect) → QA → deliver.
4. Write Video 3 (Overview) → QA → deliver.
5. Write Academy core-app videos (1–3 of them) → QA → deliver.
6. Write Academy upgrade videos (one per upgrade) → QA → deliver.
7. Cross-check the whole set: consumption order makes sense, no video contradicts
   another, the free-training mention map (1.5) has no doubles.
