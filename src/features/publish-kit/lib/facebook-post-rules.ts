import { cleanProductLabel } from "@/features/traffic/lib/product-label";

/** Distinct hook angles — one per post in a 10X batch. */
export const FACEBOOK_POST_ANGLES = [
  {
    label: "Personal story",
    instruction:
      "Open with a specific moment from your life (time, place, feeling). Share what changed after you found this product.",
  },
  {
    label: "Pain point",
    instruction:
      "Describe the frustration of NOT having a solution — make the reader nod. Then pivot to hope.",
  },
  {
    label: "Curiosity gap",
    instruction:
      "Tease a surprising result or counterintuitive truth. Do not reveal everything — make them want to click.",
  },
  {
    label: "Social proof",
    instruction:
      "Write as if sharing what friends, coworkers, or people in the niche are quietly doing. Ground it in the territory.",
  },
  {
    label: "Before / after",
    instruction:
      "Contrast life before vs after in vivid, concrete terms — habits, money, time, confidence, or health.",
  },
  {
    label: "Question hook",
    instruction:
      "Open with a direct question that hits a real desire or fear in this niche. Answer it through the post.",
  },
  {
    label: "Quick tip",
    instruction:
      "Lead with one actionable tip from the product's world, then mention the full resource at the link.",
  },
  {
    label: "Contrarian take",
    instruction:
      "Challenge a common belief in this niche, then explain what actually works — tied to the product.",
  },
  {
    label: "List format",
    instruction:
      'Use a scannable "3 reasons" or "5 signs you need this" format. Keep it conversational, not bullet-spam.',
  },
  {
    label: "Honest recommendation",
    instruction:
      "Write like texting a friend — who it's for, who should skip it, and why you still recommend checking it out.",
  },
] as const;

export const FACEBOOK_POST_COUNT = 10;

export function buildFacebookPostSystemPrompt(): string {
  return `You are a world-class Facebook copywriter for affiliate marketers.
You write posts that stop the scroll, feel personal, and drive clicks — never spammy or salesy.
Each post should read like a real person sharing something they found, not an ad.
Return ONLY valid JSON — no markdown fences or commentary.`;
}

export function buildFacebookPostUserPrompt(params: {
  fullContext: string;
  postCount?: number;
}): string {
  const count = params.postCount ?? FACEBOOK_POST_COUNT;
  const anglesText = FACEBOOK_POST_ANGLES.slice(0, count)
    .map((a, i) => `${i + 1}. ${a.label}: ${a.instruction}`)
    .join("\n");

  return `Using this money page + product context, write exactly ${count} distinct Facebook posts.

${params.fullContext}

## One angle per post (follow in order)
${anglesText}

## Length and format
- Each post: 3–6 sentences, roughly 350–600 characters — enough to tell a mini-story or make a real point
- Write in first person or direct "you" address — contractions and natural rhythm
- 1–3 emoji total per post, placed naturally (never emoji-only lines)
- NO hashtags
- Each post MUST end with a natural call-to-action that includes the exact placeholder [LINK]
- Vary openings — no two posts may start with the same word or sentence pattern

## Voice and quality
- Pull specific details from the context (benefits, audience, niche language) — do not stay generic
- Use concrete specifics: numbers, timeframes, or named situations when grounded in context
- Do NOT invent fake stats, prices, brand names, or testimonials
- Banned adjectives: revolutionary, game-changing, cutting-edge, seamless, incredible, amazing
- If it reads like a brochure, rewrite until it sounds spoken aloud

Return ONLY this JSON shape:
{
  "posts": [
    {
      "hook": "attention-grabbing opener (1–2 sentences)",
      "body": "main content (2–4 sentences)",
      "cta": "natural close with [LINK] placeholder",
      "angle": "angle label from the list above"
    }
  ]
}`;
}

export interface ParsedFacebookPost {
  text: string;
  angle?: string;
}

function normalizeLinkPlaceholder(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "[LINK]";
  return trimmed.includes("[LINK]") ? trimmed : `${trimmed} [LINK]`;
}

function combinePostParts(row: {
  hook?: string;
  body?: string;
  cta?: string;
  text?: string;
}): string {
  if (typeof row.text === "string" && row.text.trim()) {
    return normalizeLinkPlaceholder(row.text);
  }

  const parts = [row.hook, row.body, row.cta]
    .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    .map((p) => p.trim());

  if (parts.length === 0) return "";
  return normalizeLinkPlaceholder(parts.join("\n\n"));
}

export function parseFacebookPostResponse(
  raw: unknown,
  maxCount = FACEBOOK_POST_COUNT
): ParsedFacebookPost[] {
  const parsed = raw as { posts?: unknown } | null;
  if (!Array.isArray(parsed?.posts)) return [];

  return (parsed.posts as unknown[])
    .map((row): ParsedFacebookPost | null => {
      if (!row || typeof row !== "object") return null;
      const record = row as {
        hook?: string;
        body?: string;
        cta?: string;
        text?: string;
        angle?: string;
      };
      const text = combinePostParts(record);
      if (!text || text === "[LINK]") return null;
      return {
        text,
        angle: typeof record.angle === "string" ? record.angle.trim() : undefined,
      };
    })
    .filter((p): p is ParsedFacebookPost => p !== null)
    .slice(0, maxCount);
}

export function parseFacebookPostStrings(
  posts: unknown[],
  maxCount = FACEBOOK_POST_COUNT
): ParsedFacebookPost[] {
  return posts
    .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    .map((p) => ({ text: normalizeLinkPlaceholder(p) }))
    .slice(0, maxCount);
}

/** Template posts when RapidAPI quota is unavailable — mirrors pin/money-page fallbacks. */
export function fallbackFacebookPosts(params: {
  productName: string;
  territory: string;
  postCount?: number;
}): ParsedFacebookPost[] {
  const name = cleanProductLabel(params.productName) || params.productName || "this resource";
  const territory = params.territory.trim() || "this niche";
  const count = Math.min(params.postCount ?? FACEBOOK_POST_COUNT, FACEBOOK_POST_ANGLES.length);

  const templates = [
    `A few weeks ago I kept hitting the same wall with ${territory}. A friend sent me ${name} and I finally had a clear starting point instead of random tips.\n\nIf you're stuck in the same loop, this breakdown might help: [LINK]`,
    `Anyone else feel like ${territory} advice online is either too vague or way too salesy? ${name} was one of the few pages that felt practical without the hype.\n\nWorth a quick read: [LINK]`,
    `I almost scrolled past ${name} — then noticed it answered the exact question I'd been asking about ${territory}.\n\nCurious? Here's the page I bookmarked: [LINK]`,
    `Three people in my circle quietly switched how they handle ${territory} this year. The common thread? They all started with ${name} before buying anything else.\n\nSee what they're looking at: [LINK]`,
    `Before: guessing, second-guessing, and wasting money on ${territory}. After: a simple checklist from ${name} that actually matched my situation.\n\nBefore/after details here: [LINK]`,
    `Real talk — are you still piecing together ${territory} advice from random posts? ${name} pulled the important parts into one place for me.\n\nAnswer for yourself here: [LINK]`,
    `One thing that helped my ${territory} routine: stop chasing ten tactics and read one solid overview first. ${name} is the overview I keep sending people.\n\nQuick tip + full breakdown: [LINK]`,
    `Hot take: most ${territory} "hacks" skip the basics. ${name} starts where beginners should start — then you decide if it's for you.\n\nRead the no-hype version: [LINK]`,
    `3 signs you might need a better ${territory} plan:\n1) You're overwhelmed by conflicting advice\n2) You keep restarting every month\n3) You haven't read a straight breakdown like ${name}\n\nStart here: [LINK]`,
    `Texting a friend about ${name}: good if you want a calm, honest look at ${territory}. Skip it if you want overnight miracles.\n\nI'm still glad I read it — see for yourself: [LINK]`,
  ];

  return templates.slice(0, count).map((text, i) => ({
    text: normalizeLinkPlaceholder(text),
    angle: FACEBOOK_POST_ANGLES[i]?.label,
  }));
}
