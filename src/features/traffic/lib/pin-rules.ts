import { generateStructuredJSON } from "@/features/blog-builder/lib/ai";

export interface PinCopy {
  headline: string;
  title: string;
  description: string;
  keywords: string[];
}

const SYSTEM = `You write Pinterest pins for a beginner affiliate marketer.
Return ONLY JSON: { "pins": [ { "headline", "title", "description", "keywords" } ] }
Write exactly 10 pins.
headline: 6-10 words, attention grabbing, no emojis.
title: Pinterest title, max 100 characters.
description: Pinterest description, max 500 characters, natural language, include a soft CTA.
keywords: 3-8 short search phrases.
Do not mention AI, SEO settings, or affiliate commissions.`;

export function fallbackPins(productName: string): PinCopy[] {
  const name = productName || "this product";
  const templates = [
    `7 things nobody tells you about ${name}`,
    `Is ${name} worth it in 2026?`,
    `Before you buy ${name}, read this`,
    `Honest review: ${name}`,
    `Who ${name} is actually for`,
    `The simple truth about ${name}`,
    `${name} — what I wish I knew first`,
    `Should you skip ${name}?`,
    `${name} in plain English`,
    `A calm look at ${name}`,
  ];
  return templates.map((headline, i) => ({
    headline,
    title: headline.slice(0, 100),
    description: `A simple review of ${name}. Tap through to the money page for benefits, drawbacks, and a clear recommendation.`,
    keywords: [name, "review", "is it worth it", "honest review", `pin ${i + 1}`].slice(0, 6),
  }));
}

function validate(raw: unknown): PinCopy[] | null {
  if (!raw || typeof raw !== "object") return null;
  const pins = (raw as { pins?: unknown }).pins;
  if (!Array.isArray(pins) || pins.length < 8) return null;
  const mapped = pins.slice(0, 10).map((pin) => {
    const p = pin as Record<string, unknown>;
    return {
      headline: String(p.headline || p.title || "").slice(0, 80),
      title: String(p.title || p.headline || "").slice(0, 100),
      description: String(p.description || "").slice(0, 500),
      keywords: Array.isArray(p.keywords) ? p.keywords.map(String).slice(0, 8) : [],
    };
  }).filter((p) => p.headline && p.title);
  return mapped.length >= 8 ? mapped : null;
}

export async function generatePinCopy(productName: string, context = ""): Promise<PinCopy[]> {
  try {
    const pins = await generateStructuredJSON<PinCopy[]>({
      systemPrompt: SYSTEM,
      userPrompt: `Create 10 Pinterest pins promoting a review page for "${productName}".\n${context ? `Context:\n${context}` : ""}`,
      validate,
      options: { temperature: 0.7, timeoutMs: 90_000 },
    });
    return pins.slice(0, 10);
  } catch {
    return fallbackPins(productName);
  }
}
