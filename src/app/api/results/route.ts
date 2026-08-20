import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { sitePublicPath } from "@/lib/app-url";

export const dynamic = "force-dynamic";

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

type SiteRow = {
  id: string;
  title: string;
  product_name?: string | null;
  slug: string;
  status: string | null;
  owner_handle?: string | null;
  created_at?: string;
};

async function loadUserSites(
  supabase: Awaited<ReturnType<typeof getApiUser>>["supabase"],
  userId: string
): Promise<{ sites: SiteRow[]; error: string | null }> {
  const full = await supabase
    .from("sites")
    .select("id, title, product_name, slug, status, owner_handle, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!full.error) {
    return { sites: (full.data ?? []) as SiteRow[], error: null };
  }

  if (schemaMissing(full.error)) {
    const withoutHandle = await supabase
      .from("sites")
      .select("id, title, product_name, slug, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!withoutHandle.error) {
      return { sites: (withoutHandle.data ?? []) as SiteRow[], error: null };
    }

    if (schemaMissing(withoutHandle.error)) {
      const minimal = await supabase
        .from("sites")
        .select("id, title, slug, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!minimal.error) {
        return { sites: (minimal.data ?? []) as SiteRow[], error: null };
      }
      return { sites: [], error: minimal.error.message };
    }

    return { sites: [], error: withoutHandle.error.message };
  }

  return { sites: [], error: full.error.message };
}

export async function GET() {
  const guard = featureApiGuard("results");
  if (guard) return guard;
  const { supabase, user } = await getApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sites: siteList, error: sitesError } = await loadUserSites(supabase, user.id);
  if (sitesError) {
    return NextResponse.json({ error: sitesError }, { status: 500 });
  }

  const siteIds = siteList.map((s) => s.id);

  const empty = {
    moneyPagesLive: siteList.filter((s) => s.status === "live").length,
    trafficAssetsCreated: 0,
    visitorsGenerated: 0,
    affiliateClicks: 0,
    assets: [] as unknown[],
    activity: [] as unknown[],
  };

  if (siteIds.length === 0) return NextResponse.json(empty);

  const [{ data: pins, error: pinsError }, { data: visits, error: visitsError }, { data: clicks, error: clicksError }] =
    await Promise.all([
      supabase.from("site_pins").select("id, site_id").eq("user_id", user.id).in("site_id", siteIds),
      supabase
        .from("page_visits")
        .select("id, site_id, source, created_at")
        .in("site_id", siteIds)
        .order("created_at", { ascending: false })
        .limit(40),
      supabase
        .from("affiliate_clicks")
        .select("id, site_id, created_at")
        .in("site_id", siteIds)
        .order("created_at", { ascending: false })
        .limit(40),
    ]);

  const metricsWarning =
    [pinsError, visitsError, clicksError]
      .map((err) => err?.message)
      .filter(Boolean)
      .join(" · ") || null;

  const exact = await Promise.all(
    siteIds.map(async (id) => {
      const [v, c, p] = await Promise.all([
        supabase.from("page_visits").select("*", { count: "exact", head: true }).eq("site_id", id),
        supabase.from("affiliate_clicks").select("*", { count: "exact", head: true }).eq("site_id", id),
        supabase.from("site_pins").select("*", { count: "exact", head: true }).eq("site_id", id),
      ]);
      return { id, visits: v.count ?? 0, clicks: c.count ?? 0, pins: p.count ?? 0 };
    })
  );
  const exactMap = Object.fromEntries(exact.map((row) => [row.id, row]));

  const assets = siteList.map((site) => {
    const stats = exactMap[site.id] ?? { visits: 0, clicks: 0, pins: 0 };
    const ctr = stats.visits > 0 ? (stats.clicks / stats.visits) * 100 : 0;
    const live = site.status === "live";
    return {
      id: site.id,
      product: site.product_name || site.title,
      status: live ? "ACTIVE" : "DRAFT",
      traffic: stats.visits,
      affiliateClicks: stats.clicks,
      pins: stats.pins,
      ctr,
      href: `/money-page/${site.id}`,
      publicPath: site.slug ? sitePublicPath(site) : null,
      viewHref: live && site.slug ? sitePublicPath(site) : `/api/assets/${site.id}/preview`,
    };
  });

  const activity = [
    ...(visits ?? []).map((row) => ({
      at: row.created_at,
      text:
        row.source === "pinterest"
          ? `Pinterest visitor reached ${siteList.find((s) => s.id === row.site_id)?.product_name || siteList.find((s) => s.id === row.site_id)?.title || "your asset"}.`
          : `Visitor reached ${siteList.find((s) => s.id === row.site_id)?.product_name || siteList.find((s) => s.id === row.site_id)?.title || "your asset"}.`,
    })),
    ...(clicks ?? []).map((row) => ({
      at: row.created_at,
      text: `Affiliate link clicked on ${siteList.find((s) => s.id === row.site_id)?.product_name || siteList.find((s) => s.id === row.site_id)?.title || "your asset"}.`,
    })),
  ]
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, 20);

  return NextResponse.json({
    moneyPagesLive: siteList.filter((s) => s.status === "live").length,
    trafficAssetsCreated: exact.reduce((sum, row) => sum + row.pins, 0),
    visitorsGenerated: exact.reduce((sum, row) => sum + row.visits, 0),
    affiliateClicks: exact.reduce((sum, row) => sum + row.clicks, 0),
    assets,
    activity,
    ...(metricsWarning ? { warning: metricsWarning } : {}),
  });
}
