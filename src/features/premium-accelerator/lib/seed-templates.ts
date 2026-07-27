import type { SupabaseClient } from "@supabase/supabase-js";
import { buildSeededQuestionnaireCopy } from "@/features/blog-builder/lib/questionnaire-seeds";
import { buildThemedQuestionnairePage } from "@/features/blog-builder/lib/questionnaire-page-html";
import { getReadyTemplateFromConfig } from "@/features/blog-builder/themes";
import type { BlogSite } from "@/features/blog-builder/types";
import {
  acceleratorTemplateKey,
  buildAcceleratorCatalog,
  type AcceleratorCatalogEntry,
} from "./catalog";
import {
  ACCELERATOR_LINK_PLACEHOLDER,
  buildAcceleratorXThreadSeeds,
} from "./x-thread-seeds";

function newSlug(seed: string): string {
  return `${seed}-${crypto.randomUUID().slice(0, 8)}`;
}

async function loadSeededTemplate(
  admin: SupabaseClient,
  catalogId: number
): Promise<{ site: BlogSite; threadCount: number } | null> {
  const key = acceleratorTemplateKey(catalogId);
  const { data: sites } = await admin
    .from("sites")
    .select("*")
    .eq("is_template", true)
    .eq("template_key", key)
    .limit(1);

  const site = (sites ?? [])[0] as BlogSite | undefined;
  if (!site) return null;

  const { count } = await admin
    .from("site_x_threads")
    .select("id", { count: "exact", head: true })
    .eq("site_id", site.id);

  return { site, threadCount: count ?? 0 };
}

function buildSalesPageForTemplate(entry: AcceleratorCatalogEntry, siteId: string) {
  const template = getReadyTemplateFromConfig(entry.themeConfig);
  const copy = buildSeededQuestionnaireCopy({
    niche: entry.nicheLabel,
    nicheKey: entry.nicheKey,
    productName: entry.productName,
    copyToneId: template.copyToneId,
  });

  const salesPageHtml = buildThemedQuestionnairePage({
    siteId,
    niche: entry.nicheLabel,
    productName: entry.productName,
    copy,
    affiliateUrl: ACCELERATOR_LINK_PLACEHOLDER,
    themeConfig: entry.themeConfig,
  });

  return { copy, salesPageHtml };
}

/** Seed one accelerator template (idempotent — skips if already complete). */
export async function seedAcceleratorTemplate(
  admin: SupabaseClient,
  entry: AcceleratorCatalogEntry
): Promise<{ skipped: boolean; siteId: string }> {
  const ownerId = process.env.TEMPLATE_OWNER_ID?.trim();
  if (!ownerId) {
    throw new Error("TEMPLATE_OWNER_ID env is not set (must be a real Supabase user id).");
  }

  const existing = await loadSeededTemplate(admin, entry.id);
  if (existing && existing.site.sales_page_html && existing.threadCount >= 10) {
    return { skipped: true, siteId: existing.site.id };
  }

  let site = existing?.site ?? null;
  const { copy, salesPageHtml } = buildSalesPageForTemplate(
    entry,
    site?.id ?? crypto.randomUUID()
  );

  if (!site) {
    const slug = newSlug(entry.productSlug);
    const { data, error } = await admin
      .from("sites")
      .insert({
        user_id: ownerId,
        hobby: entry.nicheLabel,
        territory: entry.productName,
        title: copy.title,
        tagline: copy.subtitle.slice(0, 160),
        slug,
        theme: entry.template.presetId,
        theme_config: entry.themeConfig,
        armed_links: [],
        status: "live",
        site_type: "product",
        is_template: true,
        template_key: acceleratorTemplateKey(entry.id),
        sales_page_html: salesPageHtml,
        sales_page_json: copy,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    site = data as BlogSite;
  } else if (!site.sales_page_html) {
    const { error } = await admin
      .from("sites")
      .update({
        title: copy.title,
        tagline: copy.subtitle.slice(0, 160),
        sales_page_html: salesPageHtml,
        sales_page_json: copy,
        theme_config: entry.themeConfig,
        status: "live",
      })
      .eq("id", site.id);

    if (error) throw new Error(error.message);
  }

  if ((existing?.threadCount ?? 0) < 10) {
    await admin.from("site_x_threads").delete().eq("site_id", site!.id);

    const threads = buildAcceleratorXThreadSeeds(entry.productName, entry.nicheLabel);
    const batchId = crypto.randomUUID();
    const rows = threads.map((text, i) => ({
      user_id: ownerId,
      site_id: site!.id,
      text,
      angle: `Thread ${i + 1}`,
      batch_id: batchId,
    }));

    const { error: threadErr } = await admin.from("site_x_threads").insert(rows);
    if (threadErr) throw new Error(threadErr.message);
  }

  return { skipped: false, siteId: site!.id };
}

export interface SeedBatchResult {
  seeded: number;
  skipped: number;
  total: number;
  complete: boolean;
}

/** Seed a batch of accelerator templates — run once via admin script/API. */
export async function seedAcceleratorBatch(
  admin: SupabaseClient,
  offset = 0,
  limit = 25
): Promise<SeedBatchResult> {
  const catalog = buildAcceleratorCatalog();
  const slice = catalog.slice(offset, offset + limit);
  let seeded = 0;
  let skipped = 0;

  for (const entry of slice) {
    const result = await seedAcceleratorTemplate(admin, entry);
    if (result.skipped) skipped++;
    else seeded++;
  }

  const processed = offset + slice.length;
  return {
    seeded,
    skipped,
    total: catalog.length,
    complete: processed >= catalog.length,
  };
}

/** Count how many accelerator templates exist in DB. */
export async function countSeededAcceleratorTemplates(admin: SupabaseClient): Promise<number> {
  const { count } = await admin
    .from("sites")
    .select("id", { count: "exact", head: true })
    .eq("is_template", true)
    .like("template_key", "accelerator-%");

  return count ?? 0;
}
