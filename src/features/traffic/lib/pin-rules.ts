import { generateStructuredJSON } from "@/features/blog-builder/lib/ai";
import { cleanProductLabel } from "@/features/traffic/lib/product-label";

export interface PinCopy {
  headline: string;
  title: string;
  description: string;
  keywords: string[];
}

export const DEFAULT_PIN_COUNT = 10;
export const MAX_PIN_COUNT = 10;

export function clampPinCount(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return DEFAULT_PIN_COUNT;
  return Math.min(MAX_PIN_COUNT, Math.max(1, Math.round(n)));
}

function systemPrompt(count: number): string {
  return `You write Pinterest pins for a beginner affiliate marketer.
Return ONLY JSON: { "pins": [ { "headline", "title", "description", "keywords" } ] }
Write exactly ${count} pins. Every headline must be unique.
headline: 4-7 words, punchy overlay text that fits a pin image. No emojis. Use the short product name only — never a full review title. Prefer short words; avoid long compound phrases.
title: Pinterest title, max 100 characters — can be a bit longer than the headline.
description: Pinterest description, max 500 characters, natural language, soft CTA to read the full review.
keywords: 3-8 short search phrases about the product itself.
Do not mention AI, SEO settings, or affiliate commissions.`;
}

/** Short overlay-safe headlines — each pin gets a distinct angle. */
export function fallbackPins(productName: string, count = DEFAULT_PIN_COUNT): PinCopy[] {
  const name = cleanProductLabel(productName) || productName || "this product";
  const pinCount = clampPinCount(count);
  const templates = [
    `What ${name} really does`,
    `Is ${name} worth buying?`,
    `Before you buy ${name}`,
    `${name}: honest take`,
    `Who ${name} is for`,
    `The truth about ${name}`,
    `${name}: first-week notes`,
    `Try ${name} or pass?`,
    `${name} explained simply`,
    `${name}: calm review`,
  ];
  return templates.slice(0, pinCount).map((headline, i) => ({
    headline,
    title: headline.slice(0, 100),
    description: `A clear, beginner-friendly look at ${name} — what it is, who it helps, and what to check before you buy. Read the full review for pros, cons, and a straight recommendation.`,
    keywords: [name, "review", "is it worth it", "honest review", `pin ${i + 1}`].slice(0, 6),
  }));
}

/** Cap overlay text so Satori does not clip mid-word on the pin image. */
export function pinOverlayHeadline(headline: string, maxChars = 36): string {
  const cleaned = headline.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxChars) return cleaned;
  const truncated = cleaned.slice(0, maxChars);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace >= 14) return truncated.slice(0, lastSpace).trim();
  return truncated.trim();
}

function makeValidate(count: number) {
  const minAccept = count <= 4 ? count : Math.max(Math.ceil(count * 0.8), 1);
  return (raw: unknown): PinCopy[] | null => {
    if (!raw || typeof raw !== "object") return null;
    const pins = (raw as { pins?: unknown }).pins;
    if (!Array.isArray(pins) || pins.length < minAccept) return null;
    const seen = new Set<string>();
    const mapped = pins
      .slice(0, count)
      .map((pin) => {
        const p = pin as Record<string, unknown>;
        const headline = String(p.headline || p.title || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 56);
        const key = headline.toLowerCase();
        if (!headline || seen.has(key)) return null;
        seen.add(key);
        return {
          headline,
          title: String(p.title || p.headline || "").slice(0, 100),
          description: String(p.description || "").slice(0, 500),
          keywords: Array.isArray(p.keywords) ? p.keywords.map(String).slice(0, 8) : [],
        };
      })
      .filter((p): p is PinCopy => Boolean(p?.headline && p?.title));
    return mapped.length >= minAccept ? mapped.slice(0, count) : null;
  };
}

export async function generatePinCopy(
  productName: string,
  context = "",
  count = DEFAULT_PIN_COUNT
): Promise<PinCopy[]> {
  const name = cleanProductLabel(productName) || productName;
  const pinCount = clampPinCount(count);
  try {
    const pins = await generateStructuredJSON<PinCopy[]>({
      systemPrompt: systemPrompt(pinCount),
      userPrompt: `Create ${pinCount} Pinterest pins promoting a review page for the product "${name}".\nUse the short product name "${name}" in headlines — do not use a long review title.\n${context ? `Context:\n${context}` : ""}`,
      validate: makeValidate(pinCount),
      options: { temperature: 0.7, timeoutMs: 90_000 },
    });
    return pins.slice(0, pinCount);
  } catch {
    return fallbackPins(name, pinCount);
  }
}
