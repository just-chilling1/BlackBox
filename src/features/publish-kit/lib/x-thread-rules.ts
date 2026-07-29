/** Role for each post in a conversion-optimized X thread (1-based labels in prompts). */
export const THREAD_POST_ROLES = [
  "The Hook",
  "The Context",
  "Core Step 1",
  "Core Step 2",
  "Core Step 3",
  "Core Step 4",
  "Core Step 5",
  "The Bridge",
  "The TL;DR",
  "The CTA",
] as const;

/** 0-based indexes that receive visuals — posts 1, 4, and 7 (Hook, Core Step 2, Core Step 5). */
export const THREAD_IMAGE_POST_INDEXES = [0, 3, 6] as const;

export function buildThreadStoryStructure(): string {
  return THREAD_POST_ROLES.map(
    (role, i) =>
      `${i + 1}. ${role} — ${THREAD_POST_ROLE_HINTS[i]}`
  ).join("\n");
}

const THREAD_POST_ROLE_HINTS = [
  "Stop the scroll. State a massive problem + promise a high-value solution. End with \"🧵👇\". No link.",
  "Establish authority. Why does this matter right now? Shift the reader's perspective. No link.",
  "Deliver an immediate, low-friction win. No link.",
  "Challenge the status quo or highlight a superior method. No link.",
  "Address common friction points or bottlenecks. No link.",
  "Introduce behavioral psychology or advanced tactics. No link.",
  "The final piece of the core value stack. Introduce the product naturally if relevant. No link yet.",
  "Identify the #1 mistake to avoid, tying the previous steps together. No link.",
  "Highly scannable, bulleted summary of Core Steps 1–5 for immediate saving. Use bullet characters (• or -). No link.",
  "The only post with an external link. Drive to the landing page or offer. Ask the reader to retweet Post #1.",
];

export function buildThreadSystemPrompt(platformLabel: string): string {
  return `# Role and Objective
You are an expert social media copywriter and conversion strategist specializing in ${platformLabel} threads.
Your objective is to take technical concepts, product features, or promotional content and translate them into highly engaging, scannable, and conversion-optimized 10-part threads.

Return ONLY valid JSON — no markdown fences.`;
}

export function buildThreadUserPrompt(params: {
  fullContext: string;
  promoLink: string;
  postCount: number;
}): string {
  const count = params.postCount;
  const rolesText = buildThreadStoryStructure();

  return `Using this product + website context, write ONE ${platformLabel()} conversion thread of exactly ${count} connected posts.

${params.fullContext}

Promotion URL (ONLY in Post 10 — use the offer page URL, not a raw affiliate link): ${params.promoLink}

# Core Thread Architecture
Every thread MUST strictly adhere to this exact 10-post sequence:
${rolesText}

# Formatting Rules
- Length: Limit every post to a maximum of 280 characters.
- Line breaks: Use single-sentence paragraphs. Heavy line breaks improve scannability.
- Clutter: DO NOT use hashtags. Limit emojis to 1–2 per post, used strictly as visual bullet points or emphasis.
- Language: Write in a punchy, direct, and authoritative tone. Use active voice. Cut filler words ("very," "really," "just").
- Post 1 must end with "🧵👇"
- Post 9 must be a distinct, bulleted TL;DR summarizing Core Steps 1–5
- Product name may appear in Core Step 5 and/or the CTA — not before Core Step 5

# Links
- Posts 1–9: NO links
- Post 10: exactly ONE external link (the promotion URL) plus a retweet Post #1 ask
- Do NOT invent fake stats, prices, or testimonials — use plausible specifics grounded in context

# Constraint Checklist (verify internally before output)
1. Are there exactly ${count} posts?
2. Is the CTA link strictly isolated in Post 10?
3. Is Post 9 a distinct, bulleted TL;DR?
4. Are all posts under 280 characters?

Return ONLY this JSON shape:
{
  "posts": [
    { "text": "full ready-to-paste post text", "role": "The Hook" }
  ]
}`;
}

function platformLabel(): string {
  return "X (Twitter)";
}
