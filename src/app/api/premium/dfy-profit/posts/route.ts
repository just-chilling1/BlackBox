import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser, getServiceRoleClient } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { buildOfferPageUrl, getServerAppUrl } from "@/lib/app-url";
import { saveFacebookPostBatch } from "@/features/blog-builder/lib/facebook-posts-vault";
import { loadOwnedSite } from "@/features/blog-builder/lib/generation-pipeline";
import { generateFacebookPostsForOffer } from "@/features/publish-kit/lib/generate-facebook-posts";
import { generateThreadImagesForPosts } from "@/features/publish-kit/lib/thread-images";

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
    return NextResponse.json({ error: "siteId is required" }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const site = await loadOwnedSite(supabase, user.id, siteId);
  if (!site) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404, headers: NO_STORE_HEADERS });
  }

  const promoLink = buildOfferPageUrl(getServerAppUrl(request), site.slug, site.owner_handle);

  try {
    const scrapeClient = getServiceRoleClient();
    const generated = await generateFacebookPostsForOffer({
      site,
      promoLink,
      postCount: DFY_FACEBOOK_POST_COUNT,
      // Leave the route enough time to create and persist the two post visuals.
      timeoutMs: 45_000,
      maxRetries: 1,
      scrapeClient,
    });

    const postBodies = generated.slice(0, DFY_FACEBOOK_POST_COUNT);
    const imageResults = await generateThreadImagesForPosts({
      posts: postBodies.map((text, index) => ({
        text,
        angle: index === 0 ? "Hook" : "Product reveal",
      })),
      postIndexes: [0, 1],
      territory: site.territory || site.hobby,
      productName: site.title,
      hobby: site.hobby,
      userId: user.id,
      supabase,
      scrapeUrl: site.armed_links?.[0]?.url,
    });
    const saved = await saveFacebookPostBatch(
      supabase,
      user.id,
      siteId,
      postBodies.map((body, index) => ({
        body,
        imageUrl: index < 2 ? imageResults[index] : null,
      }))
    );

    return NextResponse.json(
      {
        posts: saved.map((p) => ({
          id: p.id,
          body: p.body,
          imageUrl: p.image_url,
          batchId: p.batch_id,
          createdAt: p.created_at,
        })),
        batchId: saved[0]?.batch_id ?? null,
        promoLink,
        count: saved.length,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Generation failed";
    const status = msg.includes("no posts") ? 502 : 500;
    return NextResponse.json({ error: msg }, { status, headers: NO_STORE_HEADERS });
  }
}
