import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { normalizeAffiliateUrl } from "@/features/blog-builder/lib/affiliate-url";
import { buildMoneyPageHtml } from "@/features/money-page/lib/html";
import { getMoneyPageVariation } from "@/features/money-page/lib/variations";
import { getAcceleratorCatalogEntry } from "@/features/premium-accelerator/lib/catalog";
import { buildVaultMoneyPageCopy } from "@/features/premium-accelerator/lib/vault-copy";
import { buildVaultPinDrafts } from "@/features/premium-accelerator/lib/vault-pins";

export const dynamic = "force-dynamic";

/** Return money page HTML + Pinterest pin drafts for preview (no DB writes). */
export async function GET(request: Request) {
  const guard = featureApiGuard("premium-accelerator");
  if (guard) return guard;

  const { user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const url = new URL(request.url);
  const catalogId = Number(url.searchParams.get("catalogId"));
  const affiliateRaw = url.searchParams.get("affiliateUrl")?.trim() || "";

  if (!catalogId || Number.isNaN(catalogId)) {
    return NextResponse.json(
      { error: "catalogId is required" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const entry = getAcceleratorCatalogEntry(catalogId);
  if (!entry) {
    return NextResponse.json(
      { error: "Vault page not found" },
      { status: 404, headers: NO_STORE_HEADERS }
    );
  }

  const affiliateUrl = affiliateRaw ? normalizeAffiliateUrl(affiliateRaw) : "";
  const copy = buildVaultMoneyPageCopy(entry);
  const variation = getMoneyPageVariation(entry.variationId);
  const previewCta = affiliateUrl || "https://example.com";

  const salesPageHtml = buildMoneyPageHtml({
    siteId: "preview",
    productName: entry.productName,
    copy,
    ctaUrl: previewCta,
    colorTheme: entry.colorTheme,
    variationId: entry.variationId,
    ctaHrefOverride: previewCta,
  });

  const pins = buildVaultPinDrafts(entry);

  return NextResponse.json(
    {
      catalogId: entry.id,
      niche: entry.niche,
      productName: entry.productName,
      templateName: variation.label,
      title: copy.headline,
      tagline: copy.subheadline,
      salesPageHtml,
      pins,
      /** @deprecated kept empty for older clients */
      threads: [],
    },
    { headers: NO_STORE_HEADERS }
  );
}
