import type { MoneyPageCopy } from "@/features/money-page/lib/types";
import { fallbackCopyForVariation } from "@/features/money-page/lib/variations";
import type { VaultCatalogEntry, VaultNiche } from "./catalog";

interface NicheCopySeed {
  benefits: { title: string; description: string }[];
  whoFor: string[];
  features: string[];
  pros: string[];
  cons: string[];
  reviewExtra: string;
  faqs: { question: string; answer: string }[];
}

const NICHE_SEEDS: Record<VaultNiche, NicheCopySeed> = {
  "Health & Wellness": {
    benefits: [
      { title: "Daily-routine friendly", description: "Built to fit sleep, stress, or wellness habits without a complicated protocol." },
      { title: "Clear expectations", description: "Honest about what wellness support can and cannot do overnight." },
      { title: "Beginner-readable", description: "Explained without supplement-industry jargon or miracle claims." },
      { title: "Easy fit check", description: "Helps you decide if this matches your actual health goal." },
      { title: "Official path ready", description: "One click to ingredients, usage, and today's price." },
    ],
    whoFor: [
      "People comparing sleep, stress, or daily wellness options",
      "Beginners who dislike hype-heavy health marketing",
      "Adults building a simple morning or evening routine",
      "Anyone who wants a calm product overview before buying",
    ],
    features: [
      "Health & wellness product framing",
      "Routine-friendly use context",
      "Honest trade-offs listed clearly",
      "Official purchase path",
      "Beginner-friendly language",
      "Direct call to action",
    ],
    pros: [
      "Easy to understand for first-time buyers",
      "Useful if you already know your wellness goal",
      "Official details are one click away",
      "Keeps expectations realistic",
    ],
    cons: [
      "Results still depend on habits and consistency",
      "May not replace medical advice for serious issues",
      "Formulas and pricing can change on the official site",
    ],
    reviewExtra:
      "Health products help most when the problem is specific — sleep, stress, digestion, or daily energy.\n\nIf this matches what you need, check the official page for current details and pricing before you buy.",
    faqs: [
      { question: "Is this a medical treatment?", answer: "No. Treat it as consumer wellness support, not a medical cure." },
      { question: "Do I buy on this page?", answer: "No. The buttons send you to the official website or affiliate offer." },
      { question: "Is this for beginners?", answer: "Yes. The page is written for people comparing options for the first time." },
      { question: "What should I verify first?", answer: "Ingredients or specs, usage instructions, and today's official price." },
      { question: "What if I am not sure?", answer: "Do not buy yet. Read the official site, then decide." },
    ],
  },
  "Finance & Investing": {
    benefits: [
      { title: "Beginner-first framing", description: "Written for people learning money systems, not Wall Street insiders." },
      { title: "Action over hype", description: "Focuses on checklists and next steps instead of get-rich promises." },
      { title: "Clear use case", description: "Helps you see whether this tool matches budgeting, investing, or planning." },
      { title: "No fake urgency", description: "No countdown timers or invented scarcity." },
      { title: "Official details ready", description: "Jump to the real offer when you decide it fits." },
    ],
    whoFor: [
      "People building a first budget or emergency fund",
      "Beginners researching investing basics carefully",
      "Self-employed earners organizing money systems",
      "Readers who want calm finance-product overviews",
    ],
    features: [
      "Finance & investing positioning",
      "Beginner-friendly explanation",
      "Checklist-style framing",
      "Official purchase path",
      "Honest limitations",
      "Direct call to action",
    ],
    pros: [
      "Easy to evaluate without guru language",
      "Useful if you already know your money goal",
      "Official page is one click away",
      "Keeps expectations realistic",
    ],
    cons: [
      "Results still depend on your execution",
      "Not a guarantee of investment returns",
      "Offers and pricing can change",
    ],
    reviewExtra:
      "Finance products help when they remove confusion — trackers, planners, or clear investing primers.\n\nThey do not create wealth by themselves. Verify what is included on the official page before you buy.",
    faqs: [
      { question: "Will this make me rich automatically?", answer: "No. It is a tool or guide. Outcomes depend on your decisions and consistency." },
      { question: "Do I buy on this page?", answer: "No. Buttons go to the official website or affiliate offer." },
      { question: "Is this for beginners?", answer: "Yes. The page is written in plain language for first looks." },
      { question: "What should I check?", answer: "What is included, refund policy, and current price." },
      { question: "What if I am unsure?", answer: "Walk away until the official page answers your questions." },
    ],
  },
  "Fitness & Sports": {
    benefits: [
      { title: "Simple to start", description: "Built for people who want progress without a complicated setup." },
      { title: "Home or gym flexible", description: "Fits apartment workouts, gyms, and sport-specific training." },
      { title: "Recovery aware", description: "Framed with warm-ups, form, and sustainable use in mind." },
      { title: "Clear next step", description: "If it fits, the official page is one click away." },
      { title: "Honest limits", description: "No miracle claims — just a practical product look." },
    ],
    whoFor: [
      "Beginners building a home routine",
      "Lifters adding recovery or accessory tools",
      "Athletes comparing sport-specific gear",
      "Anyone who wants a calm fitness product overview",
    ],
    features: [
      "Fitness & sports positioning",
      "Beginner-friendly explanation",
      "Use-case clarity",
      "Official website purchase path",
      "Pros and cons side by side",
      "Direct call to action",
    ],
    pros: [
      "Easy to understand without trainer jargon",
      "Useful if you already know your training goal",
      "Official details are one click away",
      "Keeps expectations realistic",
    ],
    cons: [
      "Results still depend on consistency",
      "May not replace coaching for complex lifts",
      "Packages and pricing can change",
    ],
    reviewExtra:
      "Fitness products help most when they remove friction — better gear, recovery, or simple equipment at home.\n\nIf that is your goal, verify specs and today's price on the official page.",
    faqs: [
      { question: "Will this replace a trainer?", answer: "No. Use it as a tool, not a substitute for good coaching when you need it." },
      { question: "Do I buy on this page?", answer: "No. Buttons go to the official website or affiliate offer." },
      { question: "Is it beginner friendly?", answer: "Yes. The overview is written in plain language." },
      { question: "What should I verify?", answer: "Sizing, included accessories, and current offer details." },
      { question: "What if I am unsure?", answer: "Skip the purchase until the official page answers your questions." },
    ],
  },
  "Digital Marketing": {
    benefits: [
      { title: "Campaign-ready framing", description: "Positioned for traffic, content, ads, or conversion workflows." },
      { title: "Beginner setup", description: "Explained without agency jargon or dense feature dumps." },
      { title: "Solo and small-team fit", description: "Aimed at creators and marketers, not huge enterprise stacks." },
      { title: "Clear trade-offs", description: "Shows what it does well and where it may be limited." },
      { title: "Official trial path", description: "Easy jump to the real product page when ready." },
    ],
    whoFor: [
      "Affiliate marketers building traffic systems",
      "Creators comparing content and analytics tools",
      "Solopreneurs testing ads or funnels",
      "Beginners who dislike dense marketing software pages",
    ],
    features: [
      "Digital marketing product overview",
      "Use-case framing",
      "Beginner-friendly language",
      "Official purchase or trial path",
      "Honest limitations",
      "Direct call to action",
    ],
    pros: [
      "Straightforward for first-time evaluators",
      "Useful if you already know the workflow gap",
      "Official site is one click away",
      "Keeps feature claims grounded",
    ],
    cons: [
      "May not replace a full agency stack",
      "Pricing tiers can change",
      "Results still depend on your creative and offer",
    ],
    reviewExtra:
      "Marketing tools are worth buying when they solve a repeated bottleneck — keywords, creatives, tracking, or publishing.\n\nConfirm integrations, limits, and today's plan pricing on the official page.",
    faqs: [
      { question: "Is there a free trial?", answer: "Check the official website for current trial and plan details." },
      { question: "Do I purchase here?", answer: "No. CTAs send you to the official website or affiliate offer." },
      { question: "Will it work with my stack?", answer: "Verify integrations on the official product page." },
      { question: "Who is it for?", answer: "People who want a plain overview before signing up." },
      { question: "What if I am unsure?", answer: "Do not subscribe yet. Read the official site first." },
    ],
  },
  "Self-Help & Personal Development": {
    benefits: [
      { title: "Practical habit focus", description: "Built for clearer routines, mindset, and communication — not empty inspiration." },
      { title: "Beginner accessible", description: "Explained without guru language or overwhelm." },
      { title: "Goal-oriented", description: "Helps you see if this matches confidence, habits, or relationships." },
      { title: "Honest scope", description: "Says what it covers and what still takes practice." },
      { title: "Official path clear", description: "Jump to the real guide or toolkit when ready." },
    ],
    whoFor: [
      "People rebuilding habits after a reset",
      "Adults working on confidence or communication",
      "Readers who want structured personal-growth tools",
      "Anyone comparing self-help products calmly",
    ],
    features: [
      "Self-help product framing",
      "Habit and mindset context",
      "Beginner-friendly language",
      "Official purchase path",
      "Honest limitations",
      "Direct call to action",
    ],
    pros: [
      "Straightforward for first-time buyers",
      "Useful if you already know your growth goal",
      "Official details are one click away",
      "Keeps promises realistic",
    ],
    cons: [
      "Progress still depends on practice",
      "May not replace coaching or therapy when needed",
      "Access terms and pricing can change",
    ],
    reviewExtra:
      "Personal-development products help when they organize the next steps — habits, prompts, or conversation tools.\n\nConfirm what is included and how you are meant to use it on the official page.",
    faqs: [
      { question: "Will this change my life overnight?", answer: "No. Treat it as a practice tool. Consistency matters more than intensity." },
      { question: "Do I purchase here?", answer: "No. CTAs send you to the official website or affiliate offer." },
      { question: "Who is it for?", answer: "People who want a plain overview before buying a growth tool." },
      { question: "What should I verify?", answer: "What is included, how long access lasts, and refund policy." },
      { question: "What if I am unsure?", answer: "Do not buy yet. Read the official site first." },
    ],
  },
  "Beauty & Skincare": {
    benefits: [
      { title: "Routine-friendly", description: "Fits into a normal morning or night skincare/makeup routine." },
      { title: "Plain ingredient framing", description: "Explains the offer without beauty-industry buzzwords." },
      { title: "Skin-type awareness", description: "Helps you check fit for dry, oily, or sensitive skin." },
      { title: "Honest trade-offs", description: "Includes limits so you are not sold a miracle." },
      { title: "Official path clear", description: "One click to the real product page when you are ready." },
    ],
    whoFor: [
      "People researching a new skincare step",
      "Beginners who dislike heavy marketing language",
      "Shoppers comparing serums, creams, or tools",
      "Anyone who wants a fair recommendation page",
    ],
    features: [
      "Beauty & skincare overview",
      "Routine context",
      "Skin-fit considerations",
      "Official purchase path",
      "Honest limitations",
      "Direct call to action",
    ],
    pros: [
      "Straightforward for first-time buyers",
      "Useful if you already know your skin concern",
      "Official site is easy to reach",
      "Keeps claims grounded",
    ],
    cons: [
      "Results vary by skin type and consistency",
      "May not suit every ingredient preference",
      "Price and sizes can change",
    ],
    reviewExtra:
      "Beauty products are easiest to judge when you already know the concern — dryness, texture, tone, or lashes.\n\nPatch-test when needed, read the official ingredients, and only buy if the fit is clear.",
    faqs: [
      { question: "Is this medical-grade?", answer: "Treat this as a consumer product overview. Confirm claims on the official site." },
      { question: "Do I purchase here?", answer: "No. CTAs send you to the official website or affiliate offer." },
      { question: "Will it work for sensitive skin?", answer: "Check the ingredient list and return policy on the official page." },
      { question: "What should I verify first?", answer: "Active ingredients, size, and today's price." },
      { question: "What if I am unsure?", answer: "Do not buy yet. Read the official site first." },
    ],
  },
  "Education & Learning": {
    benefits: [
      { title: "Structured learning", description: "Built for clear lessons, practice, or study systems." },
      { title: "Beginner accessible", description: "Explained without academic jargon or fluff." },
      { title: "Goal-oriented", description: "Helps you see if this matches exams, skills, or teaching needs." },
      { title: "Honest scope", description: "Says what it covers and what still takes practice." },
      { title: "Official path clear", description: "Jump to the real course or kit when ready." },
    ],
    whoFor: [
      "Students building a study system",
      "Adults learning a new skill",
      "Parents supporting homework routines",
      "Teachers looking for reusable templates",
    ],
    features: [
      "Education & learning framing",
      "Learning-outcome context",
      "Beginner-friendly language",
      "Official purchase path",
      "Honest limitations",
      "Direct call to action",
    ],
    pros: [
      "Straightforward for first-time learners",
      "Useful if you already know your learning goal",
      "Official details are one click away",
      "Keeps promises realistic",
    ],
    cons: [
      "Progress still depends on practice",
      "May not replace a live teacher for every subject",
      "Access terms and pricing can change",
    ],
    reviewExtra:
      "Education products help when they organize the next steps — lessons, practice, or templates.\n\nConfirm what is included and how long access lasts on the official page.",
    faqs: [
      { question: "Is this accredited?", answer: "Check accreditation and certificates on the official website." },
      { question: "Do I purchase here?", answer: "No. CTAs send you to the official website or affiliate offer." },
      { question: "Who is it for?", answer: "People who want a plain overview before enrolling or buying." },
      { question: "What should I verify?", answer: "Syllabus, access length, and refund policy." },
      { question: "What if I am unsure?", answer: "Do not buy yet. Read the official site first." },
    ],
  },
  "Business & Entrepreneurship": {
    benefits: [
      { title: "Operator-first framing", description: "Written for freelancers and founders shipping offers, not theory." },
      { title: "Action over hype", description: "Focuses on checklists, scripts, and systems instead of income promises." },
      { title: "Clear use case", description: "Helps you see whether this matches sales, ops, or product packaging." },
      { title: "No fake urgency", description: "No countdown timers or invented scarcity." },
      { title: "Official details ready", description: "Jump to the real offer when you decide it fits." },
    ],
    whoFor: [
      "Freelancers organizing offers and billing",
      "Founders validating a first product or service",
      "Side-hustle builders who want clearer systems",
      "Readers who want calm business-product overviews",
    ],
    features: [
      "Business & entrepreneurship positioning",
      "Beginner-friendly explanation",
      "Checklist-style framing",
      "Official purchase path",
      "Honest limitations",
      "Direct call to action",
    ],
    pros: [
      "Easy to evaluate without guru language",
      "Useful if you already know your business goal",
      "Official page is one click away",
      "Keeps expectations realistic",
    ],
    cons: [
      "Results still depend on execution",
      "Not a guarantee of revenue",
      "Offers and pricing can change",
    ],
    reviewExtra:
      "Business products help when they remove confusion — templates, trackers, or clear playbooks.\n\nThey do not create customers by themselves. Verify what is included on the official page before you buy.",
    faqs: [
      { question: "Will this make me money automatically?", answer: "No. It is a tool or guide. Results depend on your work." },
      { question: "Do I buy on this page?", answer: "No. Buttons go to the official website or affiliate offer." },
      { question: "Is this for beginners?", answer: "Yes. The page is written in plain language for first looks." },
      { question: "What should I check?", answer: "What is included, refund policy, and current price." },
      { question: "What if I am unsure?", answer: "Walk away until the official page answers your questions." },
    ],
  },
  "Travel & Lifestyle": {
    benefits: [
      { title: "Everyday usefulness", description: "Built for travel, home, and lifestyle needs without marketing noise." },
      { title: "Simple decision framing", description: "Helps you decide if this fits trips, routines, or living spaces." },
      { title: "Clear next step", description: "If it fits, the official page is one click away." },
      { title: "Honest trade-offs", description: "Pros and cons sit side by side on purpose." },
      { title: "Beginner friendly", description: "No jargon — just a calm product overview." },
    ],
    whoFor: [
      "Travelers packing smarter for trips",
      "People upgrading home and lifestyle essentials",
      "Remote workers who live between places",
      "Shoppers who want a fair recommendation page",
    ],
    features: [
      "Travel & lifestyle overview",
      "Use-case clarity",
      "Beginner-friendly positioning",
      "Official purchase path",
      "Known limitations",
      "Direct call to action",
    ],
    pros: [
      "Easy to understand for first-time buyers",
      "Official site is one click away",
      "Useful if you already know you need this category",
      "Straightforward recommendation",
    ],
    cons: [
      "Results still depend on how you use it",
      "May not be the cheapest option in its category",
      "Not a fix for every travel or home situation",
    ],
    reviewExtra:
      "Travel and lifestyle products are worth a closer look when they remove a repeated annoyance on the road or at home.\n\nCheck specs and today's price on the official page, then decide.",
    faqs: [
      { question: "What is this page?", answer: "A simple review and recommendation overview for this product." },
      { question: "Do I buy here?", answer: "No. The buttons send you to the official website or affiliate offer." },
      { question: "Is this a paid recommendation?", answer: "If an affiliate link is used, a commission may be earned at no extra cost to you." },
      { question: "Who is it for?", answer: "People who want a plain-language overview before they visit the official site." },
      { question: "What if I am not sure?", answer: "Do not buy yet. Read the official site, then decide." },
    ],
  },
};

/** Build deterministic MoneyPageCopy for a vault catalog entry (no AI). */
export function buildVaultMoneyPageCopy(
  entry: VaultCatalogEntry,
  heroImageOverride?: string | null
): MoneyPageCopy {
  const base = fallbackCopyForVariation(
    entry.variationId,
    entry.productName,
    entry.productSummary
  );
  const seed = NICHE_SEEDS[entry.niche];

  return {
    ...base,
    productIntro: entry.productSummary,
    overview: `${entry.productName} sits in the ${entry.niche} category. ${entry.productSummary} Below is what it offers, who it is for, and what to know before you buy.`,
    benefits: seed.benefits,
    whoFor: seed.whoFor.map((line) =>
      line.includes(entry.productName)
        ? line
        : line.replace(/People researching .+/i, `People researching ${entry.productName}`)
    ),
    features: seed.features,
    pros: seed.pros,
    cons: seed.cons,
    review: seed.reviewExtra,
    faqs: seed.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer.replace(/this product/gi, entry.productName),
    })),
    heroImage: heroImageOverride?.trim() || undefined,
  };
}
