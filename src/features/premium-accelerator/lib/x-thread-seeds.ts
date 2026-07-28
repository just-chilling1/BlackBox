import { THREAD_POST_ROLES } from "@/features/publish-kit/lib/promote-constants";

/** Placeholder used in template HTML — replaced when a member clones. */
export const ACCELERATOR_LINK_PLACEHOLDER = "[AFFILIATE_LINK]";

/** Placeholder in thread post 10 — replaced with the member's affiliate link on clone. */
export const ACCELERATOR_THREAD_LINK_PLACEHOLDER = "[LINK]";

export interface AcceleratorThreadSeedRow {
  text: string;
  angle: string;
}

/** Niche-specific story beats — keeps threads concrete while following the 10-post arc. */
const NICHE_STORY_BEATS: Record<
  string,
  { hookMetric: string; scene: string; stakes: string; proof: string }
> = {
  fitness: {
    hookMetric: "11 pounds in 6 weeks",
    scene: "January 2024. Gym parking lot, 5:45am. I'd skipped workouts 4 weeks straight.",
    stakes: "Another month like that and I'd cancel the membership — and keep buying programs I'd never open.",
    proof: "Week 6: down 11 pounds, same 3 workouts, no extra cardio.",
  },
  finance: {
    hookMetric: "$840 saved in 9 weeks",
    scene: "April 2024. Kitchen table, bills spread out. I was $200 short every month.",
    stakes: "One more overdraft fee and I'd stop looking at the account altogether.",
    proof: "Nine weeks later: $840 saved with one weekly money review.",
  },
  health: {
    hookMetric: "energy back by week 5",
    scene: "March 2024. Afternoon crash at 2pm — again. Third coffee didn't help.",
    stakes: "If I kept ignoring it, I'd normalize feeling exhausted every single day.",
    proof: "By week 5 I had steady afternoon energy with 3 small daily habits.",
  },
  business: {
    hookMetric: "first $500 week in 8 weeks",
    scene: "February 2024. Laptop open at midnight. Zero sales after 60 days of posting.",
    stakes: "Another month of random tactics and I'd quit before I ever saw a real result.",
    proof: "Week 8: first $500 week from the same 3 actions repeated every Monday.",
  },
  default: {
    hookMetric: "first real win in 6 weeks",
    scene: "March 2024. Kitchen table, 11pm. I'd tried 3 approaches and still had nothing to show.",
    stakes: "If nothing changed, I'd keep burning weekends on tactics that looked smart but never paid off.",
    proof: "Six weeks later: first consistent result. Same 3 actions, less than an hour a day.",
  },
};

function resolveStoryBeats(nicheKey: string | undefined, nicheLabel: string) {
  const key = (nicheKey ?? nicheLabel).toLowerCase();
  if (key.includes("fit") || key.includes("weight")) return NICHE_STORY_BEATS.fitness;
  if (key.includes("financ") || key.includes("money")) return NICHE_STORY_BEATS.finance;
  if (key.includes("health") || key.includes("wellness")) return NICHE_STORY_BEATS.health;
  if (key.includes("business") || key.includes("market") || key.includes("affiliate")) {
    return NICHE_STORY_BEATS.business;
  }
  return NICHE_STORY_BEATS.default;
}

/**
 * Static fallback 10-post story threads when AI generation is unavailable.
 * Mirrors the x-thread-rules arc: failure in post 4, product in posts 7+10, link only in post 10.
 */
export function buildStaticAcceleratorXThreadSeeds(
  productName: string,
  niche: string,
  nicheKey?: string
): string[] {
  const short = productName.slice(0, 50);
  const nicheLower = niche.toLowerCase();
  const beats = resolveStoryBeats(nicheKey, niche);

  return [
    `I tracked ${beats.hookMetric} in ${nicheLower} before one Tuesday changed how I approached it.`,
    beats.scene,
    beats.stakes,
    `Attempt 1: free YouTube deep dives — no structure. Attempt 2: a $197 course — too generic. Attempt 3: copying gurus — zero fit for my schedule.`,
    `The shift wasn't doing more. It was following one repeatable path instead of collecting tips.`,
    `Pick one outcome. Strip it to 3 weekly actions. Track one metric. Review every Sunday. Boring — and it works without buying anything.`,
    `${short} is what made that weekly loop fast enough that I actually stuck with it.`,
    beats.proof,
    `Not for people chasing overnight wins. If you won't review one number every week, skip this.`,
    `One path. One metric. One tool if you want speed.\n\nStart here: ${ACCELERATOR_THREAD_LINK_PLACEHOLDER}`,
  ];
}

export function buildStaticAcceleratorXThreadSeedRows(
  productName: string,
  niche: string,
  nicheKey?: string
): AcceleratorThreadSeedRow[] {
  const texts = buildStaticAcceleratorXThreadSeeds(productName, niche, nicheKey);
  return texts.map((text, i) => ({
    text,
    angle: THREAD_POST_ROLES[i] ?? `Post ${i + 1}`,
  }));
}
