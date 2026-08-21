import type { PinCopy } from "@/features/traffic/lib/pin-rules";
import type { VaultCatalogEntry, VaultNiche } from "./catalog";

const NICHE_PIN_HOOKS: Record<VaultNiche, string[]> = {
  sleep: [
    "What nobody tells you about better sleep",
    "Is this sleep product worth it in 2026?",
    "Before you buy another sleep aid, read this",
    "Honest look: falling asleep without the hype",
    "Who this sleep option is actually for",
    "The simple truth about wind-down routines",
    "What I wish I knew before trying this",
    "Should you skip this sleep product?",
    "A calm breakdown in plain English",
    "Night routine check: does this fit?",
  ],
  "boxing & combat sports": [
    "7 things fighters notice about this gear",
    "Is this training gear worth it in 2026?",
    "Before you buy gloves or pads, read this",
    "Honest look at protection vs hype",
    "Who this combat gear is actually for",
    "The simple truth about bag-work upgrades",
    "What I wish I knew in my first camp",
    "Should you skip this piece of gear?",
    "Training gear explained in plain English",
    "A calm fit-check before you spar",
  ],
  "health & fitness": [
    "7 things nobody tells you about this fitness pick",
    "Is this fitness product worth it in 2026?",
    "Before you buy another workout tool, read this",
    "Honest review for beginners and returners",
    "Who this fitness option is actually for",
    "The simple truth about home-gym upgrades",
    "What I wish I knew before ordering",
    "Should you skip this fitness product?",
    "A plain-English fitness product breakdown",
    "A calm look at whether it fits your routine",
  ],
  beauty: [
    "7 things skincare buyers notice first",
    "Is this beauty product worth it in 2026?",
    "Before you add another serum, read this",
    "Honest look without beauty buzzwords",
    "Who this beauty product is actually for",
    "The simple truth about routine upgrades",
    "What I wish I knew before buying",
    "Should you skip this beauty product?",
    "A calm skincare breakdown in plain English",
    "Fit-check: does this match your skin goal?",
  ],
  "make money": [
    "7 things beginners miss about this money tool",
    "Is this side-income product worth it in 2026?",
    "Before you buy another hustle guide, read this",
    "Honest look without income promises",
    "Who this money product is actually for",
    "The simple truth about starter systems",
    "What I wish I knew before paying",
    "Should you skip this money product?",
    "A calm overview in plain English",
    "Checklist: does this match your goal?",
  ],
  software: [
    "7 things users notice about this software",
    "Is this app worth it in 2026?",
    "Before you subscribe to another tool, read this",
    "Honest software look without jargon",
    "Who this software is actually for",
    "The simple truth about workflow upgrades",
    "What I wish I knew before signing up",
    "Should you skip this software?",
    "A plain-English software breakdown",
    "Fit-check: does this clear your bottleneck?",
  ],
  pets: [
    "7 things pet owners notice about this product",
    "Is this pet product worth it in 2026?",
    "Before you buy another pet gadget, read this",
    "Honest pet-product look without fluff",
    "Who this pet product is actually for",
    "The simple truth about daily pet care upgrades",
    "What I wish I knew before ordering",
    "Should you skip this pet product?",
    "A calm pet product breakdown",
    "Fit-check: does this match your pet's need?",
  ],
  education: [
    "7 things learners notice about this course kit",
    "Is this learning product worth it in 2026?",
    "Before you buy another study system, read this",
    "Honest education look without hype",
    "Who this learning product is actually for",
    "The simple truth about structured practice",
    "What I wish I knew before enrolling",
    "Should you skip this education product?",
    "A plain-English learning breakdown",
    "Fit-check: does this match your study goal?",
  ],
  general: [
    "7 things nobody tells you about this product",
    "Is it worth it in 2026?",
    "Before you buy, read this calm overview",
    "Honest review without the marketing noise",
    "Who this product is actually for",
    "The simple truth in plain English",
    "What I wish I knew first",
    "Should you skip this product?",
    "A beginner-friendly product breakdown",
    "A calm look before you spend",
  ],
};

/** Build 10 deterministic pin drafts for vault preview (not stored). */
export function buildVaultPinDrafts(entry: VaultCatalogEntry): PinCopy[] {
  const name = entry.productName;
  const hooks = NICHE_PIN_HOOKS[entry.niche];
  const nicheKeyword = entry.niche.split("&")[0].trim();

  return hooks.map((hook, i) => {
    const headline = hook.includes("this")
      ? hook.replace(/this (sleep |fitness |beauty |money |pet |education |combat )?product/i, name).replace(/this software/i, name).replace(/this gear/i, name).replace(/this app/i, name).replace(/this course kit/i, name).replace(/this learning product/i, name).replace(/this piece of gear/i, name)
      : `${hook}: ${name}`;
    const clippedHeadline = (headline.includes(name) ? headline : `${headline} — ${name}`).slice(0, 80);
    return {
      headline: clippedHeadline,
      title: clippedHeadline.slice(0, 100),
      description: `A simple review of ${name} for ${entry.niche}. Tap through to the money page for benefits, drawbacks, and a clear recommendation.`,
      keywords: [name, nicheKeyword, "review", "is it worth it", "honest review", `pin ${i + 1}`].slice(0, 6),
    };
  });
}
