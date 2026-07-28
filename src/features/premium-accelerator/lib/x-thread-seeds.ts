import { THREAD_POST_ROLES } from "@/features/publish-kit/lib/promote-constants";

/** Placeholder used in template HTML — replaced when a member clones. */
export const ACCELERATOR_LINK_PLACEHOLDER = "[AFFILIATE_LINK]";

const LINK = "[LINK]";

/** Static 10-post story threads stored on accelerator templates — [LINK] only in post 10. */
export function buildAcceleratorXThreadSeeds(productName: string, niche: string): string[] {
  const short = productName.slice(0, 50);
  const nicheLower = niche.toLowerCase();

  return [
    `I spent 14 months stuck in ${nicheLower} before one Tuesday changed everything. Not hype — a real number I still track.`,
    `March 2024. Kitchen table, 11pm. I'd tried 3 ${nicheLower} courses and still couldn't get a single win worth showing anyone.`,
    `If nothing changed, I'd keep burning weekends on tactics that looked smart but never paid rent.`,
    `Attempt 1: free YouTube rabbit holes — no structure. Attempt 2: a $197 course — too generic. Attempt 3: copying gurus — zero fit for my situation.`,
    `The shift wasn't working harder. It was following one repeatable path instead of collecting tips.`,
    `Pick one outcome. Strip it to 3 weekly actions. Track one metric. Review every Sunday. Boring — and it works without buying anything.`,
    `${short} is what made that weekly loop fast enough that I actually stuck with it.`,
    `Six weeks later: first consistent result in ${nicheLower}. Same 3 actions, less than an hour a day.`,
    `Not for people chasing overnight wins. If you won't review one number every week, skip this.`,
    `One path. One metric. One tool if you want speed.\n\nStart here: ${LINK}`,
  ];
}

export function buildAcceleratorXThreadSeedRows(productName: string, niche: string) {
  const texts = buildAcceleratorXThreadSeeds(productName, niche);
  return texts.map((text, i) => ({
    text,
    angle: THREAD_POST_ROLES[i] ?? `Post ${i + 1}`,
  }));
}
