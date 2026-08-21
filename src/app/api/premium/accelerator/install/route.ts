import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { sitePublicPath } from "@/lib/app-url";
import { installVaultAsset } from "@/features/premium-accelerator/lib/install-vault-asset";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Install a vault money page with the member's affiliate link. */
export async function POST(request: Request) {
  const guard = featureApiGuard("premium-accelerator");
  if (guard) return guard;

  const { user, supabase } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const body = await request.json().catch(() => ({}));
  const catalogId = typeof body.catalogId === "number" ? body.catalogId : Number(body.catalogId);
  const affiliateUrl = typeof body.affiliateUrl === "string" ? body.affiliateUrl.trim() : "";

  if (!catalogId || Number.isNaN(catalogId)) {
    return NextResponse.json(
      { error: "catalogId is required" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }
  if (!affiliateUrl) {
    return NextResponse.json(
      { error: "affiliateUrl is required" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const result = await installVaultAsset({
      supabase,
      user,
      catalogId,
      affiliateUrl,
    });

    return NextResponse.json(
      {
        assetId: result.site.id,
        site: result.site,
        siteUrl: sitePublicPath(result.site),
        /** @deprecated alias for older clients */
        threadsCopied: 0,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Install failed";
    const status = msg.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: msg }, { status, headers: NO_STORE_HEADERS });
  }
}
