import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { generateWithGPT, extractJsonFromText } from "@/features/blog-builder/lib/ai";
import { getSiteTerritory } from "@/features/blog-builder/lib/site-territory";
import { saveFacebookPostBatch, listFacebookPostsForSite } from "@/features/blog-builder/lib/facebook-posts-vault";
import type { BlogSite } from "@/features/blog-builder/types";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const POST_COUNT = 10;

/** Social Payouts (10x): bulk-generate Facebook post variants from a member's offer/site. */
export async function POST(request: Request) {
  const guard = featureApiGuard("premium-social");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const body = await request.json().catch(() => ({}));
  const siteId = typeof body.siteId === "string" ? body.siteId.trim() : "";

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
    return NextResponse.json({ error: "Offer not found" }, { status: 404, headers: NO_STORE_HEADERS });
  }

  const site = siteRow as BlogSite;
  const territory = getSiteTerritory(site);
  const promoLink = site.armed_links?.[0]?.url?.trim() || "[LINK]";

  const contextParts = [
    `Niche: ${territory}`,
    site.title ? `Offer title: ${site.title}` : "",
    site.tagline ? `Tagline: ${site.tagline}` : "",
    site.sales_page_json ? `Sales copy summary available` : "",
  ].filter(Boolean);

  const system = `You are a direct-response social media copywriter for affiliate marketers.
Write scroll-stopping Facebook posts that get clicks without sounding spammy.
Return ONLY JSON: { "posts": ["...", ...] }`;

  const userPrompt = [
    `Write ${POST_COUNT} distinct Facebook post variants promoting this offer.`,
    contextParts.join("\n"),
    "",
    "Rules for each post:",
    "- 1-3 sentences, conversational (personal story or helpful tip angle)",
    "- Light emoji OK; no hashtags",
    "- Each post MUST end with the exact placeholder [LINK]",
    "- Vary hooks so all 10 feel different",
    "- Do not invent fake stats or brand names",
    "",
    `Return ONLY JSON: { "posts": [ ${POST_COUNT} strings ] }`,
  ].join("\n");

  try {
    const raw = await generateWithGPT(system, userPrompt, { temperature: 0.85, maxRetries: 3 });
    const parsed = extractJsonFromText(raw) as { posts?: unknown } | null;

    let generated = Array.isArray(parsed?.posts)
      ? (parsed!.posts as unknown[]).filter((p): p is string => typeof p === "string" && p.trim().length > 0)
      : [];

    generated = generated
      .map((p) => (p.includes("[LINK]") ? p : `${p.trim()} [LINK]`))
      .slice(0, POST_COUNT);

    if (generated.length === 0) {
      return NextResponse.json({ error: "Generator returned no posts. Try again." }, { status: 502, headers: NO_STORE_HEADERS });
    }

    const withLink = generated.map((p) => p.replace(/\[LINK\]/g, promoLink));
    const saved = await saveFacebookPostBatch(supabase, user.id, siteId, withLink);

    return NextResponse.json(
      {
        posts: saved.map((p) => ({ id: p.id, body: p.body })),
        promoLink,
        count: saved.length,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: msg }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function GET(request: Request) {
  const guard = featureApiGuard("premium-social");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const siteId = new URL(request.url).searchParams.get("siteId")?.trim() || "";
  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const posts = await listFacebookPostsForSite(supabase, user.id, siteId);

  return NextResponse.json(
    { posts: posts.map((p) => ({ id: p.id, body: p.body })) },
    { headers: NO_STORE_HEADERS }
  );
}
