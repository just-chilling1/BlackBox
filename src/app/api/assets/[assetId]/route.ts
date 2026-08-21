import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { generateMoneyPageForSite, moneyPageThemeFromSite } from "@/features/money-page/lib/generate";
import { buildMoneyPageHtml } from "@/features/money-page/lib/html";
import { isMoneyPageCopy } from "@/features/money-page/lib/types";
import { inferNiche } from "@/features/money-page/lib/niche";
import { normalizeAffiliateUrl } from "@/features/blog-builder/lib/affiliate-url";
import { detectLinkNetwork } from "@/features/blog-builder/lib/affiliate-url";
import type { ArmedLink } from "@/features/blog-builder/types";
import {
  isMoneyPageColorThemeId,
  withMoneyPageThemeConfig,
} from "@/features/money-page/lib/themes";
import {
  getMoneyPageVariation,
  isMoneyPageVariationId,
} from "@/features/money-page/lib/variations";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function loadSite(
  supabase: Awaited<ReturnType<typeof getApiUser>>["supabase"],
  userId: string,
  assetId: string
) {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("id", assetId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

function ctaFromSite(site: { armed_links?: ArmedLink[]; product_url?: string | null }) {
  const links = Array.isArray(site.armed_links) ? site.armed_links : [];
  return links[0]?.url || site.product_url || "";
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ assetId: string }> }
) {
  const guard = featureApiGuard("money-page");
  if (guard) return guard;
  const { supabase, user } = await getApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { assetId } = await context.params;
  const site = await loadSite(supabase, user.id, assetId);
  if (!site) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  return NextResponse.json({ site, ...moneyPageThemeFromSite(site) });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ assetId: string }> }
) {
  const guard = featureApiGuard("money-page");
  if (guard) return guard;
  const { supabase, user } = await getApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { assetId } = await context.params;
  const site = await loadSite(supabase, user.id, assetId);
  if (!site) return NextResponse.json({ error: "Asset not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const copy = isMoneyPageCopy(body.copy) ? body.copy : isMoneyPageCopy(site.sales_page_json) ? site.sales_page_json : null;
  if (!copy) return NextResponse.json({ error: "Invalid page copy" }, { status: 400 });

  let armedLinks = (site.armed_links ?? []) as ArmedLink[];
  if (typeof body.affiliateUrl === "string" && body.affiliateUrl.trim()) {
    const url = normalizeAffiliateUrl(body.affiliateUrl);
    armedLinks = [{ label: site.product_name || site.title, url, network: detectLinkNetwork(url) }];
  }

  const current = moneyPageThemeFromSite(site);
  const colorTheme = isMoneyPageColorThemeId(body.colorTheme) ? body.colorTheme : current.colorTheme;
  const variationId = isMoneyPageVariationId(body.variationId) ? body.variationId : current.variationId;
  const themeConfig = withMoneyPageThemeConfig(site.theme_config, {
    moneyColorTheme: colorTheme,
    moneyVariation: variationId,
  });

  const variation = getMoneyPageVariation(variationId);
  const allowedCtas = new Set(variation.ctaLabels);
  const pageCopy = allowedCtas.has(copy.ctaLabel)
    ? copy
    : { ...copy, ctaLabel: variation.ctaLabels[0] };

  const ctaUrl = armedLinks[0]?.url || site.product_url || "";
  const html = buildMoneyPageHtml({
    siteId: site.id,
    productName: site.product_name || site.title,
    copy: pageCopy,
    ctaUrl,
    colorTheme,
    variationId,
  });

  const { data, error } = await supabase
    .from("sites")
    .update({
      sales_page_json: pageCopy,
      sales_page_html: html,
      armed_links: armedLinks,
      title: copy.headline.slice(0, 180),
      tagline: copy.subheadline.slice(0, 160),
      theme_config: themeConfig,
    })
    .eq("id", site.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ site: data, colorTheme, variationId });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ assetId: string }> }
) {
  const guard = featureApiGuard("money-page");
  if (guard) return guard;
  const { supabase, user } = await getApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { assetId } = await context.params;
  const site = await loadSite(supabase, user.id, assetId);
  if (!site) return NextResponse.json({ error: "Asset not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const action = typeof body.action === "string" ? body.action : "regenerate";

  if (action === "publish") {
    const { data, error } = await supabase
      .from("sites")
      .update({ status: "live" })
      .eq("id", site.id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ site: data, published: true });
  }

  const ctaUrl = ctaFromSite(site);

  const productName = site.product_name || site.title;
  const current = moneyPageThemeFromSite(site);
  const colorTheme = isMoneyPageColorThemeId(body.colorTheme) ? body.colorTheme : current.colorTheme;
  const explicitVariation = isMoneyPageVariationId(body.variationId) ? body.variationId : null;
  const existingCopy = isMoneyPageCopy(site.sales_page_json) ? site.sales_page_json : null;

  await generateMoneyPageForSite({
    supabase,
    userId: user.id,
    siteId: site.id,
    productName,
    niche: inferNiche(productName, site.hobby || ""),
    ctaUrl,
    colorTheme,
    description: typeof site.tagline === "string" ? site.tagline : undefined,
    heroImage: existingCopy?.heroImage,
    variationId: explicitVariation,
    excludeVariationId: explicitVariation ? null : current.variationId,
    existingThemeConfig: site.theme_config,
  });

  const updated = await loadSite(supabase, user.id, assetId);
  return NextResponse.json({
    site: updated,
    regenerated: true,
    ...moneyPageThemeFromSite(updated ?? site),
  });
}
