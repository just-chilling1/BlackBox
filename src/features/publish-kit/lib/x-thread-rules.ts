/** Story roles for each post in a product thread (1-based labels in prompts). */
export const THREAD_POST_ROLES = [
  "Hook",
  "Scene",
  "Stakes",
  "Failure",
  "Turning point",
  "Mechanism",
  "Product reveal",
  "Proof",
  "Objection",
  "CTA",
] as const;

/** 0-based indexes that receive visuals — posts 1, 4, and 7 (not consecutive). */
export const THREAD_IMAGE_POST_INDEXES = [0, 3, 6] as const;

export function buildThreadStoryStructure(): string {
  return THREAD_POST_ROLES.map(
    (role, i) =>
      `${i + 1}. ${role} — ${THREAD_POST_ROLE_HINTS[i]}`
  ).join("\n");
}

const THREAD_POST_ROLE_HINTS = [
  "Standalone hook: bold claim, concrete benefit, or story loop. Include a specific number, date, or named result. Open with 2–3 sentences that pull the reader in — not a one-liner. No link, hashtag, 🧵, or the word \"thread\" or \"introducing.\"",
  "Place the hero in a concrete scene: a date, a place, and at least one number. Use 2–3 sentences to set the scene.",
  "Raise the stakes — what happens if nothing changes. Use 2–3 sentences so the cost feels real.",
  "2–3 failed attempts and why they failed — expand each attempt with a sentence of detail. Mandatory — a thread without failure reads as an ad.",
  "The turning point in 1–2 vivid sentences — enough context that it feels earned, not a punchline.",
  "Teach the mechanism clearly enough that the reader could do it manually without buying anything. Use 2–4 sentences with concrete steps or examples.",
  "Introduce the product as the thing that makes step 6 fast or repeatable — 2–3 sentences, casual, no launch language. No link yet.",
  "Deliver proof: a specific number, a timeframe, and enough detail that the result feels believable — 2–3 sentences.",
  "Handle the biggest objection or state who this is NOT for — 2–3 sentences with a clear reason.",
  "Recap in 4–5 lines. End with exactly ONE call to action and the promotion URL.",
];

export function buildThreadSystemPrompt(platformLabel: string): string {
  return `You are an expert ${platformLabel} storyteller for affiliate marketers.
Write ONE cohesive product story thread — not separate promo posts.
The reader is the hero. The author is the mentor. The product is a tool.
Return ONLY valid JSON — no markdown fences.`;
}

export function buildThreadUserPrompt(params: {
  fullContext: string;
  promoLink: string;
  postCount: number;
}): string {
  const count = params.postCount;
  const rolesText = buildThreadStoryStructure();

  return `Using this product + website context, write ONE ${platformLabel()} story thread of exactly ${count} connected posts.

${params.fullContext}

Promotion URL (ONLY in the final post): ${params.promoLink}

## Structure — one post per role, in order:
${rolesText}

## Length and rhythm
- Each post: 2–4 sentences, roughly 220–280 characters — use the full post space; avoid terse one-liners
- Each post: one main idea, but develop it with enough detail to stand alone
- If a post needs "and" or "but" joining two unrelated ideas, split into two posts (keep total at ${count})
- Do not repeat the same sentence shape in consecutive posts
- At least 3 posts should end on an open loop the next post resolves
- Use prose OR bullets consistently — never alternate formats mid-thread
- Reject any draft post under 180 characters — expand with scene, emotion, or a concrete detail

## Voice
- Product name appears in exactly 2 posts: the reveal (post 7) and the CTA (post 10)
- No feature lists — features belong on the landing page
- Every claim must be concrete; avoid vague words like "improved efficiency"
- At least one post carries emotion (how it felt), not just data
- Banned adjectives: revolutionary, game-changing, powerful, cutting-edge, seamless
- 0–2 emoji for the entire thread, punctuation only
- 0–2 hashtags for the entire thread (zero preferred)
- No post numbering like "1/10"
- No visible framework labels ("Step 1: The Problem")
- Preserve contractions and natural speech — if it reads like a brochure, rewrite

## Links
- Post 1: NO link
- Posts 2–9: NO links
- Post 10: exactly ONE call to action with the promotion URL
- Do NOT invent fake stats, prices, or testimonials — use plausible specifics grounded in context

## Generation order (follow internally)
1. Write the proof number for post 8 first
2. Work backwards to the failure in post 4
3. Write the turning point in post 5 in 1–2 developed sentences
4. Consider 5 hook candidates; select the best for post 1
5. Fill posts 2, 3, 6, 7
6. Write the objection in post 9
7. Write the CTA last

## Rejection — rewrite if ANY are true
- Post 1 requires the rest of the thread to make sense
- No failure or setback in post 4
- Product appears before post 7
- Any post exceeds 5 sentences
- Any post is under 180 characters
- Final post has two or more asks
- No specific number anywhere in the thread
- Thread reads the same whether the product exists or not
- Reading aloud sounds like marketing copy, not a person talking

Banned hook openers: "A thread on...", "Some thoughts on...", "Here's how to grow...", "Let me tell you about...", "Ever wonder..."

Return ONLY this JSON shape:
{
  "posts": [
    { "text": "full ready-to-paste post text", "role": "Hook" }
  ]
}`;
}

function platformLabel(): string {
  return "X (Twitter)";
}
