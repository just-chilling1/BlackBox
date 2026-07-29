import { THREAD_POST_ROLES } from "@/features/publish-kit/lib/promote-constants";

/** Placeholder used in template HTML — replaced when a member clones. */
export const ACCELERATOR_LINK_PLACEHOLDER = "[AFFILIATE_LINK]";

/** Placeholder in thread post 10 — replaced with the member's affiliate link on clone. */
export const ACCELERATOR_THREAD_LINK_PLACEHOLDER = "[LINK]";

/** Minimum character counts per post role — used to detect corrupted stored threads. */
const THREAD_MIN_CHARS = [60, 50, 40, 40, 40, 40, 50, 50, 40, 65] as const;

const LINK_CTA_SUFFIX =
  /\s*(?:start here|grab it|get it|check it out|learn more|link in bio|link below)\s*:?\s*$/i;

/** Literal replace — never use RegExp ([LINK] is a regex character class). */
export function removeThreadLinkPlaceholder(text: string): string {
  return text.split(ACCELERATOR_THREAD_LINK_PLACEHOLDER).join("");
}

export function substituteThreadLinkPlaceholder(text: string, affiliateUrl: string): string {
  return text.split(ACCELERATOR_THREAD_LINK_PLACEHOLDER).join(affiliateUrl);
}

export function ensureFinalPostHasLink(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.includes(ACCELERATOR_THREAD_LINK_PLACEHOLDER)) {
    return `${trimmed}\n\nStart here: ${ACCELERATOR_THREAD_LINK_PLACEHOLDER}`;
  }
  return trimmed;
}

/** Remove all link placeholders and CTA tails from posts 1–9. */
export function stripLinkFromNonFinalPost(text: string): string {
  let cleaned = text.replace(/https?:\/\/[^\s]+/g, "");
  cleaned = removeThreadLinkPlaceholder(cleaned);
  cleaned = cleaned.split(ACCELERATOR_LINK_PLACEHOLDER).join("");
  cleaned = cleaned.replace(LINK_CTA_SUFFIX, "").trim();
  return cleaned.replace(/\s{2,}/g, " ").trim();
}

/** Normalize the CTA post — link only in the final line. */
export function normalizeFinalThreadPost(text: string): string {
  let cleaned = text.replace(/https?:\/\/[^\s]+/g, "");
  cleaned = removeThreadLinkPlaceholder(cleaned);
  cleaned = cleaned.split(ACCELERATOR_LINK_PLACEHOLDER).join("");
  cleaned = cleaned.replace(LINK_CTA_SUFFIX, "").trim();
  cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
  return ensureFinalPostHasLink(cleaned);
}

export function isValidAcceleratorThreadRows(
  rows: Pick<AcceleratorThreadSeedRow, "text">[]
): boolean {
  if (rows.length < THREAD_MIN_CHARS.length) return false;

  for (let i = 0; i < THREAD_MIN_CHARS.length; i++) {
    const text = rows[i]?.text?.trim() ?? "";
    if (text.length < THREAD_MIN_CHARS[i]) return false;
    if (i < THREAD_MIN_CHARS.length - 1 && text.includes(ACCELERATOR_THREAD_LINK_PLACEHOLDER)) {
      return false;
    }
  }

  return rows[THREAD_MIN_CHARS.length - 1]?.text.includes(ACCELERATOR_THREAD_LINK_PLACEHOLDER) ?? false;
}

/** Detect threads corrupted by regex placeholder handling (stripped letters / injected links). */
export function isAcceleratorThreadCorrupted(
  rows: Pick<AcceleratorThreadSeedRow, "text">[]
): boolean {
  return !isValidAcceleratorThreadRows(rows);
}

export interface AcceleratorThreadSeedRow {
  text: string;
  angle: string;
}

/** Niche-specific beats for conversion threads — keeps fallbacks concrete per niche. */
const NICHE_CONVERSION_BEATS: Record<
  string,
  { problem: string; authority: string; proof: string }
> = {
  fitness: {
    problem: "Most fitness plans fail because they demand 6 days a week you don't have.",
    authority: "I've coached busy adults who couldn't stick to hour-long workouts.",
    proof: "Week 6: down 11 pounds with three 20-minute sessions — no extra cardio.",
  },
  finance: {
    problem: "Most budgeting advice fails because it tracks 47 categories you'll abandon by week 2.",
    authority: "I've watched smart earners stay broke while spreadsheets collected dust.",
    proof: "Nine weeks later: $840 saved with one weekly 15-minute money review.",
  },
  health: {
    problem: "Most wellness hacks fail because they add 8 new habits before fixing sleep.",
    authority: "I've seen energy crashes ruin afternoons for years before one shift stuck.",
    proof: "By week 5: steady afternoon energy from three small daily habits.",
  },
  business: {
    problem: "Most side hustles fail because you post tactics without a repeatable weekly loop.",
    authority: "I've watched creators burn months on content that never converted.",
    proof: "Week 8: first $500 week from the same three actions every Monday.",
  },
  default: {
    problem: "Most people in this niche burn weekends on tactics that look smart but never convert.",
    authority: "I've tested what works when motivation runs out mid-week.",
    proof: "Six weeks later: first consistent result from the same three actions, under an hour a day.",
  },
};

function resolveConversionBeats(nicheKey: string | undefined, nicheLabel: string) {
  const key = (nicheKey ?? nicheLabel).toLowerCase();
  if (key.includes("fit") || key.includes("weight")) return NICHE_CONVERSION_BEATS.fitness;
  if (key.includes("financ") || key.includes("money")) return NICHE_CONVERSION_BEATS.finance;
  if (key.includes("health") || key.includes("wellness")) return NICHE_CONVERSION_BEATS.health;
  if (key.includes("business") || key.includes("market") || key.includes("affiliate")) {
    return NICHE_CONVERSION_BEATS.business;
  }
  return NICHE_CONVERSION_BEATS.default;
}

/**
 * Static fallback 10-post conversion threads when AI generation is unavailable.
 * Mirrors x-thread-rules: hook → 5 core steps → bridge → TL;DR → CTA with link only in post 10.
 */
export function buildStaticAcceleratorXThreadSeeds(
  productName: string,
  niche: string,
  nicheKey?: string
): string[] {
  const short = productName.slice(0, 50);
  const nicheLower = niche.toLowerCase();
  const beats = resolveConversionBeats(nicheKey, niche);

  return [
    `${beats.problem}\n\nThere's a 5-step path that works in weeks — not years.\n\n🧵👇`,
    `${beats.authority}\n\nThe gap isn't effort.\n\nIt's structure.`,
    `Step 1: Pick one outcome in ${nicheLower}.\n\nNot five goals.\n\nOne number you'll track for 30 days.`,
    `Step 2: Stop copying gurus.\n\nTheir schedule isn't yours.\n\nBuild 3 weekly actions you can repeat without motivation.`,
    `Step 3: Kill the friction.\n\nIf a step takes 45+ minutes, you'll skip it.\n\nCap each action at 15 minutes.`,
    `Step 4: Use loss aversion.\n\nReview every Sunday.\n\nMissing one week hurts more than skipping daily hype posts.`,
    `Step 5: Stack speed.\n\nOnce the loop works manually, use a tool to run it faster.\n\n${short} is built for that.`,
    `The #1 mistake?\n\nCollecting tips instead of running one loop for 6 weeks.\n\nMore tactics won't save a broken system.`,
    `TL;DR:\n\n• One outcome\n• 3 weekly actions\n• 15-min cap per step\n• Sunday review\n• Tool for speed`,
    `Ready to run the loop?\n\n${beats.proof}\n\nStart here: ${ACCELERATOR_THREAD_LINK_PLACEHOLDER}\n\nRT post 1 if this helped 🙏`,
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
