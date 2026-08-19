# Phase 3 — Build Dashboard Videos 1 & 2

Presentation-style MP4s (1920×1080, 30fps) rendered with Remotion: branded animated slides synced to the owner's voiceover, app screenshots, and word-level captions. Works because videos 1–2 are psychology/story videos, not click-along tutorials.

## Pipeline

```
- [ ] 1. Workspace + tooling
- [ ] 2. Transcribe voiceovers (word timestamps)
- [ ] 3. Capture app screenshots
- [ ] 4. Remotion project (copy assets/remotion, rebrand)
- [ ] 5. Slide plan + alignment (align.py pattern)
- [ ] 6. Render + deliver
```

### 1. Workspace + tooling

Create `{software-slug}-videos/` as the working dir. Inside it:
- `npm install ffmpeg-static playwright` — on ARM Macs the system ffmpeg may be x86 ("bad CPU type"); use the `ffmpeg-static` binary (`node_modules/ffmpeg-static/ffmpeg`) for all audio work.
- `pip3 install mlx-whisper` (Apple Silicon; needs ffmpeg on PATH — prepend the ffmpeg-static dir).
- **Verify voiceover paths character-by-character** — a user-supplied folder once had a trailing space in its name that broke everything until caught with `ls | cat -A`.

### 2. Transcribe

Run `assets/transcribe.py` on each MP3 → `transcripts/{n}.json` with per-word `{w, s, e}` timings (model `mlx-community/whisper-large-v3-turbo`).

### 3. Screenshots — run the app, bypass login, capture, clean up

Do the whole thing yourself; never ask the user to log in or run the server. Full sub-workflow:

```
- [ ] 3a. Install app deps + start dev server
- [ ] 3b. Apply login/onboarding bypass
- [ ] 3c. Capture all routes
- [ ] 3d. Verify every screenshot
- [ ] 3e. Revert patches + stop server
```

**3a. Start the app locally.** In the software's repo: install deps if `node_modules` is missing (`npm install`), then start the dev server as a **managed background process** (`npm run dev` with `block_until_ms: 0` in the agent shell, or `nohup`) and wait until it answers (`curl -s -o /dev/null -w '%{http_code}' http://localhost:3000`). A naive `npm run dev &` inside a one-shot shell dies when that shell exits — if curl returns `000` and the log stops after the npm header, restart it properly. If a Next.js dev server crashes with "Failed to open database" or "invalid digit found in string" (common on external drives), delete `.next/` and restart.

**3b. Bypass auth — do NOT fight the signup/onboarding flow.**
- **Check for a built-in bypass FIRST:** grep the repo for `BYPASS`, `dev-bypass`, `DEV_BYPASS_AUTH`, `isDevAuthBypass`. Many products ship an env-flag bypass (e.g. `DEV_BYPASS_AUTH=true` in `.env.local` that skips middleware auth and provisions a dev user server-side). If present, set the flag and skip all code patching — nothing to revert later.

Otherwise find the auth layer (grep for `middleware`, `proxy`, `redirect`, `getUser`, `onboarding`) and patch temporarily:
- Server-side middleware (Next.js + Supabase pattern): add at the top of `updateSession` →
  `if (process.env.SCREENSHOT_BYPASS === '1') return NextResponse.next({ request })`
  and restart the dev server with `SCREENSHOT_BYPASS=1 npm run dev`.
- **Next.js 16 apps have no `middleware.ts`** — the gate is a root **`proxy.ts`** that calls `updateSession` (typically `lib/supabase/proxy.ts`). If `ls middleware.*` finds nothing, grep for `auth/signin` and for `export async function updateSession`. Patching only the layout's `getUser()` guard is NOT enough; the proxy redirects first and you'll keep getting 307s to `/auth/signin`.
- Apps with a Supabase-backed onboarding gate (`resolveOnboardingGate`) redirect logged-in users to `/onboarding`; the early `updateSession` return skips that too. Also create a temporary `.env.local` with the project's `NEXT_PUBLIC_SUPABASE_URL` + a placeholder anon key so client creation doesn't throw — and delete it during cleanup.
- Client-side guards: pages that hang on a spinner or redirect when `supabase.auth.getUser()` returns no user — patch the no-user branch to set placeholder data (e.g. `setFirstName('Robert')`) and `setLoading(false)` instead of redirecting.
- Mark every patch with a `// TEMP SCREENSHOT BYPASS — remove after capture` comment so nothing is forgotten.
- Fallback only if the app can't be patched: `assets/signup-capture.js` creates a throwaway account and clicks through onboarding.

**3c. Capture.** Enumerate every route from the app's sidebar/router — dashboard, each core feature, each upgrade, everything the slide plan might show. Copy `assets/capture.js` into the working dir, replace its `routes` list, and run it (viewport 1920×1080, `deviceScaleFactor: 2`, `networkidle` + settle delay). Output goes to `screenshots/`.

**3d. Verify.** For each route: the logged final URL must NOT contain `/login`, `/signup`, or `/onboarding`, and the PNG must be non-trivial in size. Open 2–3 shots (Read tool) and confirm real page content — not a spinner, not an empty state, not an error boundary. Re-capture any bad ones after fixing the cause.

**3e. Clean up.** Revert every `TEMP SCREENSHOT BYPASS` patch (grep the repo for the marker to make sure none survive), then stop the dev server. Confirm with `git diff`/`git status` in the app repo that the tree is back to its pre-capture state. If you used a built-in env bypass instead, leave the env file exactly as you found it.

### 4. Remotion project

Copy `assets/remotion/` into the working dir, `npm install`, then:
- `src/brand.ts` — replace COLORS/GRADIENT with this software's palette (same hexes as Phase 2 thumbnails).
- `public/` — voiceovers as `vo1.mp3`, `vo2.mp3`; screenshots into `public/shots/`.
- `src/Root.tsx` — composition ids/durations come from the generated data JSONs.
- Slide components in `src/components/Slides.tsx` (types: `intro`, `title`, `quote`, `shot`, `banner`, `steps`, `term`, `end`), animated background in `Background.tsx`, word-synced captions in `Captions.tsx`. Reuse as-is; restyle only accents.

### 5. Slide plan + alignment

`assets/align.py` is the Profit Loop worked example — copy it and rewrite `V1`/`V2` for the new scripts, update `BASE`.

- Each slide = `{anchor, type, ...content}`. The **anchor is a distinctive 6–12 word phrase from the actual voiceover** (what was spoken, not the script header). First slide uses `anchor: None, at: 0.0`.
- Slide cadence: a new slide roughly every 15–30 seconds; mirror each script beat. `quote` for remorse-voice/dialog lines, `shot` (+screenshot) whenever the narration references the app, `term` for Jargon School entries, `banner` for the free-training pitch, `steps` for lists, `end` for the close.
- Run it: each anchor is fuzzy-matched (SequenceMatcher ≥ 0.55) to the word stream and slides get start/end times; captions are auto-chunked (~46 chars, break on sentence end).
- Fix every `MISS` the script prints — usually the spoken words differ from the script (ad-libs) or tokenization; take the phrase from the transcript JSON instead.

### 6. Render + deliver

```bash
cd remotion
npx remotion render Video1-WatchThisFirst out/video1.mp4
npx remotion render Video2-HowTheMoneyFlows out/video2.mp4
```

Spot-check frames at the start, a `shot` slide, a `banner` slide, and the end (`npx remotion still` or extract frames with ffmpeg). Then move the MP4s to `training-video-system/{software-slug}/videos/` with descriptive names (`video1-watch-this-first.mp4`, `video2-how-the-money-flows.mp4`).
