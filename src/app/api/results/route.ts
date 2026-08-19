import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { sitePublicPath } from "@/lib/app-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = featureApiGuard("results");
  if (guard) return guard;
  const { supabase, user } = await getApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: sites } = await supabase
    .from("sites")
    .select("id, title, product_name, slug, status, owner_handle, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const siteList = sites ?? [];
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

  const [{ data: pins }, { data: visits }, { data: clicks }] = await Promise.all([
    supabase.from("site_pins").select("id, site_id").eq("user_id", user.id).in("site_id", siteIds),
    supabase.from("page_visits").select("id, site_id, source, created_at").in("site_id", siteIds).order("created_at", { ascending: false }).limit(40),
    supabase.from("affiliate_clicks").select("id, site_id, created_at").in("site_id", siteIds).order("created_at", { ascending: false }).limit(40),
  ]);

  const pinCountBySite: Record<string, number> = {};
  for (const pin of pins ?? []) {
    pinCountBySite[pin.site_id] = (pinCountBySite[pin.site_id] ?? 0) + 1;
  }
  const visitCountBySite: Record<string, number> = {};
  for (const visit of visits ?? []) {
    visitCountBySite[visit.site_id] = (visitCountBySite[visit.site_id] ?? 0) + 1;
  }
  const clickCountBySite: Record<string, number> = {};
  for (const click of clicks ?? []) {
    clickCountBySite[click.site_id] = (clickCountBySite[click.site_id] ?? 0) + 1;
  }

  // Counts above are truncated by limit. Fetch exact counts per site in parallel.
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
    return {
      id: site.id,
      product: site.product_name || site.title,
      status: site.status === "live" ? "ACTIVE" : "DRAFT",
      traffic: stats.visits,
      affiliateClicks: stats.clicks,
      pins: stats.pins,
      ctr,
      href: `/money-page/${site.id}`,
      publicPath: site.status === "live" ? sitePublicPath(site) : null,
    };
  });

  const activity = [
    ...(visits ?? []).map((row) => ({
      at: row.created_at,
      text: row.source === "pinterest"
        ? `Pinterest visitor reached ${siteList.find((s) => s.id === row.site_id)?.product_name || "your asset"}.`
        : `Visitor reached ${siteList.find((s) => s.id === row.site_id)?.product_name || "your asset"}.`,
    })),
    ...(clicks ?? []).map((row) => ({
      at: row.created_at,
      text: `Affiliate link clicked on ${siteList.find((s) => s.id === row.site_id)?.product_name || "your asset"}.`,
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
  });
}
