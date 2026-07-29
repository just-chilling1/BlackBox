import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser, getServiceRoleClient } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import {
  listRecurringStreamArticles,
  countSeededRecurringArticles,
  seedRecurringStreamArticles,
  recurringStreamNeedsSeed,
} from "@/features/premium-recurring/lib/seed-articles";
import { RECURRING_STREAM_TARGET_COUNT, weaveAffiliateIntoArticle } from "@/features/premium-recurring/lib/catalog";
import { saveRecurringArticle } from "@/features/premium-recurring/lib/recurring-articles-vault";
import type { BlogSite } from "@/features/blog-builder/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = featureApiGuard("premium-recurring");
  if (guard) return guard;

  const { supabase } = await getApiUser();
  const niche = new URL(request.url).searchParams.get("niche")?.trim() || "All";

  try {
    const admin = getServiceRoleClient();
    const reader = admin ?? supabase;

    if (admin && (await recurringStreamNeedsSeed(admin))) {
      await seedRecurringStreamArticles(admin);
    }

    const articles = await listRecurringStreamArticles(reader, niche);
    const seededCount = admin ? await countSeededRecurringArticles(admin) : articles.length;

    return NextResponse.json(
      {
        articles: articles.map((a) => ({
          id: a.id,
          niche: a.niche,
          title: a.title,
          excerpt: a.excerpt,
          angle: a.angle,
        })),
        total: RECURRING_STREAM_TARGET_COUNT,
        seededCount,
        ready: seededCount >= RECURRING_STREAM_TARGET_COUNT,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load articles";
    return NextResponse.json({ error: msg }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

/** Return full article HTML with offer affiliate link woven in; saves to the offer. */
export async function POST(request: Request) {
  const guard = featureApiGuard("premium-recurring");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const body = await request.json().catch(() => ({}));
  const articleId = typeof body.articleId === "number" ? body.articleId : Number(body.articleId);
  const siteId = typeof body.siteId === "string" ? body.siteId.trim() : "";

  if (!articleId || Number.isNaN(articleId)) {
    return NextResponse.json({ error: "articleId is required" }, { status: 400, headers: NO_STORE_HEADERS });
  }

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
  const affiliateUrl = site.armed_links?.[0]?.url?.trim() ?? "";

  const admin = getServiceRoleClient();
  const reader = admin ?? supabase;
  const { data, error } = await reader
    .from("premium_article_templates")
    .select("*")
    .eq("id", articleId)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Article not found" }, { status: 404, headers: NO_STORE_HEADERS });
  }

  const html = weaveAffiliateIntoArticle((data as { html: string }).html, affiliateUrl);

  const saved = await saveRecurringArticle(
    supabase,
    user.id,
    siteId,
    articleId,
    (data as { title: string }).title,
    html
  );

  return NextResponse.json(
    {
      id: data.id,
      title: data.title,
      html,
      excerpt: data.excerpt,
      metaDescription: data.meta_description,
      savedId: saved.id,
      promoLink: affiliateUrl || null,
    },
    { headers: NO_STORE_HEADERS }
  );
}

/** Admin one-time seed — requires RECURRING_SEED_SECRET header. */
export async function PUT(request: Request) {
  const secret = process.env.RECURRING_SEED_SECRET?.trim();
  const header = request.headers.get("x-recurring-seed-secret")?.trim();

  if (!secret || header !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE_HEADERS });
  }

  const admin = getServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500, headers: NO_STORE_HEADERS });
  }

  try {
    const force =
      new URL(request.url).searchParams.get("force") === "1" ||
      request.headers.get("x-recurring-force-reseed") === "1";
    const result = await seedRecurringStreamArticles(admin, { force });
    return NextResponse.json(result, { headers: NO_STORE_HEADERS });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Seed failed";
    return NextResponse.json({ error: msg }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
