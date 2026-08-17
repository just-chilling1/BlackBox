# Automated Profits Niche-Aligned Traffic Sources Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Autopilot's disconnected 122-source catalog with exactly 20 traffic sources for each of the project's nine canonical niches, and default the experience to the member's latest generated offer.

**Architecture:** Compose `SOURCES` from eight curated sources and twelve reusable platform playbooks for every `NICHE_OPTIONS` niche. Preserve the existing Autopilot API contracts and progress UI, then add a small read-only client lookup of the newest built site to establish the default niche and hosted offer URL.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Supabase, Tailwind CSS 4.

## Global Constraints

- Derive all Autopilot niche labels and keys from `NICHE_OPTIONS`; do not maintain a second niche taxonomy.
- Produce exactly 20 sources for each of the nine canonical niches and 180 sources in total.
- Keep `TrafficSource`, `SourceType`, `Difficulty`, `NICHES`, `SOURCES`, and `filterSourcesByNiche` as the public API of `traffic-sources.ts`.
- Store source data in TypeScript; do not introduce tables, migrations, dependencies, or new Autopilot request shapes.
- Use source IDs distinct from the retired `wl-*`, `mmo-*`, `hf-*`, `tg-*`, `bs-*`, `rel-*`, `pet-*`, and `hg-*` IDs; existing completion rows remain inert.
- Saved member settings override automatic defaults. Unrecognised retired values fall back to `All`.
- Never overwrite a saved Autopilot promotion URL with an inferred site URL.
- All outreach copy must describe the member's niche offer page or resource, not personal transformations or unsubstantiated income/health claims.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/features/blog-builder/types.ts` | Preserves literal canonical niche values with `as const satisfies`, allowing cross-feature catalogs to be exhaustive at compile time. |
| `src/features/premium-autopilot/lib/source-types.ts` | Holds shared traffic-source types so composition modules do not import `traffic-sources.ts` cyclically. |
| `src/features/premium-autopilot/lib/niche-profiles.ts` | Defines one structured profile for each `NICHE_OPTIONS` key: community details, discovery terms, copy angle, and traffic multiplier. |
| `src/features/premium-autopilot/lib/platform-playbooks.ts` | Defines the fixed twelve safe, reusable promotion playbooks and composes them with a niche profile. |
| `src/features/premium-autopilot/lib/curated-sources.ts` | Defines the eight real niche-specific destinations for each canonical niche. |
| `src/features/premium-autopilot/lib/traffic-sources.ts` | Exports the existing catalog API and validates/composes the 180-source catalog. |
| `src/features/premium-autopilot/lib/autopilot-client.ts` | Adds a typed read-only `fetchLatestOffer()` client that maps `/api/blog/site?lite=1` output into an Autopilot default. |
| `src/features/premium-autopilot/pages/AutopilotPage.tsx` | Applies inferred defaults only when persisted values are absent, uses `{LINK}` interpolation, and updates UI copy. |

## Task 1: Define the canonical niche profiles

**Files:**
- Modify: `src/features/blog-builder/types.ts:106-116`
- Create: `src/features/premium-autopilot/lib/source-types.ts`
- Create: `src/features/premium-autopilot/lib/niche-profiles.ts`
- Modify: `src/features/premium-autopilot/lib/traffic-sources.ts`

**Interfaces:**
- Consumes: `NICHE_OPTIONS` from `@/features/blog-builder/types`.
- Produces: `AutopilotNicheKey`, `AutopilotNicheProfile`, `AUTOPILOT_NICHE_PROFILES`, `getAutopilotNicheProfile()`.

- [ ] **Step 1: Preserve canonical niche literals and introduce shared source types**

Change the existing niche export in `src/features/blog-builder/types.ts` to preserve
its literal values while still validating the `NicheOption` shape:

```ts
export const NICHE_OPTIONS = [
  { value: "health", label: "Health & Wellness" },
  { value: "finance", label: "Finance & Investing" },
  { value: "fitness", label: "Fitness & Sports" },
  { value: "marketing", label: "Digital Marketing" },
  { value: "selfhelp", label: "Self-Help & Personal Development" },
  { value: "beauty", label: "Beauty & Skincare" },
  { value: "education", label: "Education & Learning" },
  { value: "business", label: "Business & Entrepreneurship" },
  { value: "travel", label: "Travel & Lifestyle" },
] as const satisfies readonly NicheOption[];
```

Create `source-types.ts`, then import its `TrafficSource` type in every composition
module. `traffic-sources.ts` must re-export these types so its existing public API remains
unchanged:

```ts
export type SourceType =
  | "Forum"
  | "Social"
  | "Directory"
  | "Blog"
  | "Q&A"
  | "Classified"
  | "Video";

export type Difficulty = "Easy" | "Medium";

export interface TrafficSource {
  id: string;
  name: string;
  niche: string;
  type: SourceType;
  difficulty: Difficulty;
  traffic: string;
  time: string;
  url: string;
  description: string;
  instructions: readonly string[];
}
```

Create the following profile type contract. The literal `NICHE_OPTIONS` type makes
`satisfies` reject missing or extra canonical niche keys:

```ts
import { NICHE_OPTIONS } from "@/features/blog-builder/types";

export type AutopilotNicheKey = (typeof NICHE_OPTIONS)[number]["value"];

export type TrafficDemand = "low" | "medium" | "high";

export interface AutopilotNicheProfile {
  key: AutopilotNicheKey;
  label: string;
  community: string;
  subreddit: string;
  hashtags: readonly string[];
  keywords: readonly string[];
  directoryQuery: string;
  offerAngle: string;
  demand: TrafficDemand;
}
```

- [ ] **Step 2: Add all nine profiles**

Add one entry for every canonical key with the following exact content:

```ts
export const AUTOPILOT_NICHE_PROFILES = {
  health: {
    key: "health", label: "Health & Wellness", community: "health and wellness community",
    subreddit: "r/Health", hashtags: ["#wellness", "#healthyhabits", "#healthtips"],
    keywords: ["wellness", "healthy habits", "preventive health"], directoryQuery: "health and wellness resource directories",
    offerAngle: "a practical health and wellness resource page", demand: "high",
  },
  finance: {
    key: "finance", label: "Finance & Investing", community: "personal finance community",
    subreddit: "r/personalfinance", hashtags: ["#personalfinance", "#investing", "#moneymindset"],
    keywords: ["personal finance", "investing basics", "money management"], directoryQuery: "personal finance resource directories",
    offerAngle: "a practical personal-finance resource page", demand: "high",
  },
  fitness: {
    key: "fitness", label: "Fitness & Sports", community: "fitness and sports community",
    subreddit: "r/fitness", hashtags: ["#fitness", "#workouttips", "#sportsperformance"],
    keywords: ["fitness", "workout planning", "sports performance"], directoryQuery: "fitness and sports resource directories",
    offerAngle: "a practical fitness and sports resource page", demand: "high",
  },
  marketing: {
    key: "marketing", label: "Digital Marketing", community: "digital marketing community",
    subreddit: "r/marketing", hashtags: ["#digitalmarketing", "#marketingtips", "#growthmarketing"],
    keywords: ["digital marketing", "content strategy", "audience growth"], directoryQuery: "digital marketing resource directories",
    offerAngle: "a practical digital-marketing resource page", demand: "medium",
  },
  selfhelp: {
    key: "selfhelp", label: "Self-Help & Personal Development", community: "personal development community",
    subreddit: "r/selfimprovement", hashtags: ["#personaldevelopment", "#selfimprovement", "#mindset"],
    keywords: ["personal development", "self improvement", "goal setting"], directoryQuery: "personal development resource directories",
    offerAngle: "a practical personal-development resource page", demand: "medium",
  },
  beauty: {
    key: "beauty", label: "Beauty & Skincare", community: "beauty and skincare community",
    subreddit: "r/SkincareAddiction", hashtags: ["#skincare", "#beautytips", "#makeup"],
    keywords: ["skincare", "beauty routines", "makeup advice"], directoryQuery: "beauty and skincare resource directories",
    offerAngle: "a practical beauty and skincare resource page", demand: "high",
  },
  education: {
    key: "education", label: "Education & Learning", community: "learning and study community",
    subreddit: "r/learnprogramming", hashtags: ["#learning", "#studytips", "#education"],
    keywords: ["learning", "study strategies", "online education"], directoryQuery: "education and learning resource directories",
    offerAngle: "a practical education and learning resource page", demand: "medium",
  },
  business: {
    key: "business", label: "Business & Entrepreneurship", community: "business and entrepreneurship community",
    subreddit: "r/Entrepreneur", hashtags: ["#entrepreneurship", "#smallbusiness", "#businesstips"],
    keywords: ["entrepreneurship", "small business", "business strategy"], directoryQuery: "business and entrepreneurship resource directories",
    offerAngle: "a practical business and entrepreneurship resource page", demand: "high",
  },
  travel: {
    key: "travel", label: "Travel & Lifestyle", community: "travel and lifestyle community",
    subreddit: "r/travel", hashtags: ["#travel", "#travelplanning", "#lifestyle"],
    keywords: ["travel planning", "travel tips", "lifestyle"], directoryQuery: "travel and lifestyle resource directories",
    offerAngle: "a practical travel and lifestyle resource page", demand: "medium",
  },
} as const satisfies Record<AutopilotNicheKey, AutopilotNicheProfile>;

export function getAutopilotNicheProfile(key: string) {
  return AUTOPILOT_NICHE_PROFILES[key as AutopilotNicheKey] ?? null;
}
```

- [ ] **Step 3: Run the type checker**

Run: `npx tsc --noEmit`

Expected: exit code 0. A missing canonical niche produces a TypeScript error at `AUTOPILOT_NICHE_PROFILES`.

- [ ] **Step 4: Commit the profiles**

```powershell
git add src/features/blog-builder/types.ts src/features/premium-autopilot/lib/source-types.ts src/features/premium-autopilot/lib/niche-profiles.ts
git commit -m "feat: define canonical Autopilot niche profiles"
```

## Task 2: Build reusable playbooks and curated destinations

**Files:**
- Create: `src/features/premium-autopilot/lib/platform-playbooks.ts`
- Create: `src/features/premium-autopilot/lib/curated-sources.ts`

**Interfaces:**
- Consumes: `AutopilotNicheKey`, `AutopilotNicheProfile` from `niche-profiles.ts` and `TrafficSource` from `source-types.ts`.
- Produces: `PLATFORM_PLAYBOOK_COUNT`, `buildPlatformSources(profile)`, `CURATED_SOURCES_BY_NICHE`.
- Produces exactly 12 composed and exactly 8 curated `TrafficSource`-shaped records per key.

- [ ] **Step 1: Define the source primitives and explicit link interpolation**

Move the shared `TrafficSource`, `SourceType`, and `Difficulty` type declarations into `traffic-sources.ts` only if import cycles can be avoided; otherwise create `source-types.ts` and re-export those types from `traffic-sources.ts`.

The composed source builder must use this interpolation function rather than a generic text replacement:

```ts
export function interpolateSourceText(
  template: string,
  profile: AutopilotNicheProfile,
  link = "{LINK}"
) {
  return template
    .replaceAll("{LINK}", link)
    .replaceAll("{COMMUNITY}", profile.community)
    .replaceAll("{SUBREDDIT}", profile.subreddit)
    .replaceAll("{HASHTAGS}", profile.hashtags.join(" "))
    .replaceAll("{KEYWORDS}", profile.keywords.join(", "))
    .replaceAll("{DIRECTORY_QUERY}", profile.directoryQuery)
    .replaceAll("{OFFER_ANGLE}", profile.offerAngle);
}
```

- [ ] **Step 2: Implement all twelve platform playbooks**

Define a fixed 12-item tuple in this order: `reddit`, `quora`, `pinterest`, `facebook-groups`, `medium`, `youtube`, `tiktok`, `instagram`, `x`, `linkedin`, `directory`, `blog-outreach`.

Every playbook must generate an ID `${profile.key}-p-${id}`, include a valid destination URL, and give practical, rule-respecting instructions. Use these exact destination URLs:

| Playbook | URL |
|---|---|
| Reddit | `https://www.reddit.com/{SUBREDDIT}/` |
| Quora | `https://www.quora.com/` |
| Pinterest | `https://www.pinterest.com/` |
| Facebook Groups | `https://www.facebook.com/groups/` |
| Medium | `https://medium.com/` |
| YouTube | `https://www.youtube.com/` |
| TikTok | `https://www.tiktok.com/` |
| Instagram | `https://www.instagram.com/` |
| X | `https://x.com/` |
| LinkedIn | `https://www.linkedin.com/` |
| Directory | `https://www.google.com/search?q={DIRECTORY_QUERY}` |
| Blog outreach | `https://www.google.com/search?q={KEYWORDS}+blogs` |

All descriptions must use this factual form:

```ts
"I put together {OFFER_ANGLE} with useful next steps. If it is relevant to your question, you can find it here: {LINK}"
```

Use an exact tuple type so a future addition or deletion is a compile-time error:

```ts
type PlatformPlaybookTuple = readonly [
  PlatformPlaybook, PlatformPlaybook, PlatformPlaybook, PlatformPlaybook,
  PlatformPlaybook, PlatformPlaybook, PlatformPlaybook, PlatformPlaybook,
  PlatformPlaybook, PlatformPlaybook, PlatformPlaybook, PlatformPlaybook,
];
```

Use varying type, difficulty, time, and non-guaranteed visitor estimate ranges, but no playbook may instruct members to spam, create fake testimonials, publish fabricated results, or post where self-promotion is forbidden.

- [ ] **Step 3: Add eight curated entries for every niche**

Create a `Record<AutopilotNicheKey, CuratedSourceTuple>`, where `CuratedSourceTuple`
is the exact eight-element tuple shown below. Use these curated source names and URLs,
preserve the canonical key in every ID, and make every description use the same factual
offer-page framing as the playbooks:

| Key | Eight curated sources (name — URL) |
|---|---|
| health | HealthUnlocked — `https://healthunlocked.com/`; PatientsLikeMe — `https://www.patientslikeme.com/`; Wellness.com — `https://www.wellness.com/`; r/Health — `https://www.reddit.com/r/Health/`; HealthBoards — `https://www.healthboards.com/`; The Mighty — `https://themighty.com/`; Everyday Health — `https://www.everydayhealth.com/`; Healthline Community — `https://www.healthline.com/health/` |
| finance | Bogleheads — `https://www.bogleheads.org/forum/`; r/personalfinance — `https://www.reddit.com/r/personalfinance/`; r/investing — `https://www.reddit.com/r/investing/`; Wall Street Oasis — `https://www.wallstreetoasis.com/forum`; BiggerPockets — `https://www.biggerpockets.com/forums`; MoneySavingExpert Forum — `https://forums.moneysavingexpert.com/`; Reddit Financial Independence — `https://www.reddit.com/r/financialindependence/`; Investopedia — `https://www.investopedia.com/` |
| fitness | Bodybuilding.com Forum — `https://forum.bodybuilding.com/`; r/fitness — `https://www.reddit.com/r/fitness/`; r/bodyweightfitness — `https://www.reddit.com/r/bodyweightfitness/`; MyFitnessPal Community — `https://community.myfitnesspal.com/`; T-Nation — `https://forums.t-nation.com/`; Fitocracy — `https://www.fitocracy.com/`; Running Forum — `https://www.runningforums.com/`; LetsRun — `https://www.letsrun.com/forum/` |
| marketing | Warrior Forum — `https://www.warriorforum.com/`; GrowthHackers — `https://growthhackers.com/`; r/marketing — `https://www.reddit.com/r/marketing/`; r/SEO — `https://www.reddit.com/r/SEO/`; Digital Point — `https://forums.digitalpoint.com/`; Moz Community — `https://moz.com/community`; Indie Hackers Marketing — `https://www.indiehackers.com/`; Product Hunt Discussions — `https://www.producthunt.com/discussions` |
| selfhelp | r/selfimprovement — `https://www.reddit.com/r/selfimprovement/`; r/productivity — `https://www.reddit.com/r/productivity/`; Tiny Buddha — `https://tinybuddha.com/`; The Positivity Blog — `https://www.positivityblog.com/`; Quora Personal Development — `https://www.quora.com/topic/Personal-Development`; 7 Cups Community — `https://www.7cups.com/`; The Change Blog — `https://www.thechangeblog.com/`; Mind Tools — `https://www.mindtools.com/` |
| beauty | MakeupAlley — `https://www.makeupalley.com/`; r/SkincareAddiction — `https://www.reddit.com/r/SkincareAddiction/`; r/MakeupAddiction — `https://www.reddit.com/r/MakeupAddiction/`; Essential Day Spa — `https://www.essentialdayspa.com/forum/`; Beautylish — `https://www.beautylish.com/`; PurseForum Beauty — `https://forum.purseblog.com/forums/the-beauty-bar.42/`; Temptalia — `https://www.temptalia.com/`; Naturally Curly — `https://www.naturallycurly.com/` |
| education | r/learnprogramming — `https://www.reddit.com/r/learnprogramming/`; r/studytips — `https://www.reddit.com/r/studytips/`; Stack Exchange Academia — `https://academia.stackexchange.com/`; The Student Room — `https://www.thestudentroom.co.uk/`; Coursera Community — `https://www.coursera.org/`; edX — `https://www.edx.org/`; Khan Academy — `https://www.khanacademy.org/`; OpenLearn — `https://www.open.edu/openlearn/` |
| business | Indie Hackers — `https://www.indiehackers.com/`; r/Entrepreneur — `https://www.reddit.com/r/Entrepreneur/`; Hacker News — `https://news.ycombinator.com/`; Product Hunt — `https://www.producthunt.com/`; Startup Grind — `https://www.startupgrind.com/`; Founders Network — `https://foundersnetwork.com/`; Small Business Forum — `https://www.smallbusinessforum.net/`; Alignable — `https://www.alignable.com/` |
| travel | FlyerTalk — `https://www.flyertalk.com/forum/`; r/travel — `https://www.reddit.com/r/travel/`; r/solotravel — `https://www.reddit.com/r/solotravel/`; TripAdvisor Forums — `https://www.tripadvisor.com/Forums`; Lonely Planet — `https://www.lonelyplanet.com/`; Fodor's Travel Talk — `https://www.fodors.com/community/`; Travel Stack Exchange — `https://travel.stackexchange.com/`; Nomadic Matt — `https://www.nomadicmatt.com/` |

Define the tuple type and write each niche value as:

```ts
type CuratedSourceTuple = readonly [
  TrafficSource, TrafficSource, TrafficSource, TrafficSource,
  TrafficSource, TrafficSource, TrafficSource, TrafficSource,
];

[
  {
    id: "finance-c1",
    name: "Bogleheads",
    niche: "Finance & Investing",
    type: "Forum",
    difficulty: "Medium",
    traffic: "150-500 visitors/month",
    time: "15 minutes",
    url: "https://www.bogleheads.org/forum/",
    description: "I put together a practical personal-finance resource page with useful next steps. If it is relevant to your question, you can find it here: {LINK}",
    instructions: [
      "Read the forum rules and signature policy before posting.",
      "Contribute a complete, on-topic answer before mentioning {LINK}.",
      "Share {LINK} only when it directly answers the discussion.",
    ],
  },
  // seven additional explicit entries for this key
] as const satisfies readonly [
  TrafficSource, TrafficSource, TrafficSource, TrafficSource,
  TrafficSource, TrafficSource, TrafficSource, TrafficSource,
]
```

- [ ] **Step 4: Run the type checker**

Run: `npx tsc --noEmit`

Expected: exit code 0. Giving a niche seven or nine curated entries must fail the tuple type.

- [ ] **Step 5: Commit catalog inputs**

```powershell
git add src/features/premium-autopilot/lib/platform-playbooks.ts src/features/premium-autopilot/lib/curated-sources.ts
git commit -m "feat: add curated and reusable Autopilot sources"
```

## Task 3: Compose and validate the 180-source public catalog

**Files:**
- Modify: `src/features/premium-autopilot/lib/traffic-sources.ts`

**Interfaces:**
- Consumes: `NICHE_OPTIONS`, `AUTOPILOT_NICHE_PROFILES`, `CURATED_SOURCES_BY_NICHE`, `buildPlatformSources()`.
- Produces: existing `NICHES`, `SOURCES`, `filterSourcesByNiche()` and `resolveAutopilotNiche()`.

- [ ] **Step 1: Implement explicit source-count validation**

Use a runtime assertion during module initialization in addition to fixed tuples. This protects against a future playbook builder filtering an entry:

```ts
const SOURCES_PER_NICHE = 20;

function assertCatalogShape(sources: readonly TrafficSource[]) {
  const counts = new Map<string, number>();
  for (const source of sources) {
    counts.set(source.niche, (counts.get(source.niche) ?? 0) + 1);
  }

  for (const niche of NICHE_OPTIONS) {
    const count = counts.get(niche.label) ?? 0;
    if (count !== SOURCES_PER_NICHE) {
      throw new Error(
        `Autopilot catalog requires ${SOURCES_PER_NICHE} sources for ${niche.label}; received ${count}.`
      );
    }
  }
}
```

- [ ] **Step 2: Compose sources in deterministic order**

At the top of `traffic-sources.ts`, import the source types from `source-types.ts` and
re-export them:

```ts
import type { TrafficSource } from "./source-types";
export type { Difficulty, SourceType, TrafficSource } from "./source-types";
```

Then implement:

```ts
export const NICHES = ["All", ...NICHE_OPTIONS.map((niche) => niche.label)] as const;

export const SOURCES: TrafficSource[] = NICHE_OPTIONS.flatMap((niche) => {
  const profile = AUTOPILOT_NICHE_PROFILES[niche.value];
  return [
    ...CURATED_SOURCES_BY_NICHE[niche.value],
    ...buildPlatformSources(profile),
  ];
});

assertCatalogShape(SOURCES);

export function filterSourcesByNiche(niche: string): TrafficSource[] {
  if (niche === "All") return SOURCES;
  return SOURCES.filter((source) => source.niche === niche);
}

export function resolveAutopilotNiche(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();
  if (!normalized || normalized === "all") return "All";
  const match = NICHE_OPTIONS.find(
    (niche) =>
      niche.value === normalized ||
      niche.label.toLowerCase() === normalized
  );
  return match?.label ?? "All";
}
```

- [ ] **Step 3: Verify the production build**

Run: `npm run build`

Expected: the Next.js production build succeeds and no `Autopilot catalog requires` error is thrown.

- [ ] **Step 4: Commit catalog composition**

```powershell
git add src/features/premium-autopilot/lib/traffic-sources.ts
git commit -m "feat: compose 20 Autopilot sources per niche"
```

## Task 4: Infer defaults from the member's newest offer

**Files:**
- Modify: `src/features/premium-autopilot/lib/autopilot-client.ts`
- Modify: `src/features/premium-autopilot/pages/AutopilotPage.tsx`

**Interfaces:**
- Consumes: `fetchJson`, `buildOfferPageUrl`, `resolveAutopilotNiche`.
- Produces: `LatestAutopilotOffer | null` from `fetchLatestOffer()`.

- [ ] **Step 1: Add the typed latest-offer client**

Do not alter `AutopilotState` or existing settings/completions calls. Add:

```ts
import { buildOfferPageUrl } from "@/lib/app-url";
import { resolveAutopilotNiche } from "./traffic-sources";

interface LatestSiteRow {
  slug: string;
  owner_handle?: string | null;
  territory?: string | null;
}

interface LatestSiteResponse {
  site?: LatestSiteRow | null;
}

export interface LatestAutopilotOffer {
  niche: string;
  promotionUrl: string;
}

export async function fetchLatestOffer(): Promise<LatestAutopilotOffer | null> {
  const result = await fetchJson<LatestSiteResponse>("/api/blog/site?lite=1", {
    credentials: "include",
    cache: "no-store",
  });
  if (!result.ok || !result.data.site?.slug) return null;

  const { site } = result.data;
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  if (!origin) return null;

  return {
    niche: resolveAutopilotNiche(site.territory),
    promotionUrl: buildOfferPageUrl(origin, site.slug, site.owner_handle),
  };
}
```

If `/api/blog/site` returns 403 because Blog Builder is disabled, `fetchJson` returns a non-OK result and this function returns `null`; do not show an error to the member.

- [ ] **Step 2: Apply persisted state before inferred defaults**

In the page’s initial effect, fetch the persisted Autopilot state and latest offer concurrently:

```ts
const [initialState, latestOffer] = await Promise.all([
  fetchAutopilotState(),
  fetchLatestOffer(),
]);
let state = await migrateLegacyCompletions(initialState);
```

Then use this exact precedence:

```ts
const savedNiche = resolveAutopilotNiche(state?.selected_niche);
const hasSavedNiche = savedNiche !== "All";
setSelectedNiche(hasSavedNiche ? savedNiche : latestOffer?.niche ?? "All");

const savedUrl = state?.promotion_url?.trim() ?? "";
if (savedUrl) {
  setPageUrl(savedUrl);
  lastSavedUrl.current = savedUrl;
} else if (latestOffer?.promotionUrl) {
  setPageUrl(latestOffer.promotionUrl);
  lastSavedUrl.current = latestOffer.promotionUrl;
}
```

Set `lastSavedNiche.current` only when a recognised saved niche was used. Do not save either inferred value during hydration. This prevents autopilot defaults from overwriting the member’s profile just because they opened the page.

- [ ] **Step 3: Verify default precedence manually**

Run: `npm run dev`

Expected:

1. A user with a current saved Autopilot niche and URL sees those values.
2. A user with no saved values and a live newest site sees that site's canonical niche and public offer URL.
3. A user with `autopilot_selected_niche = 'Weight Loss'` sees `All`, never an empty source grid.
4. A user without sites or without Blog Builder access sees `All` and an empty URL field.

- [ ] **Step 4: Commit inferred defaults**

```powershell
git add src/features/premium-autopilot/lib/autopilot-client.ts src/features/premium-autopilot/pages/AutopilotPage.tsx
git commit -m "feat: default Autopilot to latest offer"
```

## Task 5: Update the Autopilot presentation and `{LINK}` rendering

**Files:**
- Modify: `src/features/premium-autopilot/pages/AutopilotPage.tsx`

**Interfaces:**
- Consumes: source descriptions and instructions containing the literal `{LINK}` token.
- Produces: rendered and copied source copy with the member’s URL or `[YOUR_LINK]`.

- [ ] **Step 1: Add one token renderer**

Near the page constants, add:

```ts
const LINK_PLACEHOLDER = "[YOUR_LINK]";

function renderSourceCopy(template: string, pageUrl: string) {
  return template.replaceAll("{LINK}", pageUrl || LINK_PLACEHOLDER);
}
```

Replace both the instruction regex at the current source instruction map and both description replacements (rendered description and clipboard content) with `renderSourceCopy()`.

- [ ] **Step 2: Update claims and feature copy**

Make these exact replacements:

```tsx
subtitle="180 practical traffic sources across 9 niches — choose the market your offer was built for and share it where it is genuinely useful."
```

```ts
title: "Pick Your Niche",
desc: "Choose the niche your offer was built for and get 20 practical traffic sources tailored to that market.",
```

```ts
title: "Share Your Offer",
desc: "Follow the platform rules and use the step-by-step guidance to share your offer where it directly helps the conversation.",
```

```ts
title: "Build Consistent Visibility",
desc: "Return to the sources that work for you, contribute useful answers, and track the places you have completed.",
```

Replace the Pro Tip content with:

```tsx
<span className="text-sm text-text-secondary">
  Start with a few sources where you can genuinely help the audience. Read each
  community&apos;s rules first, and only share your offer when it directly supports
  your answer.
</span>
```

- [ ] **Step 3: Run static and production verification**

Run:

```powershell
npx tsc --noEmit
npm run build
```

Expected: both commands exit with code 0.

- [ ] **Step 4: Check editor diagnostics**

Use the IDE diagnostics for:

```text
src/features/premium-autopilot/pages/AutopilotPage.tsx
src/features/premium-autopilot/lib/autopilot-client.ts
src/features/premium-autopilot/lib/traffic-sources.ts
src/features/premium-autopilot/lib/niche-profiles.ts
src/features/premium-autopilot/lib/platform-playbooks.ts
src/features/premium-autopilot/lib/curated-sources.ts
```

Expected: no new errors.

- [ ] **Step 5: Commit the presentation changes**

```powershell
git add src/features/premium-autopilot/pages/AutopilotPage.tsx
git commit -m "feat: align Autopilot copy with generated offers"
```

## Task 6: Final catalog and regression review

**Files:**
- Review: `src/features/premium-autopilot/lib/traffic-sources.ts`
- Review: `src/features/premium-autopilot/pages/AutopilotPage.tsx`

**Interfaces:**
- Verifies: 180 sources, 20 sources per canonical niche, correct defaults, and unchanged completion API payloads.

- [ ] **Step 1: Run a catalog-count inspection**

Run:

```powershell
npx tsx -e "import { SOURCES, NICHES, filterSourcesByNiche } from './src/features/premium-autopilot/lib/traffic-sources'; console.log(JSON.stringify({ total: SOURCES.length, counts: NICHES.slice(1).map(niche => [niche, filterSourcesByNiche(niche).length]) }, null, 2))"
```

Expected:

```json
{
  "total": 180,
  "counts": [
    ["Health & Wellness", 20],
    ["Finance & Investing", 20],
    ["Fitness & Sports", 20],
    ["Digital Marketing", 20],
    ["Self-Help & Personal Development", 20],
    ["Beauty & Skincare", 20],
    ["Education & Learning", 20],
    ["Business & Entrepreneurship", 20],
    ["Travel & Lifestyle", 20]
  ]
}
```

- [ ] **Step 2: Confirm legacy completion behavior**

In a test account with a `user_autopilot_completions` entry such as `wl-1`, open `/autopilot`. Confirm its progress is `0 of 20` for any canonical niche and that marking a source complete sends the new ID (for example `finance-c1`) to the existing completions endpoint.

- [ ] **Step 3: Review diff and commit final verification fixes only if needed**

Run:

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors. Do not make unrelated edits or migrations.

