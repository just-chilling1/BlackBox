import type { MoneyPageCopy } from "./types";

export type MoneyPageVariationId = "honest-review" | "beginner-breakdown" | "smart-buyer";

export interface MoneyPageVariation {
  id: MoneyPageVariationId;
  label: string;
  /** Extra instructions injected into the AI prompt */
  promptAngle: string;
  /** Trust-row bullets shown in the hero */
  trustBullets: [string, string, string];
  /** Section eyebrow / framing */
  eyebrow: string;
  ctaLabels: [string, string];
}

export const MONEY_PAGE_VARIATIONS: MoneyPageVariation[] = [
  {
    id: "honest-review",
    label: "Honest review",
    promptAngle: `ANGLE: Write this as a straight, independent product review.
- Headline should feel like a clear "is it worth it?" review.
- Lead with balanced judgment, then specifics.
- Subheadline should promise a plain-English verdict.`,
    trustBullets: ["Beginner-friendly breakdown", "Updated for today's buyers", "Official link below"],
    eyebrow: "Independent product review",
    ctaLabels: ["Check Today's Price", "Visit Official Website"],
  },
  {
    id: "beginner-breakdown",
    label: "Beginner breakdown",
    promptAngle: `ANGLE: Write this as a beginner-friendly walkthrough.
- Headline should feel like a simple guide, not a hard sell.
- Explain what the product is and who it helps in everyday language.
- Subheadline should promise a no-jargon overview.`,
    trustBullets: ["No jargon, just clarity", "Written for first-time buyers", "See the official offer"],
    eyebrow: "Beginner-friendly guide",
    ctaLabels: ["See Official Offer", "Visit Official Website"],
  },
  {
    id: "smart-buyer",
    label: "Smart buyer",
    promptAngle: `ANGLE: Write this as a practical buyer's checklist.
- Headline should feel decision-oriented ("should you buy?", "what to check first").
- Emphasize trade-offs, fit, and what to verify before spending.
- Subheadline should promise a practical decision framework.`,
    trustBullets: ["What to check before you buy", "Honest pros and cons", "Official site in one click"],
    eyebrow: "Smart buyer checklist",
    ctaLabels: ["Compare Official Price", "Visit Official Website"],
  },
];

export const DEFAULT_MONEY_PAGE_VARIATION: MoneyPageVariationId = "honest-review";

export function isMoneyPageVariationId(value: unknown): value is MoneyPageVariationId {
  return value === "honest-review" || value === "beginner-breakdown" || value === "smart-buyer";
}

export function getMoneyPageVariation(id?: string | null): MoneyPageVariation {
  const found = MONEY_PAGE_VARIATIONS.find((v) => v.id === id);
  return found ?? MONEY_PAGE_VARIATIONS[0];
}

export function resolveMoneyPageVariationId(themeConfig: unknown): MoneyPageVariationId {
  if (!themeConfig || typeof themeConfig !== "object") return DEFAULT_MONEY_PAGE_VARIATION;
  const raw = (themeConfig as Record<string, unknown>).moneyVariation;
  return isMoneyPageVariationId(raw) ? raw : DEFAULT_MONEY_PAGE_VARIATION;
}

/** Pick a variation that differs from the previous one whenever possible. */
export function pickNextMoneyPageVariation(exclude?: MoneyPageVariationId | null): MoneyPageVariationId {
  const pool = exclude
    ? MONEY_PAGE_VARIATIONS.filter((v) => v.id !== exclude)
    : MONEY_PAGE_VARIATIONS;
  const choices = pool.length > 0 ? pool : MONEY_PAGE_VARIATIONS;
  const index = Math.floor(Math.random() * choices.length);
  return choices[index].id;
}

export function fallbackCopyForVariation(
  variationId: MoneyPageVariationId,
  productName: string,
  description = ""
): MoneyPageCopy {
  const name = productName.trim() || "This product";
  const summary =
    description.trim() || `${name} is a product people look at when they want a straightforward option.`;
  const variation = getMoneyPageVariation(variationId);
  const [ctaPrimary] = variation.ctaLabels;

  if (variationId === "beginner-breakdown") {
    return {
      headline: `${name}: A Simple Breakdown for Beginners`,
      subheadline: `What ${name} is, who it helps, and what to know before you decide.`,
      productIntro: summary,
      overview: `${name} is meant to solve a specific problem without a steep learning curve. Here is a plain walkthrough of what it offers and how to judge if it fits.`,
      benefits: [
        { title: "Easy starting point", description: "You can understand the offer without industry experience." },
        { title: "Clear explanation", description: "Each section sticks to everyday language." },
        { title: "Fair expectations", description: "You will see both strengths and limits." },
        { title: "One next step", description: "If it fits, the official page is one click away." },
        { title: "Built for first looks", description: "Ideal when you are researching for the first time." },
      ],
      whoFor: [
        `People seeing ${name} for the first time`,
        "Beginners who want a simple explanation",
        "Anyone who dislikes marketing jargon",
        "Readers who want a calm overview before buying",
      ],
      features: [
        "Core product offer explained simply",
        "Official website purchase path",
        "Beginner-friendly positioning",
        "Clear benefits list",
        "Honest limitations",
        "Direct call to action",
      ],
      pros: [
        "Straightforward for first-time buyers",
        "Official site is easy to reach",
        "Useful if you already know you need this category",
        "Clear recommendation style",
      ],
      cons: [
        "Results still depend on how you use it",
        "May not be the cheapest option available",
        "Not a fix for every situation",
      ],
      review: `${name} is easier to evaluate when you strip away the hype.\n\nIf the problem it solves matches yours, visit the official page, read the offer carefully, and only buy if the fit feels right.`,
      faqs: [
        { question: "What is this page?", answer: `A beginner-friendly overview of ${name}.` },
        { question: "Do I buy here?", answer: "No. The buttons send you to the official website or affiliate offer page." },
        { question: "Is this a paid recommendation?", answer: "If an affiliate link is used, a commission may be earned at no extra cost to you." },
        { question: "Who is it for?", answer: "People who want a simple explanation before they visit the official site." },
        { question: "What if I am not sure?", answer: "Do not buy yet. Read the official site, then decide." },
      ],
      finalRecommendation: `If ${name} sounds like the right fit after this breakdown, check the official page. If not, keep comparing options.`,
      ctaLabel: ctaPrimary,
    };
  }

  if (variationId === "smart-buyer") {
    return {
      headline: `Should You Buy ${name}? What to Check First`,
      subheadline: `A practical checklist so you can decide with clear eyes — not pressure.`,
      productIntro: summary,
      overview: `Before you spend on ${name}, weigh the fit, the trade-offs, and what the official page actually promises. Use this page as a decision filter.`,
      benefits: [
        { title: "Decision-first framing", description: "Focus on whether it is worth buying for your situation." },
        { title: "Trade-offs called out", description: "Pros and cons sit side by side on purpose." },
        { title: "Price path is clear", description: "You can jump to the official offer when you are ready." },
        { title: "No fake urgency", description: "No countdown timers or invented scarcity." },
        { title: "Buyer questions covered", description: "FAQs tackle the checks smart shoppers make." },
      ],
      whoFor: [
        `People comparing ${name} against alternatives`,
        "Buyers who want a checklist, not a pitch",
        "Anyone verifying fit before they pay",
        "Readers who care about honest cons",
      ],
      features: [
        "Fit-focused overview",
        "Official purchase path",
        "Pros and cons comparison",
        "Practical buyer questions",
        "Clear limitations",
        "Direct official CTA",
      ],
      pros: [
        "Helps you decide with a checklist mindset",
        "Official pricing is one click away",
        "Useful when you already know the category",
        "Keeps expectations realistic",
      ],
      cons: [
        "You still need to verify details on the official site",
        "Price and packages can change",
        "May not beat every competitor on cost",
      ],
      review: `${name} is worth a closer look only if the problem it solves is yours.\n\nCheck today's official price, confirm what is included, and skip it if the fit is weak.`,
      faqs: [
        { question: "What should I verify first?", answer: `Confirm what ${name} includes, who it is for, and the current official price.` },
        { question: "Do I purchase on this page?", answer: "No. CTAs send you to the official website or affiliate offer." },
        { question: "Is there an affiliate relationship?", answer: "If an affiliate link is used, a commission may be earned at no extra cost to you." },
        { question: "When should I walk away?", answer: "If the cons outweigh the pros for your situation, keep looking." },
        { question: "What is the fastest next step?", answer: "Open the official page, compare the offer, then decide." },
      ],
      finalRecommendation: `Buy ${name} only if the checklist above lines up with your needs. Otherwise, use the official page to compare and move on.`,
      ctaLabel: ctaPrimary,
    };
  }

  // honest-review (default)
  return {
    headline: `Is ${name} Worth It? An Honest Look`,
    subheadline: `A plain-English review so you can decide if ${name} is the right next step.`,
    productIntro: summary,
    overview: `${name} is designed to help with a specific problem. Below is what it offers, who it is for, and what to know before you buy.`,
    benefits: [
      { title: "Simple to understand", description: "You should not need a technical background to get started." },
      { title: "Clear next step", description: "If it fits, you can check the official page in one click." },
      { title: "Honest trade-offs", description: "This page includes both the upsides and the limits." },
      { title: "Buyer-focused", description: "Written for people who just want a fair recommendation." },
      { title: "No fluff", description: "Skip the jargon and get the facts that matter." },
    ],
    whoFor: [
      `People researching ${name} for the first time`,
      "Beginners who want a simple explanation",
      "Anyone comparing options before they spend money",
      "Readers who prefer honest reviews over hype",
    ],
    features: [
      "Core product offer",
      "Official website purchase",
      "Beginner-friendly positioning",
      "Clear benefits",
      "Known limitations",
      "Direct call to action",
    ],
    pros: [
      "Easy to understand for first-time buyers",
      "Official site is one click away",
      "Useful if you already know you need this type of product",
      "Straightforward recommendation",
    ],
    cons: [
      "Results still depend on how you use it",
      "May not be the cheapest option in its category",
      "Not a magic fix for every situation",
    ],
    review: `${name} is a reasonable option if you already know you need help in this area.\n\nRead the official page, check today's price, and only buy if the offer matches what you actually need.`,
    faqs: [
      { question: "What is this page?", answer: `This is a simple review and recommendation page for ${name}.` },
      { question: "Do I buy here?", answer: "No. The buttons send you to the official website or the affiliate offer page." },
      { question: "Is this a paid recommendation?", answer: "If an affiliate link is used, a commission may be earned at no extra cost to you." },
      { question: "Who is it for?", answer: "People who want a plain-language overview before they visit the official site." },
      { question: "What if I am not sure?", answer: "Do not buy yet. Read the official site, then decide." },
    ],
    finalRecommendation: `If ${name} matches what you need, visit the official page and check today's price. If it does not, keep looking.`,
    ctaLabel: ctaPrimary,
  };
}
