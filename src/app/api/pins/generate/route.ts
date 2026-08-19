import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { generatePinCopy } from "@/features/traffic/lib/pin-rules";
import {
  getThreadGenerationQuota,
  recordThreadGeneration,
} from "@/features/publish-kit/lib/thread-generation-quota";
import { isFeatureEnabled } from "@/config/features.config";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function withPinImageUrls<T extends { id: string; image_url?: string | null }>(pins: T[]) {
  return pins.map((pin) => ({
    ...pin,
    image_url: pin.image_url || `/api/pins/${pin.id}/image?v=2`,
  }));
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

  let siteQuery = await supabase
    .from("sites")
    .select("id, title, product_name, hobby, sales_page_json")
    .eq("id", siteId)
    .eq("user_id", user.id)
    .maybeSingle();

  // Older DBs may lack NullPing columns — fall back so we don't fake "Asset not found".
  if (siteQuery.error && schemaMissingMessage(siteQuery.error)) {
    siteQuery = await supabase
      .from("sites")
      .select("id, title, hobby, sales_page_json")
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
    hobby?: string | null;
    sales_page_json?: unknown;
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
      const { data: existing } = await supabase
        .from("site_pins")
        .select("*")
        .eq("site_id", siteId)
        .eq("user_id", user.id)
        .order("idx", { ascending: true });
      return NextResponse.json({ pins: withPinImageUrls(existing ?? []), alreadyGenerated: true });
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
  const copyJson = site.sales_page_json as { headline?: string; subheadline?: string } | null;
  const context = [copyJson?.headline, copyJson?.subheadline, site.hobby].filter(Boolean).join("\n");
  const copies = await generatePinCopy(productName, context);
  const batchId = crypto.randomUUID();

  const rows = copies.map((pin, idx) => ({
    user_id: user.id,
    site_id: siteId,
    batch_id: batchId,
    idx,
    headline: pin.headline,
    title: pin.title,
    description: pin.description,
    keywords: pin.keywords,
  }));

  const { data: inserted, error } = await supabase.from("site_pins").insert(rows).select("*");
  if (error) {
    const schemaMsg = schemaMissingMessage(error);
    return NextResponse.json(
      { error: schemaMsg || error.message },
      { status: schemaMsg ? 503 : 500 }
    );
  }

  const withImages = withPinImageUrls(inserted ?? []);

  await Promise.all(
    withImages.map((row) =>
      supabase.from("site_pins").update({ image_url: `/api/pins/${row.id}/image` }).eq("id", row.id)
    )
  );

  await recordThreadGeneration(supabase, user.id, siteId);
  const quotaAfter = await getThreadGenerationQuota(supabase, user.id);
  return NextResponse.json({ pins: withImages, batchId, quota: quotaAfter });
}
