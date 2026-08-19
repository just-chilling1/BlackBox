# Phase 1 — Write the Scripts

Read these four bundled files fully before writing anything:
- `assets/TRAINING_VIDEO_SYSTEM.md` — the master template you execute.
- `assets/pre-training-video-script-guide.md` — the operating manual for videos 1 & 2 (psychology, 12-beat and 10-beat sheets, craft rules).
- `assets/HUMAN-TUTORIAL-STYLE.md` — **how the scripts must sound** (writing for the ear, tutor moves, ElevenLabs v3 tags). Non-negotiable for every script.
- `assets/ACADEMY-SERIES-STYLE.md` — **academy series structure + owner voice** (series arc openers/sign-offs, prerequisite callbacks, support close, ad-placement rule, merged casual paragraphs). Mandatory for every academy script; overrides HUMAN-TUTORIAL-STYLE where they conflict.

Taste anchors (voice register to match — all bundled in `assets/voice-reference/`, see its README; match register, never their branding):
- `assets/voice-reference/academy-first-core-tool.md`, `academy-premium-with-ad.md`, `academy-final-no-ad.md` — the owner's hand-edited academy set. **This is the canonical academy voice.**
- `assets/voice-reference/dashboard-03-quick-overview.md` — the quick-tour register (shallow map, not in-depth).
- `assets/voice-reference/dashboard-01-buyers-remorse.md` — hand-cleaned persuasion register for videos 1 & 2.

(`assets/SCRIPT_REWRITE_TEMPLATE.md` is a separate tool, used only when converting OLD recorded transcripts of an existing product — not for new videos.)

## Workflow

```
- [ ] 0. Pull latest from the product repo (ff-only) and confirm you're on current UI
- [ ] 1. Mine the repo
- [ ] 2. Build 00-setup.md
- [ ] 3. Write scripts in order (01 → 02 → 03 → academy)
- [ ] 4. QA pass (UI match + human voice)
```

**0. Pull first.** Before mining, `git fetch` + `git pull --ff-only` on the product repo. If the working tree is dirty or the pull would conflict, stop and report to the user. Scripts must be written against the latest UI, not a stale local copy.

**1. Mine the repo.** Read: the sidebar component (exact nav labels) · every dashboard / Home page (titles, subtitles, button labels, **how many videos actually sit on Home**, Exclusive Offers labels) · every core + premium page (steps, buttons, niche lists, daily limits) · **every free-training / offer banner component** (copy + href — products often have TWO banners with different destinations) · any video-overlay ad · the funnel HTML (price, promise, guarantee) · any existing `training-scripts.md` (reveals OLD names that must NOT be used).

**Critical mining rule — free-training CTA placement:** do NOT assume a banner sits under the Home video. Many apps moved it. Record the real placement for video 01 (e.g. sidebar Exclusive Offers → "Watch this Free training" / "Fast Cash Training", or a yellow "Step 2: Bonus training" button, or Contact Support success CTA). Loading-state banners are separate and belong to academy walkthroughs.

**2. Build `00-setup.md`** per Part 1 of the template: Product Fact Sheet · branding map (old → current names) · UI inventory (exact labels only) · loading-states table · free-training offer details (**verbatim banner copy + destination URL for each banner type**) · Jargon Ledger · Money Map · video roster + free-training mention map (video 01 uses the real Home CTA, not a fictional under-video banner).

**3. Write scripts in order:** 01 Buyer's Remorse (guide Part 4, 12 beats) → 02 Disconnect (guide Part 5, 10 beats) → 03 Quick Overview → core academy videos → upgrade academy videos. One file per script, numbered.

**4. QA pass:**
- Voice: every paragraph passes the read-aloud test in `HUMAN-TUTORIAL-STYLE.md`. Walkthroughs use tutor moves (direct + confirm, anticipate confusion, micro-recaps). Max 1–2 clever one-liners per script.
- Academy series checks (`ACADEMY-SERIES-STYLE.md`): correct opener for position (first / welcome-back / final), premium features numbered in order, prerequisite callback present after the first academy video, support close verbatim ("2 hours, but allow us 24 to 48 hours on busy days"), "Here is how:" click paths for cross-page actions, sign-off on every academy video ("I'll see you in the next one!") except the final ("And that was all for the training .. I'll see you inside").
- Spelling clean (TTS pronounces it), but do NOT polish the owner's casual punctuation/grammar (".." pauses, lowercase runs, "wanna") into formal prose.
- Format: pure spoken script only — no metadata headers, no `--- BEAT ---` markers, no `(SCREEN:)` cues, no `[OWNER INPUT]` left unresolved (rewrite around missing proof instead of inventing it).
- Word-count floors (spoken words only): videos 1–2 ≥1,600; academy ≥900. Runtime ≈ words ÷ 145. Do NOT pad to hit the floor — cut filler, keep substance.
- Free-training mention: max ONE per script, ONLY in videos with a real on-screen generation/build wait (or the mapped dashboard CTA for Track A), using **current** banner/button language — and it must sound **fluid** (no "one mention per video, so here it is" / no meta about mention count). Videos with no wait state (libraries, security pages) must contain ZERO ad mentions — grep for "free training" to verify.
- No loop-repeat: academy scripts must not restate the full money loop twice (orientation + mini-scenario). Mini-scenario = this feature's steps with a named example only.
- **On-screen numbers:** if the page shows concrete advice numbers (posting limits, pacing, time windows, percentages on best-practice cards), the script must quote guidance consistent with them — a script telling members "2–3 groups a day" while the page says "under 25–50 groups a day" is a fail.
- **Updating owner-edited scripts:** surgical rewrite only — keep the owner's sentences, casual punctuation, and personality beats; change ONLY audit-disproven UI claims plus genuine misspellings (TTS needs correct spelling). Diff the old and new file to confirm nothing else moved.
- Grep every script for old/banned names from the branding map.
- Spot-check 5+ UI labels per script against the live repo strings.
- Grep for banned meta: `one mention per video`, `so here it is`, `Station one of the loop`, `Where this sits in the loop`, `Remember the model —` followed later by another full end-to-end loop.

**5. Live localhost UI audit (mandatory — not optional):**
Do **not** ship scripts from code-mining alone. Fire up the real app and verify every spoken UI claim against rendered pages:
1. Start the product's dev server locally (`npm run dev`) **as a managed background process** (the agent shell's background command, `nohup`, or equivalent). A naive `npm run dev &` inside a one-shot shell dies the moment that shell exits — if `curl` returns `000` and the log stops after the npm header, this is why.
2. Bypass auth/onboarding — **check for a built-in bypass first**: grep the repo for `BYPASS`, `dev-bypass`, `DEV_BYPASS_AUTH`, `isDevAuthBypass`. Many products ship an env-flag bypass (e.g. `DEV_BYPASS_AUTH=true` in `.env.local` plus a service-role dev user) — if so, use it: zero code patches, nothing to revert. Only when there is none, apply temporary code patches (see Phase 3 §3b) marked `// TEMP SCREENSHOT BYPASS — remove after capture`.
3. With Playwright (or equivalent), open **every** sidebar route: Home, each core tool, Training, each premium upgrade. Put the audit script **inside the app repo** so `import "playwright"` resolves against the app's `node_modules` (a script in `/tmp` won't find the package); delete the script when done.
4. Wait for each page to fully load (`networkidle` + settle delay). Click through gated UI the scripts mention (e.g. pick niche → pick idea → reveal Generate; switch niche tab → expand a source card → reveal Mark Done). Trigger at least one loading state that shows the free-training banner and confirm the on-screen CTA copy matches the script.
5. Fail the script if any quoted label, section name, button, sidebar offer, or Home layout detail is missing/wrong on screen.
   - Assert **rendered order** (compare `getBoundingClientRect().y` of each section you narrate) — a script that walks the page "top to bottom" in the wrong order is wrong even when every label exists. Helper/guide boxes often sit BETWEEN the picker and the content grid, not below them.
   - Assert **gated-button state** (disabled before the required input, enabled after) and **dynamic button labels** (counts change with filters; buttons like "Generate posts" that become "Generate new posts" once history exists).
   - Assert **selection & result behavior**: whether dropdowns come preselected (first item / localStorage) or demand a deliberate choice, whether fresh generation results auto-expand or arrive collapsed, and what replaces a control in its empty state (e.g. dropdown → "Create an offer" button).
   - Assert the free-training banner is **visible during the wait**, note whether it sits above/below the progress bar and whether it persists after the run — and describe that placement in the script.
   - Quote button labels **exactly as rendered** ("View", not "Preview"); adapting punctuation to speech is fine ("Copy article (plain text)" → "Copy article plain text").
   - Compare text case-**insensitively**: Chromium's `innerText` applies CSS `text-transform`, so an uppercase section label returns `PREMIUM FEATURES` and a case-sensitive `includes()` will report a false failure.
   - When checking right-rail/sidebar geometry, scope the locator to the rail container — a bare `getByText(/Contact Support/i)` will match a button elsewhere in the main column and give a bogus result. Confirm ambiguous geometry findings against the page component's source before rewriting a script over them.
   - Dump the sidebar's `innerText` once and screenshot key pages — the exact section grouping ("Generate", "Libraries", "Premium Features") and WHICH SIDE the dashboard quick-links rail sits on (left vs right) must come from the render, not from older scripts.
6. Clean up: if you patched code, revert every patch and confirm `git status` is clean; if you used an env bypass, leave the env file as you found it. Delete audit scripts from the repo and stop the dev server.

## Voice & ElevenLabs v3 format (mandatory)

Full rules live in `assets/HUMAN-TUTORIAL-STYLE.md`. Summary:

**Write for the ear, not the eye.**
- Sentences under ~20 words. One instruction per sentence in walkthroughs.
- More contractions than looks right on the page (`you'll`, `gonna`, `that's`).
- Verbal signposts: "Okay, next up…", "So that's step one… Now — step two."
- Tutor moves: "Go ahead and click…", "You should see…", "If it says X for a second — that's normal."
- Aphorism budget: max 1–2 clever lines per video. Plain speech beats stacked punchlines.
- Numbers as speech when a narrator would phrase them ("fifteen hundred words", "one thousand — even five thousand dollars a day").

**File format (TTS-ready, no cleanup pass needed):**
- Pure spoken script + square-bracket audio tags.
- One paragraph per beat, blank line between paragraphs.
- File starts directly on the first audio tag or spoken word.
- **No** `=====` headers, beat markers, SCREEN cues, production notes, or word-count footers.

**Approved audio tags** (mark emotional shifts, not every sentence):
`[calm]` `[warmly]` `[thoughtful]` `[curious]` `[confident]` `[serious]` `[excited]` `[quietly]` `[whisper]` `[whispering]` `[annoyed]` `[chuckles]` `[sighs]` `[short pause]` `[long pause]`

Punctuation does most of the pacing (ellipses, dashes, periods). Prefer that over stacking pause tags. Generation settings: stability ~0.3–0.5 so tags fire; generate one paragraph/beat at a time.

**Taste test:** would a person sitting next to the member actually say this while pointing at the screen? If it sounds performed or written, rewrite it plainer.

## Parallelizing across softwares

For multiple softwares at once, launch one subagent per software with: the paths to the four guide files above, the `assets/voice-reference/` taste anchors, the repo path (already pulled), and the standing policies. Then run a cross-set validation yourself: grep all outputs for banned/old names, other products' branding leaking across sets, leftover metadata/beat markers/`(SCREEN:)`, bare `[pause]`, ad mentions in no-wait videos (libraries/security), and stale free-training placements ("below this video" when the Home page has no banner).
