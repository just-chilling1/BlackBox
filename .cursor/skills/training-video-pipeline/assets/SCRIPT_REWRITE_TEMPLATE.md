# Training Script Rewrite Template

A reusable playbook for rewriting old training-video transcripts into clean,
TTS-ready scripts (ElevenLabs) that match the current product UI.

Copy this file into the new project, fill in Part A, then rewrite each video
following Part B and check it against Part C before generating audio.

---

## Part A — Project Setup (fill this in once per product)

### A1. Branding map

Replace every old name with the current user-facing name. List every rename:

| Old name (in transcripts) | Current name (in the app) |
|---|---|
| e.g. `P55` | e.g. `Robinhood` |
| e.g. `Done For You vault` / `DFY` | e.g. `Accelerator` |
| e.g. `Instant Income` | e.g. `Recurring Streams` |
| e.g. `Autopilot` | e.g. `Social Payouts` |
| _add more..._ | |

### A2. Current UI inventory

Open the app and copy the exact labels. Scripts may ONLY use these.

- **Sidebar / nav items:** _(list exactly as shown, e.g. Dashboard, Gold Rush, My Vault, Your links, Academy)_
- **Page titles:** _(list)_
- **Key buttons per feature:** _(e.g. "Find Viral Opportunities", "Generate Comment", "Unlock Accelerator Library")_
- **Sections referenced in videos:** _(e.g. Quick Actions, Premium Tier)_

### A3. Removed / changed UI (do NOT mention)

List anything old transcripts reference that no longer exists or moved:

- _(e.g. old green banner, floating "Withdraw Now" popup, pause buttons, videos that were deleted, flows that now work differently)_

### A4. Approved claims & CTAs

- **Money claims allowed verbatim:** _(list, or "none — generalize everything")_
- **Approved CTA lines:** _(e.g. "Watch the free training while it's still available", "Go to Academy for the full walkthrough", "Upgrade to X to unlock this")_
- **CTA link placement rules:** _(where in the app / video the CTA is valid)_

### A5. Video list

| # | Video title | Feature covered | One-line job of this video |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## Part B — Rewrite Rules (apply to every script)

### B1. Rebrand first
Do a find-and-replace pass using the A1 branding map before anything else.
If the app's sidebar, page title, or button text differs from the old script,
the script must use the app's label.

### B2. Match the UI exactly
Every time the speaker points at something, the words must match what's on
screen. Write with the app open. If you can't find it on screen, cut it.

### B3. Remove dead UI references
Cross-check against A3. Every action described must still work in the
current build.

### B4. Generalize money claims
Unless a claim is whitelisted in A4, soften it:

- "$1,000–$5,000 per day" → "scale to higher daily earnings"
- "$7,000/month" → "strong commission potential"
- "first sale within the hour" → "many members see activity soon after posting"

Specific dollar amounts are OK only for on-screen product commission examples
or approved CTAs.

### B5. Clean for TTS (human tutorial voice)

Follow `HUMAN-TUTORIAL-STYLE.md` in full. Minimum bar:

- Remove filler (`uh`, `um`), false starts, self-corrections, repeated words,
  and transcript artifacts.
- Write for the ear: sentences under ~20 words, one instruction per breath in
  walkthroughs, more contractions than looks right on the page.
- Tutor moves: "Go ahead and click…", "You should see…", "If it says X for a
  second — that's normal", micro-recaps before the next step.
- Aphorism budget: max 1–2 clever one-liners per script. Plain speech wins.
- Delivered file = pure spoken paragraphs + approved audio tags only. No
  metadata headers, beat markers, or `(SCREEN:)` cues.
- Approved tags: `[calm] [warmly] [thoughtful] [curious] [confident] [serious]
  [excited] [quietly] [whisper] [whispering] [annoyed] [chuckles] [sighs]
  [short pause] [long pause]`. Prefer ellipses/dashes for pacing over stacking
  pause tags.

**Test:** read it aloud once. If it sounds like a retake or a document being
read, rewrite it.

### B6. Standard structure (every video)
1. **Hook** — "In this video, I'll show you how to use [feature]."
2. **Why it matters** — one sentence on the benefit.
3. **Optional CTA** — only if that CTA still exists at this point in the app (A4).
4. **Step-by-step walkthrough** — exact user flow, in order: where to click →
   what opens → what to fill in → what to press → what appears → what to do next.
5. **Action reminder** — e.g. "Copy, paste, done."
6. **Close** — "That's it. Start using [feature] now."

### B7. One feature = one job
Each video teaches one workflow. Don't explain other features unless the flow
requires it.

### B8. Write for screen recording
Use clickable language: "On the left, click…", "Scroll down here…", "Paste
your link in this field…", "As you can see…". Avoid vague references ("over
there", "that thing from earlier") and steps the viewer can't see.

### B9. Rewrite procedure (per video)
1. Paste the old transcript.
2. Apply the A1 branding map.
3. Rewrite each paragraph into clean instructional English.
4. Swap outdated UI references for current ones (A2/A3).
5. Soften money claims (B4 / A4).
6. Cut filler and repetition (B5).
7. Read aloud and tighten.

---

## Part C — Final QA Checklist (per script, before generating audio)

- [ ] Old brand/feature names all replaced (A1)
- [ ] Every button/page name matches the current UI (A2)
- [ ] No references to removed UI (A3)
- [ ] No unapproved income guarantees (A4)
- [ ] No filler words, retakes, or self-corrections
- [ ] Steps follow the exact order a user would click
- [ ] One feature, one job — no scope creep
- [ ] CTAs are intentional and still valid
- [ ] Opening hook and clean close are present
- [ ] Read aloud once — flows naturally at speaking pace

---

## Example transformation

**Old:**
> "Uh, so right after you log into P-55, you will see the Done For You right
> here, and click Unlock Done For You Library, and you can make one thousand
> to five thousand dollars per day."

**Rewritten:**
> "After you log into Robinhood, open Accelerator from the sidebar. Enter your
> product name and affiliate link, then click Unlock Accelerator Library.
> Robinhood gives you proven videos and ready-made comments so you can start
> posting right away."
