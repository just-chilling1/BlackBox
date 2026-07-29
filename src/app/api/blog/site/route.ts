import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { getDailyGenerationQuota } from "@/features/blog-builder/lib/site-quota";
import { countFacebookPostsBySite, listFacebookPostsForSite } from "@/features/blog-builder/lib/facebook-posts-vault";
import { buildOfferPageUrl, getServerAppUrl, resolveOfferPageLinksInText } from "@/lib/app-url";
import { countXThreadsBySite, listXThreadsForSite } from "@/features/publish-kit/lib/x-threads-vault";
import {
  countRecurringArticlesBySite,
  listRecurringArticlesForSite,
} from "@/features/premium-recurring/lib/recurring-articles-vault";
import type { BlogSite } from "@/features/blog-builder/types";

export const dynamic = "force-dynamic";

export interface SiteVaultSummary {
  site: BlogSite;
  postCount: number;
  livePostCount: number;
  clickCount: number;
  facebookPostCount: number;
  xThreadCount: number;
  recurringArticleCount: number;
}

function countBySite(rows: { site_id: string | null }[] | null): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of rows ?? []) {
    if (!row.site_id) continue;
    counts[row.site_id] = (counts[row.site_id] ?? 0) + 1;
  }
  return counts;
}

export async function GET(request: Request) {
  const guard = featureApiGuard("blog-builder");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const siteId = new URL(request.url).searchParams.get("siteId");
  const lite = new URL(request.url).searchParams.get("lite") === "1";
  const quota = await getDailyGenerationQuota(supabase, user.id);

  const { data: sites } = await supabase
    .from("sites")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_template", false)
    .order("created_at", { ascending: false });

  const siteList = (sites ?? []) as BlogSite[];
  const siteIds = siteList.map((s) => s.id);

  if (siteIds.length === 0) {
    return NextResponse.json(
      { summaries: [], site: null, posts: [], clicks: 0, quota, activeSiteId: null },
      { headers: NO_STORE_HEADERS }
    );
  }

  if (lite && !siteId) {
    const [facebookPostCounts, xThreadCounts, recurringArticleCounts] = await Promise.all([
      countFacebookPostsBySite(supabase, user.id, siteIds).catch(() => ({} as Record<string, number>)),
      countXThreadsBySite(supabase, user.id, siteIds).catch(() => ({} as Record<string, number>)),
      countRecurringArticlesBySite(supabase, user.id, siteIds).catch(() => ({} as Record<string, number>)),
    ]);

    const summaries: SiteVaultSummary[] = siteList.map((site) => ({
      site,
      postCount: 0,
      livePostCount: 0,
      clickCount: 0,
      facebookPostCount: facebookPostCounts[site.id] ?? 0,
      xThreadCount: xThreadCounts[site.id] ?? 0,
      recurringArticleCount: recurringArticleCounts[site.id] ?? 0,
    }));

    return NextResponse.json({ summaries, quota }, { headers: NO_STORE_HEADERS });
  }

  const { data: session } = await supabase
    .from("blog_builder_sessions")
    .select("site_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const [{ data: postRows }, { data: clickRows }, facebookPostCounts, xThreadCounts, recurringArticleCounts] =
    await Promise.all([
    supabase.from("posts").select("site_id, status").in("site_id", siteIds),
    supabase.from("affiliate_clicks").select("site_id").in("site_id", siteIds),
    countFacebookPostsBySite(supabase, user.id, siteIds).catch(() => ({} as Record<string, number>)),
    countXThreadsBySite(supabase, user.id, siteIds).catch(() => ({} as Record<string, number>)),
    countRecurringArticlesBySite(supabase, user.id, siteIds).catch(() => ({} as Record<string, number>)),
  ]);

  const postCounts = countBySite(postRows);
  const livePostCounts: Record<string, number> = {};
  for (const row of postRows ?? []) {
    if (!row.site_id || row.status !== "live") continue;
    livePostCounts[row.site_id] = (livePostCounts[row.site_id] ?? 0) + 1;
  }
  const clickCounts = countBySite(clickRows);

  const summaries: SiteVaultSummary[] = siteList.map((site) => ({
    site,
    postCount: postCounts[site.id] ?? 0,
    livePostCount: livePostCounts[site.id] ?? 0,
    clickCount: clickCounts[site.id] ?? 0,
    facebookPostCount: facebookPostCounts[site.id] ?? 0,
    xThreadCount: xThreadCounts[site.id] ?? 0,
    recurringArticleCount: recurringArticleCounts[site.id] ?? 0,
  }));

  if (siteId) {
    const summary = summaries.find((s) => s.site.id === siteId);
    if (!summary) {
      return NextResponse.json({ error: "Site not found" }, { status: 404, headers: NO_STORE_HEADERS });
    }

    const { data: posts } = await supabase
      .from("posts")
      .select("*")
      .eq("site_id", siteId)
      .order("is_pillar", { ascending: false })
      .order("created_at", { ascending: true });

    const facebookPostsRaw = await listFacebookPostsForSite(supabase, user.id, siteId).catch(() => []);
    const offerPageUrl = buildOfferPageUrl(getServerAppUrl(request), summary.site.slug);
    const facebookPosts = facebookPostsRaw.map((post) => ({
      ...post,
      body: resolveOfferPageLinksInText(post.body, offerPageUrl, summary.site.slug),
    }));
    const xThreads = await listXThreadsForSite(supabase, user.id, siteId).catch(() => []);
    const recurringArticles = await listRecurringArticlesForSite(supabase, user.id, siteId).catch(() => []);

    return NextResponse.json(
      {
        summaries,
        site: summary.site,
        posts: posts ?? [],
        facebookPosts,
        xThreads,
        recurringArticles,
        clicks: summary.clickCount,
        quota,
        activeSiteId: session?.site_id ?? null,
      },
      { headers: NO_STORE_HEADERS }
    );
  }

  const latest = summaries[0] ?? null;

  return NextResponse.json(
    {
      summaries,
      site: latest?.site ?? null,
      posts: [],
      clicks: latest?.clickCount ?? 0,
      quota,
      activeSiteId: session?.site_id ?? null,
    },
    { headers: NO_STORE_HEADERS }
  );
}

export async function DELETE(request: Request) {
  const guard = featureApiGuard("blog-builder");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const siteId = new URL(request.url).searchParams.get("siteId")?.trim() ?? "";
  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const { data: site } = await supabase
    .from("sites")
    .select("id, title")
    .eq("id", siteId)
    .eq("user_id", user.id)
    .eq("is_template", false)
    .maybeSingle();

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404, headers: NO_STORE_HEADERS });
  }

  await supabase
    .from("blog_builder_sessions")
    .update({ site_id: null, site_slug: null, deployed: false })
    .eq("user_id", user.id)
    .eq("site_id", siteId);

  await supabase.from("site_facebook_posts").delete().eq("user_id", user.id).eq("site_id", siteId);
  await supabase.from("site_x_threads").delete().eq("user_id", user.id).eq("site_id", siteId);
  await supabase.from("site_x_tags").delete().eq("user_id", user.id).eq("site_id", siteId);
  await supabase.from("site_recurring_articles").delete().eq("user_id", user.id).eq("site_id", siteId);

  const { error } = await supabase.from("sites").delete().eq("id", siteId).eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE_HEADERS });
  }

  return NextResponse.json({ ok: true, deletedSiteId: siteId }, { headers: NO_STORE_HEADERS });
}
