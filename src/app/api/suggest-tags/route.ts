import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { generateWithGPT, extractJsonFromText } from "@/features/blog-builder/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const PLATFORM_FORMATS: Record<string, string> = {
  linkedin:
    "LinkedIn hashtags (e.g. #DigitalMarketing). Suggest 5-8 hashtags. Mix 2-3 broad/popular hashtags with 3-5 niche-specific ones.",
  quora:
    'Quora topics/spaces the answer should be added to (e.g. "Digital Marketing", "Affiliate Marketing Tips"). Suggest 5-8 relevant Quora topics.',
  medium:
    'Medium tags (e.g. "Marketing", "Side Hustle"). Medium allows up to 5 tags. Suggest exactly 5 tags, ordered by popularity.',
  reddit:
    'Relevant subreddits to post in (e.g. "r/Entrepreneur", "r/SEO") and post flair keywords. Suggest 3-5 subreddits and 2-3 flair keywords.',
  twitter:
    "X/Twitter hashtags (e.g. #MarketingTips). Suggest 3-5 hashtags only — over-hashtagging hurts reach on X.",
  facebook:
    "Facebook post topics and interest groups. Suggest 5-8 relevant audience interests or group themes (no hashtags).",
};

export async function POST(request: Request) {
  const guard = featureApiGuard("article-publish");
  if (guard) return guard;

  const { user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const { platform, articleTitle, articleContent, niche } = await request.json();

  if (!platform || !articleTitle) {
    return NextResponse.json(
      { error: "Platform and title are required" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const contentSnippet =
    typeof articleContent === "string" ? articleContent.replace(/<[^>]+>/g, " ").slice(0, 500) : "";

  const userPrompt = `You are a social media growth expert. Based on the following product/website, suggest the best ${PLATFORM_FORMATS[platform] || "tags/hashtags"}

Title: ${articleTitle}
${niche ? `Niche: ${niche}` : ""}
${contentSnippet ? `Context: ${contentSnippet}` : ""}

Requirements:
- Tags should maximize discoverability and reach on ${platform}
- Include a mix of high-volume and niche-specific tags
- Order by relevance (most important first)
- For each tag, add a brief reason why it's effective (one short sentence)

Respond ONLY with valid JSON in this exact format:
{"tags": [{"tag": "the tag or hashtag", "reason": "why this tag works"}]}`;

  try {
    const raw = await generateWithGPT(
      "Reply with JSON only. No markdown fences.",
      userPrompt,
      { temperature: 0.5, maxRetries: 3 }
    );

    let tags: { tag: string; reason: string }[] = [];
    const parsed = extractJsonFromText(raw) as { tags?: { tag: string; reason: string }[] } | null;
    if (parsed?.tags && Array.isArray(parsed.tags)) {
      tags = parsed.tags;
    }

    return NextResponse.json({ tags, platform }, { headers: NO_STORE_HEADERS });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to suggest tags";
    return NextResponse.json({ error: msg }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
