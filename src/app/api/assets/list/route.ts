import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { sitePublicPath } from "@/lib/app-url";
import { getServerAppUrl } from "@/lib/app-url";
import { isFeatureEnabled } from "@/config/features.config";

export const dynamic = "force-dynamic";

export interface LiveAssetSummary {
  id: string;
  title: string;
  productName: string;
  slug: string;
  status: string | null;
  niche: string | null;
  pinCount: number;
  publicUrl: string;
  publicPath: string;
  createdAt: string | null;
}

function schemaMissing(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const code = error.code || "";
  const message = error.message || "";
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    code === "42703" ||
    /schema cache|does not exist|Could not find the/i.test(message)
  );
}

/**
 * List the member's money-page assets for premium pickers.
 * Works without blog-builder (unlike /api/blog/site).
 */
export async function GET(request: Request) {
  const allowed =
    isFeatureEnabled("money-page") ||
    isFeatureEnabled("asset-activator") ||
    isFeatureEnabled("premium-social") ||
    isFeatureEnabled("premium-autopilot") ||
    isFeatureEnabled("premium-recurring") ||
    isFeatureEnabled("results");

  if (!allowed) {
    const guard =
      featureApiGuard("money-page") ||
      featureApiGuard("asset-activator") ||
      featureApiGuard("results");
    if (guard) return guard;
  }

  const { supabase, user } = await getApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const liveOnly = new URL(request.url).searchParams.get("live") !== "0";
  const origin = getServerAppUrl(request);

  let query = supabase
    .from("sites")
    .select("id, title, product_name, slug, status, hobby, territory, owner_handle, created_at")
    .eq("user_id", user.id)
    .eq("is_template", false)
    .order("created_at", { ascending: false });

  if (liveOnly) {
    query = query.eq("status", "live");
  }

  let { data: sites, error } = await query;

  if (error && schemaMissing(error)) {
    const fallback = await supabase
      .from("sites")
      .select("id, title, slug, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    sites = fallback.data as typeof sites;
    error = fallback.error;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const siteList = (sites ?? []) as Array<{
    id: string;
    title: string;
    product_name?: string | null;
    slug: string;
    status: string | null;
    hobby?: string | null;
    territory?: string | null;
    owner_handle?: string | null;
    created_at?: string | null;
  }>;

  const siteIds = siteList.map((s) => s.id);
  const pinCounts: Record<string, number> = {};

  if (siteIds.length > 0) {
    const { data: pins } = await supabase
      .from("site_pins")
      .select("site_id")
      .eq("user_id", user.id)
      .in("site_id", siteIds);

    for (const row of pins ?? []) {
      const id = (row as { site_id: string }).site_id;
      pinCounts[id] = (pinCounts[id] ?? 0) + 1;
    }
  }

  const assets: LiveAssetSummary[] = siteList.map((site) => {
    const publicPath = sitePublicPath(site);
    return {
      id: site.id,
      title: site.title,
      productName: site.product_name || site.title,
      slug: site.slug,
      status: site.status,
      niche: site.hobby || site.territory || null,
      pinCount: pinCounts[site.id] ?? 0,
      publicPath,
      publicUrl: `${origin}${publicPath}`,
      createdAt: site.created_at ?? null,
    };
  });

  return NextResponse.json({ assets });
}
