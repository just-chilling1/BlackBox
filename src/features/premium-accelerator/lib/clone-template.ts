import type { SupabaseClient } from "@supabase/supabase-js";
import type { ArmedLink, BlogSite } from "@/features/blog-builder/types";
import { normalizeAffiliateUrl } from "@/features/blog-builder/lib/affiliate-url";
import { buildOfferPageUrl } from "@/lib/app-url";
import { acceleratorTemplateKey, getAcceleratorCatalogEntry } from "./catalog";
import {
  buildAcceleratorSalesPageHtml,
  resolveAcceleratorQuestionnaireCopy,
} from "./accelerator-sales-page";
import {
  buildStaticAcceleratorXThreadSeedRows,
  substituteThreadLinkPlaceholder,
} from "./x-thread-seeds";
import { backfillAcceleratorTemplateImages } from "./seed-templates";
import { slugify } from "@/features/blog-builder/lib/seo";
import {
  THREAD_IMAGE_POST_INDEXES,
  THREAD_POST_ROLES,
} from "@/features/publish-kit/lib/promote-constants";
import { generateThreadImagesForPosts } from "@/features/publish-kit/lib/thread-images";

function newSlug(seed: string): string {
  return `${slugify(seed) || "offer"}-${crypto.randomUUID().slice(0, 8)}`;
}

type ThreadSourceRow = {
  text: string;
  angle: string | null;
  image_url?: string | null;
};

async function insertClonedThreads(params: {
  db: SupabaseClient;
  userId: string;
  siteId: string;
  entry: NonNullable<ReturnType<typeof getAcceleratorCatalogEntry>>;
  offerPageUrl: string;
  affiliateUrl: string;
  sourceThreads: ThreadSourceRow[];
}): Promise<number> {
  const { db, userId, siteId, entry, offerPageUrl, affiliateUrl, sourceThreads } = params;
  if (sourceThreads.length === 0) return 0;

  const posts = sourceThreads.map((row, i) => ({
    text: substituteThreadLinkPlaceholder(row.text, offerPageUrl),
    angle: row.angle?.trim() || THREAD_POST_ROLES[i] || `Post ${i + 1}`,
  }));

  let imageResults: (string | null)[] = [];
  try {
    imageResults = await generateThreadImagesForPosts({
      posts,
      postIndexes: THREAD_IMAGE_POST_INDEXES,
      territory: `${entry.nicheLabel} ${entry.productName}`,
      hobby: entry.nicheLabel,
      productName: entry.productName,
      userId,
      supabase: db,
      scrapeUrl: affiliateUrl,
    });
  } catch {
    /* keep source images as fallback */
  }

  const batchId = crypto.randomUUID();
  const rows = posts.map((post, i) => {
    const imageSlot = THREAD_IMAGE_POST_INDEXES.indexOf(
      i as (typeof THREAD_IMAGE_POST_INDEXES)[number]
    );
    const sourceImage = sourceThreads[i]?.image_url ?? null;
    const regeneratedImage = imageSlot >= 0 ? imageResults[imageSlot] ?? null : null;

    return {
      user_id: userId,
      site_id: siteId,
      text: post.text,
      angle: post.angle,
      image_url: regeneratedImage ?? sourceImage,
      batch_id: batchId,
    };
  });

  const { error: threadErr } = await db.from("site_x_threads").insert(rows);
  if (threadErr) throw new Error(threadErr.message);
  return rows.length;
}

/** Clone an accelerator template into the member's offers library (seeded or catalog fallback). */
export async function cloneAcceleratorTemplate(params: {
  db: SupabaseClient;
  userId: string;
  catalogId: number;
  affiliateUrl: string;
  appUrl: string;
}): Promise<{ site: BlogSite; threadsCopied: number }> {
  const { db, userId, catalogId, affiliateUrl, appUrl } = params;
  const url = normalizeAffiliateUrl(affiliateUrl.trim());
  if (!url) throw new Error("Affiliate URL is required");

  const entry = getAcceleratorCatalogEntry(catalogId);
  if (!entry) throw new Error("Template not found in catalog");

  const key = acceleratorTemplateKey(catalogId);
  const { data: templateRows } = await db
    .from("sites")
    .select("*")
    .eq("is_template", true)
    .eq("template_key", key)
    .limit(1);

  const template = (templateRows ?? [])[0] as BlogSite | undefined;

  if (template?.sales_page_html) {
    try {
      await backfillAcceleratorTemplateImages(db, catalogId);
    } catch {
      /* preview clone still works with template fallbacks */
    }
  }

  const armedLinks: ArmedLink[] = [
    { label: entry.productName.slice(0, 80), url, network: "digistore" },
  ];

  const slug = newSlug(entry.productSlug);
  const copy = resolveAcceleratorQuestionnaireCopy(entry, template ?? null);
  const themeConfig = (template?.theme_config as typeof entry.themeConfig) ?? entry.themeConfig;
  const title = template?.title ?? copy.title;
  const tagline = template?.tagline ?? copy.subtitle ?? null;
  const theme = template?.theme ?? entry.template.presetId;

  const { data: siteData, error: siteErr } = await db
    .from("sites")
    .insert({
      user_id: userId,
      hobby: entry.nicheLabel,
      territory: entry.productName,
      title,
      tagline,
      slug,
      theme,
      theme_config: themeConfig,
      armed_links: armedLinks,
      status: "live",
      site_type: "product",
      is_template: false,
      template_key: key,
      sales_page_json: template?.sales_page_json ?? copy,
    })
    .select()
    .single();

  if (siteErr || !siteData) throw new Error(siteErr?.message ?? "Failed to clone template");

  const site = siteData as BlogSite;
  const offerPageUrl = buildOfferPageUrl(appUrl, slug);
  const salesPageHtml = buildAcceleratorSalesPageHtml({
    siteId: site.id,
    entry,
    copy,
    affiliateUrl: url,
    themeConfig: site.theme_config ?? themeConfig,
  });

  const { error: htmlErr } = await db
    .from("sites")
    .update({ sales_page_html: salesPageHtml })
    .eq("id", site.id);

  if (htmlErr) throw new Error(htmlErr.message);
  site.sales_page_html = salesPageHtml;

  let sourceThreads: ThreadSourceRow[] = [];

  if (template?.id) {
    const { data: templateThreads } = await db
      .from("site_x_threads")
      .select("text, angle, image_url")
      .eq("site_id", template.id)
      .order("created_at", { ascending: true });

    if (templateThreads && templateThreads.length > 0) {
      sourceThreads = templateThreads.map((row) => ({
        text: (row as { text: string }).text,
        angle: (row as { angle: string | null }).angle,
        image_url: (row as { image_url: string | null }).image_url,
      }));
    }
  }

  if (sourceThreads.length === 0) {
    sourceThreads = buildStaticAcceleratorXThreadSeedRows(
      entry.productName,
      entry.nicheLabel,
      entry.nicheKey
    ).map((row) => ({
      text: row.text,
      angle: row.angle,
      image_url: null,
    }));
  }

  const threadsCopied = await insertClonedThreads({
    db,
    userId,
    siteId: site.id,
    entry,
    offerPageUrl,
    affiliateUrl: url,
    sourceThreads,
  });

  return { site, threadsCopied };
}
