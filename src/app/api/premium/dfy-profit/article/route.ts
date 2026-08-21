import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser, getServiceRoleClient } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { scrapePageWithCache } from "@/features/blog-builder/lib/scrape-cache";
import { generateAuthorityArticleForSite } from "@/features/dfy-profit/lib/generate-authority-article";
import { loadOwnedDfySite } from "@/features/dfy-profit/lib/load-owned-site";
import { saveGeneratedAuthorityArticle } from "@/features/premium-recurring/lib/recurring-articles-vault";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  const guard = featureApiGuard("premium-dfy-profit");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const body = await request.json().catch(() => ({}));
  const siteId = typeof body.siteId === "string" ? body.siteId.trim() : "";
  if (!siteId) {
    return NextResponse.json(
      { error: "siteId is required" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const site = await loadOwnedDfySite(supabase, user.id, siteId);
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404, headers: NO_STORE_HEADERS });
  }

  const affiliateUrl = site.product_url?.trim() || site.armed_links?.[0]?.url?.trim() || "";
  let productContext = "";
  if (affiliateUrl) {
    try {
      const scraped = await scrapePageWithCache(affiliateUrl, getServiceRoleClient());
      productContext = scraped.context || "";
    } catch {
      /* continue without scrape */
    }
  }

  try {
    const article = await generateAuthorityArticleForSite({
      site,
      productName: site.product_name?.trim() || site.title,
      nicheLabel: site.hobby || site.territory || "",
      productContext,
    });

    const saved = await saveGeneratedAuthorityArticle(
      supabase,
      user.id,
      siteId,
      article.title,
      article.html
    );

    return NextResponse.json(
      {
        id: saved.id,
        title: saved.title,
        excerpt: article.excerpt,
        html: saved.html,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Authority article generation failed";
    return NextResponse.json({ error: message }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
