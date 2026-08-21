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
  sleep: {
    benefits: [
      { title: "Calmer evenings", description: "Built around a simple wind-down routine instead of complicated protocols." },
      { title: "Fewer next-day crashes", description: "Framed for people who hate morning fog more than a late night." },
      { title: "Bedroom-friendly design", description: "Works with common sleep setups — bed, dark room, quiet habits." },
      { title: "Clear expectations", description: "Honest about what sleep support can and cannot do overnight." },
      { title: "Easy to start", description: "You can judge the fit without buying a full sleep overhaul." },
    ],
    whoFor: [
      "People who take too long to fall asleep",
      "Light sleepers woken by noise or light",
      "Travelers with messy sleep schedules",
      "Anyone comparing sleep aids without the hype",
    ],
    features: [
      "Sleep-focused product positioning",
      "Beginner-friendly usage framing",
      "Honest trade-offs listed clearly",
      "Official purchase path",
      "Simple bedtime context",
      "Direct call to action",
    ],
    pros: [
      "Easy to understand for first-time buyers",
      "Fits into a normal evening routine",
      "Useful if sleep is already a known problem",
      "Official details are one click away",
    ],
    cons: [
      "Results still depend on sleep habits",
      "May not replace medical advice for serious issues",
      "Price and formulas can change on the official site",
    ],
    reviewExtra:
      "Sleep products work best when the problem is clear: falling asleep, staying asleep, or recovering from late screens.\n\nIf this matches what you need, check the official page for current details and pricing before you buy.",
    faqs: [
      { question: "Will this fix insomnia overnight?", answer: "No. Treat it as support for better sleep habits, not a medical cure." },
      { question: "Do I buy on this page?", answer: "No. The buttons send you to the official website or affiliate offer." },
      { question: "Is this for beginners?", answer: "Yes. The page is written for people comparing options for the first time." },
      { question: "What should I verify first?", answer: "Ingredients or specs, usage instructions, and today's official price." },
      { question: "What if I am not sure?", answer: "Do not buy yet. Read the official site, then decide." },
    ],
  },
  "boxing & combat sports": {
    benefits: [
      { title: "Training-ready build", description: "Positioned for bag work, pads, or sparring — not fashion gear." },
      { title: "Protection first", description: "Framed around wrists, hands, and safer training sessions." },
      { title: "Gym and home friendly", description: "Useful whether you train in a gym or a garage setup." },
      { title: "Clear fit check", description: "Helps you decide if this gear matches your current level." },
      { title: "No fight-camp fluff", description: "Plain language for beginners and returning fighters." },
    ],
    whoFor: [
      "Beginners starting bag work",
      "People upgrading worn-out gloves or gear",
      "Home gym fighters without a coach on site",
      "Athletes comparing protection vs mobility",
    ],
    features: [
      "Combat-sports product framing",
      "Training-use context",
      "Protection and durability notes",
      "Official purchase path",
      "Honest limitations",
      "Direct call to action",
    ],
    pros: [
      "Straightforward for training use",
      "Official specs are easy to reach",
      "Useful if you already train regularly",
      "Clear recommendation style",
    ],
    cons: [
      "Fit still depends on hand size and preference",
      "May not suit every discipline equally",
      "Price can be higher than basic gym store gear",
    ],
    reviewExtra:
      "Combat gear is only worth it if it matches how you actually train — bags, pads, sparring, or all three.\n\nCheck sizing, materials, and return options on the official page before you commit.",
    faqs: [
      { question: "Is this competition-ready?", answer: "Treat this page as a training-gear overview. Confirm competition rules on the official site." },
      { question: "Do I purchase here?", answer: "No. CTAs send you to the official website or affiliate offer." },
      { question: "Who is it for?", answer: "People who want a plain-language look at training gear before buying." },
      { question: "What should I check?", answer: "Size charts, intended use, and current pricing." },
      { question: "What if the fit is wrong?", answer: "Review the seller's return policy on the official page." },
    ],
  },
  "health & fitness": {
    benefits: [
      { title: "Simple to start", description: "Built for people who want progress without a complicated setup." },
      { title: "Home or gym flexible", description: "Fits apartment workouts and full gym routines alike." },
      { title: "Recovery aware", description: "Framed with warm-ups, form, and sustainable use in mind." },
      { title: "Clear next step", description: "If it fits, the official page is one click away." },
      { title: "Honest limits", description: "No miracle claims — just a practical product look." },
    ],
    whoFor: [
      "Beginners building a home routine",
      "Lifters adding recovery or accessory tools",
      "Runners and active adults comparing gear",
      "Anyone who wants a calm product overview",
    ],
    features: [
      "Fitness-focused positioning",
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
      "Fitness products help most when they remove friction — better form cues, recovery, or simple equipment at home.\n\nIf that is your goal, verify specs and today's price on the official page.",
    faqs: [
      { question: "Will this replace a trainer?", answer: "No. Use it as a tool, not a substitute for good coaching when you need it." },
      { question: "Do I buy on this page?", answer: "No. Buttons go to the official website or affiliate offer." },
      { question: "Is it beginner friendly?", answer: "Yes. The overview is written in plain language." },
      { question: "What should I verify?", answer: "Sizing, included accessories, and current offer details." },
      { question: "What if I am unsure?", answer: "Skip the purchase until the official page answers your questions." },
    ],
  },
  beauty: {
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
      "Beauty product overview",
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
  "make money": {
    benefits: [
      { title: "Beginner-first framing", description: "Written for people starting a side income, not industry insiders." },
      { title: "Action over hype", description: "Focuses on checklists and next steps instead of income promises." },
      { title: "Clear use case", description: "Helps you see whether this tool or guide matches your goal." },
      { title: "No fake urgency", description: "No countdown timers or invented scarcity." },
      { title: "Official details ready", description: "Jump to the real offer when you decide it fits." },
    ],
    whoFor: [
      "People exploring a first side hustle",
      "Freelancers organizing offers and billing",
      "Beginners researching affiliate or digital products",
      "Readers who want calm money-product overviews",
    ],
    features: [
      "Income-tool positioning",
      "Beginner-friendly explanation",
      "Checklist-style framing",
      "Official purchase path",
      "Honest limitations",
      "Direct call to action",
    ],
    pros: [
      "Easy to evaluate without guru language",
      "Useful if you already know your income goal",
      "Official page is one click away",
      "Keeps expectations realistic",
    ],
    cons: [
      "Results still depend on execution",
      "Not a guarantee of income",
      "Offers and pricing can change",
    ],
    reviewExtra:
      "Money products help when they remove confusion — templates, trackers, or clear playbooks.\n\nThey do not create income by themselves. Verify what is included on the official page before you buy.",
    faqs: [
      { question: "Will this make me money automatically?", answer: "No. It is a tool or guide. Results depend on your work." },
      { question: "Do I buy on this page?", answer: "No. Buttons go to the official website or affiliate offer." },
      { question: "Is this for beginners?", answer: "Yes. The page is written in plain language for first looks." },
      { question: "What should I check?", answer: "What is included, refund policy, and current price." },
      { question: "What if I am unsure?", answer: "Walk away until the official page answers your questions." },
    ],
  },
  software: {
    benefits: [
      { title: "Faster daily work", description: "Positioned to cut busywork in writing, planning, or support." },
      { title: "Beginner setup", description: "Explained without enterprise jargon or dense feature lists." },
      { title: "Solo and small-team fit", description: "Aimed at freelancers and small teams, not huge IT departments." },
      { title: "Clear trade-offs", description: "Shows what it does well and where it may be limited." },
      { title: "Official trial path", description: "Easy jump to the real product page when ready." },
    ],
    whoFor: [
      "Freelancers drowning in admin work",
      "Small teams needing a simple tool",
      "People comparing SaaS options calmly",
      "Beginners who dislike dense software pages",
    ],
    features: [
      "Software product overview",
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
      "May not replace specialized enterprise tools",
      "Pricing tiers can change",
      "Learning curve still depends on your stack",
    ],
    reviewExtra:
      "Software is worth buying when it solves a repeated bottleneck — inbox, notes, billing, or publishing.\n\nConfirm integrations, limits, and today's plan pricing on the official page.",
    faqs: [
      { question: "Is there a free trial?", answer: "Check the official website for current trial and plan details." },
      { question: "Do I purchase here?", answer: "No. CTAs send you to the official website or affiliate offer." },
      { question: "Will it work with my tools?", answer: "Verify integrations on the official product page." },
      { question: "Who is it for?", answer: "People who want a plain overview before signing up." },
      { question: "What if I am unsure?", answer: "Do not subscribe yet. Read the official site first." },
    ],
  },
  pets: {
    benefits: [
      { title: "Pet-first design", description: "Framed around comfort, training, or daily care — not gimmicks." },
      { title: "Easy daily use", description: "Fits walks, feeding, or home routines without complexity." },
      { title: "Clear fit check", description: "Helps you match the product to dog, cat, or general pet needs." },
      { title: "Honest limits", description: "No miracle pet claims — just a practical overview." },
      { title: "Official details ready", description: "One click to sizing, ingredients, or specs." },
    ],
    whoFor: [
      "New pet owners comparing essentials",
      "People upgrading beds, toys, or training tools",
      "Owners dealing with shedding, anxiety, or walks",
      "Anyone who wants a calm product review",
    ],
    features: [
      "Pet-product positioning",
      "Daily-use context",
      "Sizing and fit reminders",
      "Official purchase path",
      "Honest limitations",
      "Direct call to action",
    ],
    pros: [
      "Easy to understand for first-time buyers",
      "Useful if you already know the pet need",
      "Official site is easy to reach",
      "Keeps expectations realistic",
    ],
    cons: [
      "Fit still depends on pet size and temperament",
      "May not suit every breed or home setup",
      "Price and packs can change",
    ],
    reviewExtra:
      "Pet products are easiest to judge when the problem is specific — chewing, shedding, sleep, or training.\n\nCheck size charts and return policies on the official page before you buy.",
    faqs: [
      { question: "Is this vet recommended?", answer: "This page is a consumer overview. Confirm guidance with your vet when needed." },
      { question: "Do I buy here?", answer: "No. Buttons go to the official website or affiliate offer." },
      { question: "Will it fit my pet?", answer: "Use the official size chart and product details." },
      { question: "What should I verify?", answer: "Materials, sizing, and today's price." },
      { question: "What if I am unsure?", answer: "Skip the purchase until the official page answers your questions." },
    ],
  },
  education: {
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
      "Education-product framing",
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
  general: {
    benefits: [
      { title: "Everyday usefulness", description: "Built for common home, travel, or work needs." },
      { title: "Simple decision framing", description: "Helps you decide without marketing noise." },
      { title: "Clear next step", description: "If it fits, the official page is one click away." },
      { title: "Honest trade-offs", description: "Pros and cons sit side by side on purpose." },
      { title: "Beginner friendly", description: "No jargon — just a calm product overview." },
    ],
    whoFor: [
      "People researching a practical everyday product",
      "Shoppers who want a fair recommendation page",
      "Anyone comparing options before spending",
      "Readers who prefer plain language",
    ],
    features: [
      "General product overview",
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
      "Not a fix for every situation",
    ],
    reviewExtra:
      "Everyday products are worth a closer look when they remove a repeated annoyance at home, work, or travel.\n\nCheck specs and today's price on the official page, then decide.",
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
export function buildVaultMoneyPageCopy(entry: VaultCatalogEntry): MoneyPageCopy {
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
      line.includes(entry.productName) ? line : line.replace(/People researching .+/i, `People researching ${entry.productName}`)
    ),
    features: seed.features,
    pros: seed.pros,
    cons: seed.cons,
    review: seed.reviewExtra,
    faqs: seed.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer.replace(/this product/gi, entry.productName),
    })),
    heroImage: entry.heroImage,
  };
}
