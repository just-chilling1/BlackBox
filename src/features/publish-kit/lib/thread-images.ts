import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeImageUrl, persistExternalImage, resolveFastImageUrl } from "@/features/blog-builder/lib/images";

const THREAD_STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "with", "your", "you",
  "this", "that", "from", "just", "not", "but", "was", "were", "are", "is", "be", "been",
  "have", "has", "had", "will", "would", "could", "should", "about", "into", "after",
  "before", "when", "what", "how", "why", "who", "here", "there", "then", "than", "them",
  "they", "she", "him", "her", "our", "out", "all", "any", "can", "did", "get", "got",
  "one", "two", "three", "first", "still", "also", "only", "even", "more", "most", "some",
  "same", "over", "under", "link", "thread", "post", "start", "skip", "read", "click",
]);

/** Story-role visuals aligned with the 10-post thread structure. */
const ROLE_VISUAL_HINTS: Record<string, string> = {
  Hook: "bold payoff preview, aspirational outcome, high contrast hero moment",
  Scene: "authentic everyday scene, relatable person in a real place, candid documentary",
  Stakes: "pressure and consequence, deadline tension, what's at risk mood",
  Failure: "frustrated stuck learning curve, failed attempts, messy desk reality",
  "Turning point": "breakthrough clarity moment, lightbulb insight, calm focus",
  Mechanism: "simple repeatable process, checklist workflow, hands doing the steps",
  "Product reveal": "product in use, clean tool on desk, professional software workflow",
  Proof: "measurable results, progress chart, before-after improvement metrics",
  Objection: "thoughtful evaluation, honest skepticism, deciding if it's a fit",
  CTA: "clear next step forward, invitation to act, confident forward motion",
};

/** Stock search phrases that pair well with niche + post keywords. */
const ROLE_STOCK_TERMS: Record<string, string> = {
  Hook: "success achievement goal breakthrough",
  Scene: "person home office kitchen table night",
  Stakes: "stress worry deadline pressure",
  Failure: "frustrated confused stuck overwhelmed",
  "Turning point": "insight clarity focus breakthrough idea",
  Mechanism: "planning checklist notebook workflow process",
  "Product reveal": "laptop software online business tool",
  Proof: "growth chart analytics results dashboard progress",
  Objection: "thinking decision evaluate choice",
  CTA: "starting journey forward path action",
};

const NICHE_VISUAL_HINTS: Record<string, string> = {
  fitness: "fitness workout gym health training",
  finance: "personal finance budget money planning",
  marketing: "digital marketing laptop entrepreneur online business",
  health: "wellness healthy lifestyle nutrition",
  education: "online learning student study laptop",
  relationship: "couple conversation connection together",
  pet: "dog training happy pet owner",
  ai: "artificial intelligence technology computer creator",
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/#\w+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !THREAD_STOP_WORDS.has(word) && !/^\d+$/.test(word));
}

function inferNicheVisualHint(territory: string, productName?: string): string {
  const haystack = `${territory} ${productName ?? ""}`.toLowerCase();
  for (const [key, hint] of Object.entries(NICHE_VISUAL_HINTS)) {
    if (haystack.includes(key)) return hint;
  }
  return tokenize(territory).slice(0, 3).join(" ");
}

function cleanPostText(threadText: string): string {
  return threadText.replace(/https?:\/\/\S+/g, "").replace(/#\w+/g, "").replace(/\s+/g, " ").trim();
}

/** Keywords extracted from the post copy for scrape ranking and stock search. */
export function extractThreadPostKeywords(params: {
  threadText: string;
  territory: string;
  productName?: string;
  role: string;
}): string[] {
  const postTokens = tokenize(cleanPostText(params.threadText));
  const territoryTokens = tokenize(params.territory);
  const roleTokens = tokenize(`${ROLE_STOCK_TERMS[params.role] ?? ""} ${ROLE_VISUAL_HINTS[params.role] ?? ""}`);
  const nicheTokens = tokenize(inferNicheVisualHint(params.territory, params.productName));

  const seen = new Set<string>();
  const keywords: string[] = [];
  for (const word of [...postTokens, ...territoryTokens, ...nicheTokens, ...roleTokens]) {
    if (seen.has(word)) continue;
    seen.add(word);
    keywords.push(word);
    if (keywords.length >= 12) break;
  }
  return keywords;
}

function buildStockQuery(params: {
  threadText: string;
  territory: string;
  role: string;
  productName?: string;
}): string {
  const nicheHint = inferNicheVisualHint(params.territory, params.productName);
  const roleTerms = ROLE_STOCK_TERMS[params.role] ?? "authentic lifestyle scene";
  const postTerms = tokenize(cleanPostText(params.threadText)).slice(0, 4).join(" ");

  return [nicheHint, roleTerms, postTerms].filter(Boolean).join(" ").slice(0, 100);
}

/** Build search metadata for a thread post image. */
export function buildThreadImagePrompt(params: {
  territory: string;
  angle: string;
  threadText: string;
  productName?: string;
  postIndex?: number;
}) {
  const role = params.angle.trim() || "Hook";
  const roleHint = ROLE_VISUAL_HINTS[role] ?? "engaging social media scene";
  const excerpt = cleanPostText(params.threadText).slice(0, 140);
  const keywords = extractThreadPostKeywords({
    threadText: params.threadText,
    territory: params.territory,
    productName: params.productName,
    role,
  });
  const stockQuery = buildStockQuery({
    threadText: params.threadText,
    territory: params.territory,
    role,
    productName: params.productName,
  });

  return {
    role,
    keywords,
    stockQuery,
    title: `${role} — ${excerpt}`.slice(0, 120),
    subject: `${params.territory}. ${roleHint}. Photorealistic, square-friendly composition, no text overlay or logos`,
  };
}

/** Resolve a thread image via topic-aware scrape/stock, then persist to Supabase. */
export async function generateThreadImage(params: {
  territory: string;
  angle: string;
  threadText: string;
  productName?: string;
  postIndex: number;
  userId: string;
  supabase: SupabaseClient;
  scrapeUrl?: string;
  excludeUrls?: string[];
}): Promise<string | null> {
  const prompt = buildThreadImagePrompt(params);

  try {
    const resolved = await resolveFastImageUrl({
      title: prompt.title,
      subject: prompt.subject,
      hobby: params.territory,
      scrapeUrl: params.scrapeUrl,
      scrapeKeywords: prompt.keywords,
      pickOffset: params.postIndex,
      seedBoost: params.postIndex * 3 + prompt.keywords.length,
      excludeUrls: params.excludeUrls,
      customQuery: prompt.stockQuery,
      orientation: "all",
      preferSquare: true,
    });

    if (!resolved.url) return null;

    const persisted = await persistExternalImage({
      url: resolved.url,
      userId: params.userId,
      supabase: params.supabase,
    });
    return persisted ?? resolved.url;
  } catch {
    return null;
  }
}

/** Generate images for multiple thread posts — each unique and post-specific. */
export async function generateThreadImagesForPosts(params: {
  posts: { text: string; angle: string }[];
  postIndexes: readonly number[];
  territory: string;
  productName?: string;
  userId: string;
  supabase: SupabaseClient;
  scrapeUrl?: string;
}): Promise<(string | null)[]> {
  const usedUrls: string[] = [];
  const results: (string | null)[] = [];

  for (const postIndex of params.postIndexes) {
    const post = params.posts[postIndex];
    if (!post) {
      results.push(null);
      continue;
    }

    const imageUrl = await generateThreadImage({
      territory: params.territory,
      angle: post.angle,
      threadText: post.text,
      productName: params.productName,
      postIndex,
      userId: params.userId,
      supabase: params.supabase,
      scrapeUrl: params.scrapeUrl,
      excludeUrls: usedUrls,
    });

    if (imageUrl) {
      usedUrls.push(imageUrl);
      usedUrls.push(normalizeImageUrl(imageUrl));
    }
    results.push(imageUrl);
  }

  return results;
}
