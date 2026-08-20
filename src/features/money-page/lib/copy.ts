import { generateStructuredJSON } from "@/features/blog-builder/lib/ai";
import type { MoneyPageCopy } from "./types";
import { isMoneyPageCopy } from "./types";
import {
  fallbackCopyForVariation,
  getMoneyPageVariation,
  pickNextMoneyPageVariation,
  type MoneyPageVariationId,
} from "./variations";

function buildSystemPrompt(variationId: MoneyPageVariationId): string {
  const variation = getMoneyPageVariation(variationId);
  const ctaOptions = variation.ctaLabels.map((l) => `"${l}"`).join(" or ");
  return `You write simple, honest affiliate product review pages for beginners.
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

${variation.promptAngle}

Rules:
- No hype, no fake scarcity, no income claims.
- Plain language. No SEO jargon. No marketing buzzwords like "funnel" or "swipe".
- Cons must be real and fair.
- ctaLabel must be one of: ${ctaOptions}
- Do not mention AI or that this page was generated.
- Make this draft feel distinct from a generic template — vary headline structure and section emphasis for this angle.`;
}

export function fallbackMoneyPageCopy(
  productName: string,
  description = "",
  variationId?: MoneyPageVariationId | null
): MoneyPageCopy {
  return fallbackCopyForVariation(
    variationId ?? pickNextMoneyPageVariation(null),
    productName,
    description
  );
}

function validateCopy(raw: unknown, variationId: MoneyPageVariationId): MoneyPageCopy | null {
  if (!isMoneyPageCopy(raw)) return null;
  if (!raw.headline.trim() || raw.benefits.length < 3 || raw.faqs.length < 3) return null;
  const allowed = getMoneyPageVariation(variationId).ctaLabels;
  const cta =
    allowed.find((label) => raw.ctaLabel.toLowerCase().includes(label.toLowerCase().slice(0, 8))) ||
    allowed[0];
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
    ctaLabel: cta,
  };
}

export async function generateMoneyPageCopy(input: {
  productName: string;
  niche: string;
  description?: string;
  productContext?: string;
  variationId?: MoneyPageVariationId | null;
  /** Prior variation to avoid repeating on regenerate */
  excludeVariationId?: MoneyPageVariationId | null;
}): Promise<{ copy: MoneyPageCopy; variationId: MoneyPageVariationId }> {
  const variationId =
    input.variationId ?? pickNextMoneyPageVariation(input.excludeVariationId ?? null);
  const variation = getMoneyPageVariation(variationId);
  const seed = Math.random().toString(36).slice(2, 8);

  const userPrompt = `Write an affiliate review page for this product.

PRODUCT NAME: ${input.productName}
NICHE: ${input.niche}
DESCRIPTION: ${input.description || "Not provided"}
VARIATION: ${variation.label} (${variationId})
UNIQUENESS SEED: ${seed}
${input.productContext ? `\nSCRAPED PRODUCT CONTEXT:\n${input.productContext}` : ""}

Keep it beginner-friendly and specific to this product.
Use the ${variation.label} angle so the headline, framing, and emphasis feel different from other drafts.`;

  try {
    const copy = await generateStructuredJSON<MoneyPageCopy>({
      systemPrompt: buildSystemPrompt(variationId),
      userPrompt,
      validate: (raw) => validateCopy(raw, variationId),
      options: { temperature: 0.85, timeoutMs: 90_000, maxRetries: 3 },
    });
    return { copy, variationId };
  } catch {
    return {
      copy: fallbackMoneyPageCopy(input.productName, input.description, variationId),
      variationId,
    };
  }
}
