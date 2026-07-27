import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser, getServiceRoleClient } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { generateWithGPT, extractJsonFromText } from "@/features/blog-builder/lib/ai";
import { scrapePageWithCache } from "@/features/blog-builder/lib/scrape-cache";
import { buildSitePromoteContext } from "@/features/publish-kit/lib/site-context";
import {
  getThreadGenerationQuota,
  recordThreadGeneration,
  THREAD_GENERATION_DAILY_LIMIT,
} from "@/features/publish-kit/lib/thread-generation-quota";
import {
  THREADS_PER_GENERATION,
  THREAD_POST_ANGLES,
  THREADS_WITH_IMAGES,
} from "@/features/publish-kit/lib/promote-constants";
import {
  listXThreadsForSite,
  saveXThreadBatch,
} from "@/features/publish-kit/lib/x-threads-vault";
import { listXTagsForSite } from "@/features/publish-kit/lib/x-tags-vault";
import { generateThreadImage } from "@/features/publish-kit/lib/thread-images";
import type { BlogSite } from "@/features/blog-builder/types";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

interface SocialPostRow {
  text: string;
  angle?: string;
  imageUrl?: string;
}

function platformInstructions(): string {
  return `Write exactly ${THREADS_PER_GENERATION} X (Twitter) posts:
- Max 280 characters each INCLUDING the URL and any hashtags
- Punchy, scroll-stopping, conversational
- 0-2 hashtags max per post
- Each post must use a different angle
- Do NOT invent fake stats, prices, or testimonials
- Ready to copy and paste as-is`;
}

export async function GET(request: Request) {
  const guard = featureApiGuard("article-publish");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const siteId = new URL(request.url).searchParams.get("siteId")?.trim() || "";
  const quota = await getThreadGenerationQuota(supabase, user.id);

  if (siteId) {
    const [threads, tagRows] = await Promise.all([
      listXThreadsForSite(supabase, user.id, siteId),
      listXTagsForSite(supabase, user.id, siteId),
    ]);
    const tags = tagRows.map((row) => ({ tag: row.tag, reason: row.reason || "" }));
    return NextResponse.json({ quota, threads, tags }, { headers: NO_STORE_HEADERS });
  }

  return NextResponse.json({ quota }, { headers: NO_STORE_HEADERS });
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
  const platform = "twitter" as const;

  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400, headers: NO_STORE_HEADERS });
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

  const quota = await getThreadGenerationQuota(supabase, user.id);
  if (quota.remaining <= 0) {
    return NextResponse.json(
      {
        error: `Daily limit reached (${THREAD_GENERATION_DAILY_LIMIT} generations per day). Try again tomorrow.`,
        quota,
      },
      { status: 429, headers: NO_STORE_HEADERS }
    );
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
      { error: "Add an affiliate link or publish your site before generating threads." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const platformLabel = "X (Twitter)";
  const anglesText = THREAD_POST_ANGLES.map((a, i) => `${i + 1}. ${a}`).join("\n");

  const system = `You are an expert ${platformLabel} copywriter for affiliate marketers.
Analyze the product and website context internally, then write platform-native posts that drive clicks without sounding spammy.
Return ONLY valid JSON — no markdown fences.`;

  const userPrompt = `Using this product + website context, write ${THREADS_PER_GENERATION} ${platformLabel} posts.

${context.fullContext}

Promotion URL to include in every post: ${promoLink}

${platformInstructions()}

Use these ${THREADS_PER_GENERATION} distinct angles (one per post):
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
      .slice(0, THREADS_PER_GENERATION)
      .map((row, i) => ({
        text: row.text.trim(),
        angle: typeof row.angle === "string" ? row.angle : THREAD_POST_ANGLES[i] || `Thread ${i + 1}`,
      }));

    if (posts.length === 0) {
      return NextResponse.json(
        { error: "The generator returned no threads. Please try again." },
        { status: 502, headers: NO_STORE_HEADERS }
      );
    }

    const territory = context.territory;
    const threadsForImages = posts.slice(0, THREADS_WITH_IMAGES);
    const imageResults = await Promise.all(
      threadsForImages.map((post) =>
        generateThreadImage({
          territory,
          angle: post.angle,
          threadText: post.text,
          userId: user.id,
          supabase,
        })
      )
    );

    const postsWithImages = posts.map((post, i) => ({
      ...post,
      imageUrl: i < THREADS_WITH_IMAGES ? imageResults[i] || undefined : undefined,
    }));

    await recordThreadGeneration(supabase, user.id, siteId);
    await saveXThreadBatch(supabase, user.id, siteId, postsWithImages);
    const quotaAfter = await getThreadGenerationQuota(supabase, user.id);

    return NextResponse.json(
      {
        platform,
        posts: postsWithImages,
        promoLink,
        quota: quotaAfter,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to generate X threads";
    return NextResponse.json({ error: msg }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
