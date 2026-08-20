import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { generatePinCopy } from "@/features/traffic/lib/pin-rules";
import { resolvePinBackgroundImages } from "@/features/traffic/lib/pin-images";
import {
  getThreadGenerationQuota,
  recordThreadGeneration,
} from "@/features/publish-kit/lib/thread-generation-quota";
import { isFeatureEnabled } from "@/config/features.config";
import type { ArmedLink } from "@/features/blog-builder/types";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function withPinImageUrls<T extends { id: string; image_url?: string | null }>(pins: T[]) {
  return pins.map((pin) => ({
    ...pin,
    image_url: pin.image_url?.startsWith("http")
      ? `/api/pins/${pin.id}/image?v=7`
      : pin.image_url || `/api/pins/${pin.id}/image?v=7`,
  }));
}

function scrapeTargetsFromSite(site: {
  product_url?: string | null;
  armed_links?: ArmedLink[] | null;
  sales_page_json?: { heroImage?: string } | null;
}) {
  const links = Array.isArray(site.armed_links) ? site.armed_links : [];
  const primary = site.product_url || links[0]?.url || "";
  const extras = links.map((l) => l.url).filter((url) => url && url !== primary);
  return { scrapeUrl: primary || null, scrapeUrls: extras };
}

function schemaMissingMessage(error: { code?: string; message?: string } | null): string | null {
  if (!error) return null;
  const code = error.code || "";
  const message = error.message || "";
  if (
    code === "42P01" ||
    code === "PGRST205" ||
    code === "42703" ||
    /schema cache|does not exist|Could not find the table/i.test(message)
  ) {
    return "Database setup incomplete. Run the NullPing assets migration (site_pins / product_name), then try again.";
  }
  return null;
}

export async function GET(request: Request) {
  const guard = featureApiGuard("traffic-pins");
  if (guard) return guard;
  const { supabase, user } = await getApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const siteId = new URL(request.url).searchParams.get("siteId")?.trim() || "";
  if (!siteId) return NextResponse.json({ error: "siteId is required" }, { status: 400 });

  const { data: pins, error } = await supabase
    .from("site_pins")
    .select("*")
    .eq("user_id", user.id)
    .eq("site_id", siteId)
    .order("created_at", { ascending: false })
    .order("idx", { ascending: true });

  if (error) {
    const schemaMsg = schemaMissingMessage(error);
    return NextResponse.json(
      { error: schemaMsg || error.message },
      { status: schemaMsg ? 503 : 500 }
    );
  }
  const quota = await getThreadGenerationQuota(supabase, user.id);
  return NextResponse.json({ pins: withPinImageUrls(pins ?? []), quota });
}

export async function POST(request: Request) {
  const guard = featureApiGuard("traffic-pins");
  if (guard) return guard;
  const { supabase, user } = await getApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const siteId = typeof body.siteId === "string" ? body.siteId : "";
  if (!siteId) return NextResponse.json({ error: "siteId is required" }, { status: 400 });

  const extraBatch = Boolean(body.extraBatch) && isFeatureEnabled("premium-social");
  const regenerate = Boolean(body.regenerate);

  let siteQuery = await supabase
    .from("sites")
    .select("id, title, product_name, product_url, hobby, sales_page_json, armed_links")
    .eq("id", siteId)
    .eq("user_id", user.id)
    .maybeSingle();

  // Older DBs may lack NullPing columns — fall back so we don't fake "Asset not found".
  if (siteQuery.error && schemaMissingMessage(siteQuery.error)) {
    siteQuery = await supabase
      .from("sites")
      .select("id, title, hobby, sales_page_json, armed_links, product_url")
      .eq("id", siteId)
      .eq("user_id", user.id)
      .maybeSingle();
  }

  if (siteQuery.error) {
    const schemaMsg = schemaMissingMessage(siteQuery.error);
    return NextResponse.json(
      { error: schemaMsg || siteQuery.error.message },
      { status: schemaMsg ? 503 : 500 }
    );
  }

  const site = siteQuery.data as {
    id: string;
    title: string;
    product_name?: string | null;
    product_url?: string | null;
    hobby?: string | null;
    sales_page_json?: { headline?: string; subheadline?: string; heroImage?: string } | null;
    armed_links?: ArmedLink[] | null;
  } | null;
  if (!site) return NextResponse.json({ error: "Asset not found" }, { status: 404 });

  if (!extraBatch) {
    const { count, error: countError } = await supabase
      .from("site_pins")
      .select("*", { count: "exact", head: true })
      .eq("site_id", siteId)
      .eq("user_id", user.id);
    if (countError) {
      const schemaMsg = schemaMissingMessage(countError);
      return NextResponse.json(
        { error: schemaMsg || countError.message },
        { status: schemaMsg ? 503 : 500 }
      );
    }
    if ((count ?? 0) > 0) {
      if (!regenerate && !extraBatch) {
        const { data: existing } = await supabase
          .from("site_pins")
          .select("*")
          .eq("site_id", siteId)
          .eq("user_id", user.id)
          .order("idx", { ascending: true });
        return NextResponse.json({ pins: withPinImageUrls(existing ?? []), alreadyGenerated: true });
      }
      if (regenerate) {
        await supabase.from("site_pins").delete().eq("site_id", siteId).eq("user_id", user.id);
      }
    }
  }

  const quota = await getThreadGenerationQuota(supabase, user.id);
  if (quota.remaining <= 0) {
    return NextResponse.json(
      { error: `Daily pin generation limit reached (${quota.limit}). Try again tomorrow.` },
      { status: 429 }
    );
  }

  const productName = site.product_name || site.title;
  const copyJson = site.sales_page_json;
  const context = [copyJson?.headline, copyJson?.subheadline, site.hobby].filter(Boolean).join("\n");
  const copies = await generatePinCopy(productName, context);
  const batchId = crypto.randomUUID();
  const { scrapeUrl, scrapeUrls } = scrapeTargetsFromSite(site);

  const heroImage = copyJson?.heroImage || null;
  const priorPinImages = Object.values(
    (copyJson as { pinImages?: Record<string, string> } | null)?.pinImages ?? {}
  );

  // Existing pin backgrounds on this asset — never reuse across batches.
  const { data: existingPinRows } = await supabase
    .from("site_pins")
    .select("source_image_url")
    .eq("site_id", siteId)
    .eq("user_id", user.id);
  const existingSourceImages = (existingPinRows ?? [])
    .map((row) => (row as { source_image_url?: string | null }).source_image_url)
    .filter((url): url is string => Boolean(url?.trim()));

  const backgrounds = await resolvePinBackgroundImages({
    pins: copies,
    productName,
    hobby: site.hobby,
    scrapeUrl,
    scrapeUrls,
    // Hero only on the first-ever batch (not extra / regenerate refill slots).
    preferredImages: extraBatch || regenerate ? [] : [heroImage],
    excludeImages: [
      // Always keep the money-page hero unique unless it's assigned as preferred above.
      ...(extraBatch || regenerate ? [heroImage] : []),
      ...priorPinImages,
      ...existingSourceImages,
    ],
    userId: user.id,
    supabase,
  });

  const rows = copies.map((pin, idx) => ({
    user_id: user.id,
    site_id: siteId,
    batch_id: batchId,
    idx,
    headline: pin.headline,
    title: pin.title,
    description: pin.description,
    keywords: pin.keywords,
    // Do not coalesce every pin to heroImage — that made all boxing pins identical.
    source_image_url: backgrounds[idx] || (idx === 0 ? heroImage : null) || null,
  }));

  let { data: inserted, error } = await supabase.from("site_pins").insert(rows).select("*");

  // Older DBs without source_image_url — insert without it, then patch hero onto sales page usage.
  if (error && schemaMissingMessage(error)) {
    const legacyRows = rows.map(({ source_image_url: _s, ...rest }) => rest);
    const second = await supabase.from("site_pins").insert(legacyRows).select("*");
    inserted = second.data;
    error = second.error;
  }

  if (error) {
    const schemaMsg = schemaMissingMessage(error);
    return NextResponse.json(
      { error: schemaMsg || error.message },
      { status: schemaMsg ? 503 : 500 }
    );
  }

  const withImages = withPinImageUrls(
    (inserted ?? []).map((row, idx) => ({
      ...row,
      source_image_url:
        (row as { source_image_url?: string | null }).source_image_url ||
        backgrounds[idx] ||
        (idx === 0 ? heroImage : null) ||
        null,
    }))
  );

  await Promise.all(
    withImages.map((row) =>
      supabase
        .from("site_pins")
        .update({
          image_url: `/api/pins/${row.id}/image`,
          ...((row as { source_image_url?: string | null }).source_image_url
            ? { source_image_url: (row as { source_image_url?: string | null }).source_image_url }
            : {}),
        })
        .eq("id", row.id)
    )
  );

  // Persist backgrounds on the money page JSON so pin images work even before
  // source_image_url is migrated onto site_pins.
  const pinImages: Record<string, string> = regenerate
    ? {}
    : {
        ...((copyJson as { pinImages?: Record<string, string> } | null)?.pinImages ?? {}),
      };
  for (const row of withImages) {
    const src = (row as { source_image_url?: string | null }).source_image_url;
    if (src) pinImages[row.id] = src;
  }
  if (Object.keys(pinImages).length > 0) {
    await supabase
      .from("sites")
      .update({
        sales_page_json: {
          ...(copyJson && typeof copyJson === "object" ? copyJson : {}),
          pinImages,
        },
      })
      .eq("id", siteId)
      .eq("user_id", user.id);
  }

  await recordThreadGeneration(supabase, user.id, siteId);
  const quotaAfter = await getThreadGenerationQuota(supabase, user.id);
  return NextResponse.json({ pins: withImages, batchId, quota: quotaAfter });
}
