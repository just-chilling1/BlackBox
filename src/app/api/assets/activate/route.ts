import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { activateAsset } from "@/features/money-page/lib/generate";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  const guard = featureApiGuard("asset-activator");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const productUrl = typeof body.productUrl === "string" ? body.productUrl : "";
  const productName = typeof body.productName === "string" ? body.productName : "";
  const affiliateUrl = typeof body.affiliateUrl === "string" ? body.affiliateUrl : "";

  try {
    const result = await activateAsset({
      supabase,
      user,
      input: { productUrl, productName, affiliateUrl },
    });
    return NextResponse.json({
      site: result.site,
      assetId: result.site.id,
      productName: result.site.product_name || result.copy.headline,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Activation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
