import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser, getServiceRoleClient } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import {
  listRecurringStreamArticles,
  countSeededRecurringArticles,
  seedRecurringStreamArticles,
} from "@/features/premium-recurring/lib/seed-articles";
import { RECURRING_STREAM_TARGET_COUNT } from "@/features/premium-recurring/lib/catalog";
import { saveRecurringArticle } from "@/features/premium-recurring/lib/recurring-articles-vault";
import {
  articleHtmlToAuthorityBody,
  loadRecurringArticlePreview,
} from "@/features/premium-recurring/lib/load-article-preview";
import { listRecurringArticlesForSite } from "@/features/premium-recurring/lib/recurring-articles-vault";
import { buildMoneyPageHtml } from "@/features/money-page/lib/html";
import { isMoneyPageCopy, type MoneyPageCopy } from "@/features/money-page/lib/types";
import { moneyPageThemeFromSite } from "@/features/money-page/lib/generate";
import { getServerAppUrl } from "@/lib/app-url";
import type { BlogSite } from "@/features/blog-builder/types";
import type { ArmedLink } from "@/features/blog-builder/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = featureApiGuard("premium-recurring");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const url = new URL(request.url);
  const niche = url.searchParams.get("niche")?.trim() || "All";
  const previewArticleId = Number(url.searchParams.get("articleId"));
  const previewSiteId = url.searchParams.get("siteId")?.trim() || "";
  const listSaved = url.searchParams.get("saved") === "1";

  try {
    const admin = getServiceRoleClient();
    const reader = admin ?? supabase;
    const origin = getServerAppUrl(request);

    if (listSaved && previewSiteId) {
      const saved = await listRecurringArticlesForSite(supabase, user.id, previewSiteId);
      return NextResponse.json(
        {
          saved: saved.map((row) => ({
            template_id: row.template_id,
            title: row.title,
            html: row.html,
          })),
        },
        { headers: NO_STORE_HEADERS }
      );
    }

    if (previewArticleId && !Number.isNaN(previewArticleId) && previewSiteId) {
      const { data: siteRow } = await supabase
        .from("sites")
        .select("*")
        .eq("id", previewSiteId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!siteRow) {
        return NextResponse.json(
          { error: "Money page not found" },
          { status: 404, headers: NO_STORE_HEADERS }
        );
      }

      const preview = await loadRecurringArticlePreview(
        reader,
        previewArticleId,
        siteRow as BlogSite,
        { origin }
      );
      return NextResponse.json(preview, { headers: NO_STORE_HEADERS });
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

/** Save article + optionally attach a section to the money page. */
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
  const attachToMoneyPage = body.attachToMoneyPage !== false;

  if (!articleId || Number.isNaN(articleId)) {
    return NextResponse.json(
      { error: "articleId is required" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (!siteId) {
    return NextResponse.json(
      { error: "siteId is required" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const { data: siteRow } = await supabase
    .from("sites")
    .select("*")
    .eq("id", siteId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!siteRow) {
    return NextResponse.json(
      { error: "Money page not found" },
      { status: 404, headers: NO_STORE_HEADERS }
    );
  }

  const site = siteRow as BlogSite & {
    product_name?: string | null;
    product_url?: string | null;
  };
  const admin = getServiceRoleClient();
  const reader = admin ?? supabase;
  const origin = getServerAppUrl(request);

  let preview;
  try {
    preview = await loadRecurringArticlePreview(reader, articleId, site, { origin });
  } catch {
    return NextResponse.json({ error: "Article not found" }, { status: 404, headers: NO_STORE_HEADERS });
  }

  const saved = await saveRecurringArticle(
    supabase,
    user.id,
    siteId,
    articleId,
    preview.title,
    preview.html
  );

  let moneyPageUpdated = false;

  if (attachToMoneyPage && isMoneyPageCopy(site.sales_page_json)) {
    const copy = { ...(site.sales_page_json as MoneyPageCopy) };
    const sections = [...(copy.authoritySections ?? [])];
    const existingIdx = sections.findIndex((s) => s.articleId === articleId);
    const section = {
      title: preview.title,
      body: articleHtmlToAuthorityBody(preview.html),
      articleId,
    };
    if (existingIdx >= 0) sections[existingIdx] = section;
    else sections.push(section);
    copy.authoritySections = sections;

    const theme = moneyPageThemeFromSite(site);
    const links = Array.isArray(site.armed_links) ? (site.armed_links as ArmedLink[]) : [];
    const ctaUrl = links[0]?.url || site.product_url || "";
    const html = buildMoneyPageHtml({
      siteId: site.id,
      productName: site.product_name || site.title,
      copy,
      ctaUrl,
      colorTheme: theme.colorTheme,
      variationId: theme.variationId,
    });

    const { error: updateError } = await supabase
      .from("sites")
      .update({
        sales_page_json: copy,
        sales_page_html: html,
        status: site.status === "draft" ? "live" : site.status,
      })
      .eq("id", siteId)
      .eq("user_id", user.id);

    if (!updateError) moneyPageUpdated = true;
  }

  return NextResponse.json(
    {
      id: preview.id,
      title: preview.title,
      html: preview.html,
      excerpt: preview.excerpt,
      metaDescription: preview.metaDescription,
      savedId: saved.id,
      promoLink: preview.promoLink,
      moneyPageUpdated,
      moneyPagePath: `/money-page/${siteId}`,
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
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
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
