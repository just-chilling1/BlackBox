import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { buildOfferPageUrl, getServerAppUrl, sitePublicPath } from "@/lib/app-url";
import { loadOwnedSite } from "@/features/blog-builder/lib/generation-pipeline";
import { generateAuthorityArticleForSite } from "@/features/dfy-profit/lib/generate-authority-article";

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
  const productContext = typeof body.productContext === "string" ? body.productContext : "";
  const productNameInput = typeof body.productName === "string" ? body.productName.trim() : "";
  const nicheInput = typeof body.niche === "string" ? body.niche.trim() : "";

  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const site = await loadOwnedSite(supabase, user.id, siteId);
  if (!site) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404, headers: NO_STORE_HEADERS });
  }

  const productName = productNameInput || site.title || site.territory || site.hobby;
  const nicheLabel = nicheInput || site.hobby || site.territory || productName;

  try {
    const result = await generateAuthorityArticleForSite({
      supabase,
      userId: user.id,
      site,
      productName,
      nicheLabel,
      productContext,
    });

    const appUrl = getServerAppUrl(request);
    const articlePath = `${sitePublicPath(site)}/${result.slug}`;
    const url = `${appUrl}${articlePath}`;

    return NextResponse.json(
      {
        title: result.title,
        slug: result.slug,
        url,
        html: result.html,
        postId: result.post.id,
        offerUrl: buildOfferPageUrl(appUrl, site.slug, site.owner_handle),
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Article generation failed";
    return NextResponse.json({ error: message }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
