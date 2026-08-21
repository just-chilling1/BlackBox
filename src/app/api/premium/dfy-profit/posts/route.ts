import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser, getServiceRoleClient } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { buildOfferPageUrl, getServerAppUrl } from "@/lib/app-url";
import { saveFacebookPostBatch } from "@/features/blog-builder/lib/facebook-posts-vault";
import { loadOwnedDfySite } from "@/features/dfy-profit/lib/load-owned-site";
import { generateFacebookPostsForOffer } from "@/features/publish-kit/lib/generate-facebook-posts";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const DFY_FACEBOOK_POST_COUNT = 3;

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

  const promoLink = buildOfferPageUrl(
    getServerAppUrl(request),
    site.slug,
    site.owner_handle
  );

  try {
    const generated = await generateFacebookPostsForOffer({
      site,
      promoLink,
      postCount: DFY_FACEBOOK_POST_COUNT,
      scrapeClient: getServiceRoleClient(),
    });

    const saved = await saveFacebookPostBatch(supabase, user.id, siteId, generated);

    return NextResponse.json(
      {
        posts: saved,
        slug: site.slug,
        batchCount: saved.length,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Facebook post generation failed";
    const status = message.includes("no posts") ? 502 : 500;
    return NextResponse.json({ error: message }, { status, headers: NO_STORE_HEADERS });
  }
}
