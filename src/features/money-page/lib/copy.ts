import { generateStructuredJSON } from "@/features/blog-builder/lib/ai";
import type { MoneyPageCopy } from "./types";
import { isMoneyPageCopy } from "./types";

const SYSTEM = `You write simple, honest affiliate product review pages for beginners.
Return ONLY valid JSON with these keys:
headline, subheadline, productIntro, overview,
benefits (array of 5 {title, description}),
whoFor (array of 4 strings),
features (array of 6 strings),
pros (array of 4 strings),
cons (array of 3 honest strings),
review (2-3 short paragraphs as one string with \\n\\n between paragraphs),
faqs (array of 5 {question, answer}),
finalRecommendation, ctaLabel.

Rules:
- No hype, no fake scarcity, no income claims.
- Plain language. No SEO jargon. No marketing buzzwords like "funnel" or "swipe".
- Cons must be real and fair.
- ctaLabel must be one of: "Check Today's Price" or "Visit Official Website"
- Do not mention AI or that this page was generated.`;

export function fallbackMoneyPageCopy(productName: string, description = ""): MoneyPageCopy {
  const name = productName.trim() || "This product";
  const summary = description.trim() || `${name} is a product people look at when they want a straightforward option.`;
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
    ctaLabel: "Check Today's Price",
  };
}

function validateCopy(raw: unknown): MoneyPageCopy | null {
  if (!isMoneyPageCopy(raw)) return null;
  if (!raw.headline.trim() || raw.benefits.length < 3 || raw.faqs.length < 3) return null;
  return {
    ...raw,
    benefits: raw.benefits.slice(0, 8).map((b) => ({
      title: String((b as { title?: string }).title || "Benefit"),
      description: String((b as { description?: string }).description || ""),
    })),
    whoFor: raw.whoFor.map(String).slice(0, 6),
    features: raw.features.map(String).slice(0, 10),
    pros: raw.pros.map(String).slice(0, 6),
    cons: raw.cons.map(String).slice(0, 5),
    faqs: raw.faqs.slice(0, 8).map((f) => ({
      question: String((f as { question?: string }).question || "Question"),
      answer: String((f as { answer?: string }).answer || ""),
    })),
    ctaLabel: raw.ctaLabel.includes("Official") ? "Visit Official Website" : "Check Today's Price",
  };
}

export async function generateMoneyPageCopy(input: {
  productName: string;
  niche: string;
  description?: string;
  productContext?: string;
}): Promise<MoneyPageCopy> {
  const userPrompt = `Write an affiliate review page for this product.

PRODUCT NAME: ${input.productName}
NICHE: ${input.niche}
DESCRIPTION: ${input.description || "Not provided"}
${input.productContext ? `\nSCRAPED PRODUCT CONTEXT:\n${input.productContext}` : ""}

Keep it beginner-friendly and specific to this product.`;

  try {
    return await generateStructuredJSON<MoneyPageCopy>({
      systemPrompt: SYSTEM,
      userPrompt,
      validate: validateCopy,
      options: { temperature: 0.45, timeoutMs: 90_000, maxRetries: 3 },
    });
  } catch {
    return fallbackMoneyPageCopy(input.productName, input.description);
  }
}
