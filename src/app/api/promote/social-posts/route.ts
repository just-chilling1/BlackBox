import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser, getServiceRoleClient } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { generateWithGPT, extractJsonFromText } from "@/features/blog-builder/lib/ai";
import { scrapePageWithCache } from "@/features/blog-builder/lib/scrape-cache";
import { buildSitePromoteContext } from "@/features/publish-kit/lib/site-context";
import type { BlogSite } from "@/features/blog-builder/types";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const POST_COUNT = 10;

type PromotePlatform = "linkedin" | "twitter";

interface SocialPostRow {
  text: string;
  angle?: string;
}

const POST_ANGLES = [
  "Urgency",
  "Social proof",
  "Personal story",
  "Curiosity hook",
  "Pain point",
  "Key benefit",
  "Contrarian take",
  "Question opener",
  "Quick tip",
  "Honest recommendation",
];

function platformInstructions(platform: PromotePlatform): string {
  if (platform === "linkedin") {
    return `Write exactly ${POST_COUNT} LinkedIn posts:
- Professional but personable; use short paragraphs with line breaks
- Story, insight, or lesson angle — not a hard sales pitch
- End with the promotion URL on its own line
- Include 3-5 relevant hashtags at the very end
- Each post must use a different hook/angle
- Ready to copy and paste as-is`;
  }

  return `Write exactly ${POST_COUNT} X (Twitter) posts:
- Max 280 characters each INCLUDING the URL and any hashtags
- Punchy, scroll-stopping, conversational
- 0-2 hashtags max per post
- Each post must use a different angle
- Do NOT invent fake stats, prices, or testimonials
- Ready to copy and paste as-is`;
}

export async function POST(request: Request) {
  const guard = featureApiGuard("article-publish");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const body = await request.json().catch(() => ({}));
  const siteId = typeof body.siteId === "string" ? body.siteId.trim() : "";
  const siteUrlInput = typeof body.siteUrl === "string" ? body.siteUrl.trim() : "";
  const platform = body.platform === "twitter" ? "twitter" : body.platform === "linkedin" ? "linkedin" : null;

  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400, headers: NO_STORE_HEADERS });
  }

  if (!platform) {
    return NextResponse.json({ error: "platform must be linkedin or twitter" }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const { data: siteRow } = await supabase
    .from("sites")
    .select("*")
    .eq("id", siteId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!siteRow) {
    return NextResponse.json({ error: "Site not found" }, { status: 404, headers: NO_STORE_HEADERS });
  }

  const site = siteRow as BlogSite;
  const affiliateUrl = site.armed_links?.[0]?.url?.trim() || "";
  let scrapedProductContext = "";

  if (affiliateUrl) {
    try {
      const admin = getServiceRoleClient();
      const { context } = await scrapePageWithCache(affiliateUrl, admin);
      scrapedProductContext = context || "";
    } catch {
      /* continue without scrape */
    }
  }

  const siteUrl = siteUrlInput || "";
  const context = buildSitePromoteContext({ site, siteUrl, scrapedProductContext });
  const promoLink = context.affiliateLink || siteUrl;

  if (!promoLink) {
    return NextResponse.json(
      { error: "Add an affiliate link or publish your site before generating posts." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const platformLabel = platform === "linkedin" ? "LinkedIn" : "X (Twitter)";
  const anglesText = POST_ANGLES.map((a, i) => `${i + 1}. ${a}`).join("\n");

  const system = `You are an expert ${platformLabel} copywriter for affiliate marketers.
Analyze the product and website context internally, then write platform-native posts that drive clicks without sounding spammy.
Return ONLY valid JSON — no markdown fences.`;

  const userPrompt = `Using this product + website context, write ${POST_COUNT} ${platformLabel} posts.

${context.fullContext}

Promotion URL to include in every post: ${promoLink}

${platformInstructions(platform)}

Use these ${POST_COUNT} distinct angles (one per post):
${anglesText}

Return ONLY this JSON shape:
{
  "posts": [
    { "text": "full ready-to-paste post", "angle": "short label" }
  ]
}`;

  try {
    const raw = await generateWithGPT(system, userPrompt, {
      temperature: 0.82,
      maxRetries: 4,
      timeoutMs: 120_000,
    });

    const parsed = extractJsonFromText(raw) as { posts?: SocialPostRow[] } | null;

    const posts = (Array.isArray(parsed?.posts) ? parsed!.posts : [])
      .filter((row) => row && typeof row.text === "string" && row.text.trim().length > 0)
      .slice(0, POST_COUNT)
      .map((row, i) => ({
        text: row.text.trim(),
        angle: typeof row.angle === "string" ? row.angle : POST_ANGLES[i] || `Post ${i + 1}`,
      }));

    if (posts.length === 0) {
      return NextResponse.json(
        { error: "The generator returned no posts. Please try again." },
        { status: 502, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        platform,
        posts,
        promoLink,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to generate social posts";
    return NextResponse.json({ error: msg }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
