import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { buildOfferPageUrl, getServerAppUrl } from "@/lib/app-url";

export const dynamic = "force-dynamic";

/**
 * Pin Multiplier: list existing site_pins for a money page.
 * Generation is handled by POST /api/pins/generate with { extraBatch: true }.
 */
export async function GET(request: Request) {
  const guard = featureApiGuard("premium-social");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const siteId = new URL(request.url).searchParams.get("siteId")?.trim() || "";
  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const { data: siteRow } = await supabase
    .from("sites")
    .select("id, slug, owner_handle, product_name, title, status")
    .eq("id", siteId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!siteRow?.slug) {
    return NextResponse.json({ error: "Money page not found" }, { status: 404, headers: NO_STORE_HEADERS });
  }

  const { data: pins, error } = await supabase
    .from("site_pins")
    .select("id, headline, title, description, keywords, image_url, batch_id, created_at, idx")
    .eq("user_id", user.id)
    .eq("site_id", siteId)
    .order("created_at", { ascending: false })
    .order("idx", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE_HEADERS });
  }

  const origin = getServerAppUrl(request);
  const publicUrl = buildOfferPageUrl(origin, siteRow.slug, siteRow.owner_handle);

  const withImages = (pins ?? []).map((pin) => ({
    ...pin,
    image_url:
      typeof pin.image_url === "string" && pin.image_url.startsWith("http")
        ? `/api/pins/${pin.id}/image?v=9`
        : pin.image_url || `/api/pins/${pin.id}/image?v=9`,
    trackingUrl: `${publicUrl}?pin=${pin.id}&src=pinterest`,
  }));

  return NextResponse.json(
    {
      pins: withImages,
      pinCount: withImages.length,
      publicUrl,
      productName: siteRow.product_name || siteRow.title,
      status: siteRow.status,
    },
    { headers: NO_STORE_HEADERS }
  );
}
