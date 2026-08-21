import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser, getServiceRoleClient } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { buildOfferPageUrl, getServerAppUrl, sitePublicPath } from "@/lib/app-url";
import { getOrCreateUserHandle } from "@/lib/user-handle";
import {
  detectLinkNetwork,
  isValidAffiliateUrl,
  normalizeAffiliateUrl,
} from "@/features/blog-builder/lib/affiliate-url";
import { generateProductSite } from "@/features/blog-builder/lib/product-generation";
import { scrapePageWithCache } from "@/features/blog-builder/lib/scrape-cache";
import { getDailyGenerationQuota } from "@/features/blog-builder/lib/site-quota";
import { slugify } from "@/features/blog-builder/lib/seo";
import {
  buildSiteTagline,
  buildSiteTitle,
  themeFromConfig,
} from "@/features/blog-builder/themes";
import { PREMIUM_NICHE_OPTIONS } from "@/lib/premium-niches";
import type { ArmedLink } from "@/features/blog-builder/types";
import { pickRandomTemplate } from "@/features/dfy-profit/lib/pick-random-template";

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
  const rawUrl = typeof body.affiliateUrl === "string" ? body.affiliateUrl : "";
  const nicheValue = typeof body.niche === "string" ? body.niche.trim() : "";
  const excludeTemplateId =
    typeof body.excludeTemplateId === "string" ? body.excludeTemplateId.trim() : undefined;

  const affiliateUrl = normalizeAffiliateUrl(rawUrl);
  if (!isValidAffiliateUrl(affiliateUrl)) {
    return NextResponse.json(
      { error: "A valid affiliate URL is required" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const nicheOption = PREMIUM_NICHE_OPTIONS.find((n) => n.value === nicheValue);
  if (!nicheOption) {
    return NextResponse.json(
      { error: "Select a valid niche" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const quota = await getDailyGenerationQuota(supabase, user.id);
  if (!quota.unlimited && (quota.remaining ?? 0) <= 0) {
    return NextResponse.json(
      {
        error: `Daily limit reached (${quota.limit} new websites per day). Try again tomorrow.`,
        quota,
      },
      { status: 429, headers: NO_STORE_HEADERS }
    );
  }

  const nicheLabel = nicheOption.label;
  const { template, themeConfig } = pickRandomTemplate(excludeTemplateId);
  const armedLinks: ArmedLink[] = [
    {
      label: "Promotional Offer",
      url: affiliateUrl,
      network: detectLinkNetwork(affiliateUrl),
    },
  ];

  const scrapeClient = getServiceRoleClient();
  let productContext = "";
  let scrapedTitle: string | undefined;
  let scrapedDescription: string | undefined;
  let scrapedH1: string | undefined;
  let scrapedBrand: string | undefined;

  try {
    const scraped = await scrapePageWithCache(affiliateUrl, scrapeClient);
    productContext = scraped.context;
    scrapedTitle = scraped.data?.title;
    scrapedDescription = scraped.data?.description;
    scrapedH1 = scraped.data?.h1;
    scrapedBrand = scraped.data?.brand;
  } catch {
    /* continue without scrape context */
  }

  const title = buildSiteTitle(nicheLabel);
  const theme = themeFromConfig(themeConfig);
  const baseSlug = slugify(title) || slugify(nicheLabel) || "offer";
  const { data: existingRows } = await supabase
    .from("sites")
    .select("slug")
    .eq("user_id", user.id)
    .like("slug", `${baseSlug}%`);
  const taken = new Set((existingRows ?? []).map((row) => row.slug as string));
  let slug = baseSlug;
  for (let n = 2; taken.has(slug); n++) {
    slug = `${baseSlug}-${n}`;
  }

  const ownerHandle = await getOrCreateUserHandle(supabase, user);

  const baseRow = {
    user_id: user.id,
    hobby: nicheLabel,
    territory: nicheLabel,
    title,
    tagline: buildSiteTagline(nicheLabel),
    theme,
    theme_config: themeConfig,
    armed_links: armedLinks,
    status: "live" as const,
    site_type: "product",
    is_template: false,
  };

  const attempts: Record<string, unknown>[] = [
    { ...baseRow, slug, owner_handle: ownerHandle },
    { ...baseRow, slug },
    { ...baseRow, slug: `${baseSlug}-${crypto.randomUUID().slice(0, 8)}` },
  ];

  let siteData: Record<string, unknown> | null = null;
  let siteError: { code?: string; message: string } | null = null;
  for (const row of attempts) {
    ({ data: siteData, error: siteError } = await supabase
      .from("sites")
      .insert(row)
      .select()
      .single());
    if (!siteError) break;
    if (siteError.code !== "42703" && siteError.code !== "23505") break;
  }

  if (siteError || !siteData) {
    return NextResponse.json(
      { error: siteError?.message ?? "Failed to create site" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }

  const siteId = siteData.id as string;
  const siteSlug = siteData.slug as string;

  try {
    const result = await generateProductSite({
      supabase,
      userId: user.id,
      siteId,
      niche: nicheLabel,
      armedLinks,
      themeConfig,
      productContext,
      scrapedTitle,
      scrapedDescription,
      scrapedH1,
      scrapedBrand,
    });

    await supabase
      .from("sites")
      .update({
        product_url: affiliateUrl,
        status: "live",
        asset_source: "one-click",
      })
      .eq("id", siteId)
      .eq("user_id", user.id);

    const resolvedHandle =
      (result.site.owner_handle as string | null | undefined) ?? ownerHandle;
    const offerPath = sitePublicPath({
      slug: siteSlug,
      owner_handle: resolvedHandle,
    });
    const offerUrl = buildOfferPageUrl(getServerAppUrl(request), siteSlug, resolvedHandle);

    return NextResponse.json(
      {
        siteId,
        slug: siteSlug,
        offerPath,
        offerUrl,
        templateId: template.id,
        templateName: template.name,
        productName: result.productName,
        productContext,
        niche: nicheLabel,
        nicheValue: nicheOption.value,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sales page generation failed";
    return NextResponse.json({ error: message, siteId, slug: siteSlug }, {
      status: 500,
      headers: NO_STORE_HEADERS,
    });
  }
}
