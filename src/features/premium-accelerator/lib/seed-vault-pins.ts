import type { SupabaseClient } from "@supabase/supabase-js";
import type { VaultCatalogEntry } from "./catalog";
import { buildVaultPinDrafts } from "./vault-pins";

/** Deterministic pin background — avoids scraping during vault install. */
function vaultPinImageUrl(productName: string, seed: number): string | null {
  const tags = productName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^\d+$/.test(w))
    .slice(0, 3);
  if (tags.length === 0) return null;
  const lock = Math.abs(seed) % 10_000;
  return `https://loremflickr.com/1200/675/${encodeURIComponent(tags.join(","))}/all?lock=${lock}`;
}

/**
 * Insert 10 ready Pinterest pins for a vault money page (deterministic copy + fallback images).
 * Skips if pins already exist for the site.
 */
export async function seedVaultPins(params: {
  supabase: SupabaseClient;
  userId: string;
  siteId: string;
  entry: VaultCatalogEntry;
  salesPageJson?: Record<string, unknown> | null;
}): Promise<number> {
  const { count } = await params.supabase
    .from("site_pins")
    .select("*", { count: "exact", head: true })
    .eq("site_id", params.siteId)
    .eq("user_id", params.userId);

  if ((count ?? 0) > 0) return count ?? 0;

  const copies = buildVaultPinDrafts(params.entry);
  const batchId = crypto.randomUUID();
  const backgrounds = copies.map((_, idx) =>
    vaultPinImageUrl(params.entry.productName, params.entry.id * 17 + idx * 31)
  );

  const rows = copies.map((pin, idx) => ({
    user_id: params.userId,
    site_id: params.siteId,
    batch_id: batchId,
    idx,
    headline: pin.headline,
    title: pin.title,
    description: pin.description,
    keywords: pin.keywords,
    source_image_url: backgrounds[idx],
  }));

  let { data: inserted, error } = await params.supabase.from("site_pins").insert(rows).select("id");

  if (error) {
    const legacyRows = rows.map(({ source_image_url: _s, ...rest }) => rest);
    const second = await params.supabase.from("site_pins").insert(legacyRows).select("id");
    inserted = second.data;
    error = second.error;
  }

  if (error || !inserted?.length) {
    console.error("[seedVaultPins]", error?.message || "insert failed");
    return 0;
  }

  const pinImages: Record<string, string> = {
    ...((params.salesPageJson as { pinImages?: Record<string, string> } | null)?.pinImages ?? {}),
  };

  await Promise.all(
    inserted.map(async (row, idx) => {
      const imagePath = `/api/pins/${row.id}/image`;
      const source = backgrounds[idx];
      if (source) pinImages[row.id] = source;
      await params.supabase
        .from("site_pins")
        .update({
          image_url: imagePath,
          ...(source ? { source_image_url: source } : {}),
        })
        .eq("id", row.id);
    })
  );

  if (Object.keys(pinImages).length > 0) {
    await params.supabase
      .from("sites")
      .update({
        sales_page_json: {
          ...(params.salesPageJson && typeof params.salesPageJson === "object"
            ? params.salesPageJson
            : {}),
          pinImages,
        },
      })
      .eq("id", params.siteId)
      .eq("user_id", params.userId);
  }

  return inserted.length;
}
