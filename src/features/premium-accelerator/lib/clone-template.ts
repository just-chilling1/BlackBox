import type { SupabaseClient } from "@supabase/supabase-js";
import type { ArmedLink, BlogSite } from "@/features/blog-builder/types";
import { acceleratorTemplateKey, getAcceleratorCatalogEntry } from "./catalog";
import { ACCELERATOR_LINK_PLACEHOLDER } from "./x-thread-seeds";
import { slugify } from "@/features/blog-builder/lib/seo";

function newSlug(seed: string): string {
  return `${slugify(seed) || "offer"}-${crypto.randomUUID().slice(0, 8)}`;
}

function substituteLink(html: string, affiliateUrl: string): string {
  return html.split(ACCELERATOR_LINK_PLACEHOLDER).join(affiliateUrl);
}

function substituteThreadText(text: string, affiliateUrl: string): string {
  return text.replace(/\[LINK\]/g, affiliateUrl);
}

/** Clone an accelerator template into the member's offers library. */
export async function cloneAcceleratorTemplate(params: {
  admin: SupabaseClient;
  userId: string;
  catalogId: number;
  affiliateUrl: string;
}): Promise<{ site: BlogSite; threadsCopied: number }> {
  const { admin, userId, catalogId, affiliateUrl } = params;
  const url = affiliateUrl.trim();
  if (!url) throw new Error("Affiliate URL is required");

  const entry = getAcceleratorCatalogEntry(catalogId);
  if (!entry) throw new Error("Template not found in catalog");

  const key = acceleratorTemplateKey(catalogId);
  const { data: templateRows } = await admin
    .from("sites")
    .select("*")
    .eq("is_template", true)
    .eq("template_key", key)
    .limit(1);

  const template = (templateRows ?? [])[0] as BlogSite | undefined;
  if (!template?.sales_page_html) {
    throw new Error("This template has not been seeded yet. Contact support.");
  }

  const armedLinks: ArmedLink[] = [
    { label: entry.productName.slice(0, 80), url, network: "digistore" },
  ];

  const slug = newSlug(entry.productSlug);
  const salesPageHtml = substituteLink(template.sales_page_html, url);

  const { data: siteData, error: siteErr } = await admin
    .from("sites")
    .insert({
      user_id: userId,
      hobby: entry.nicheLabel,
      territory: entry.productName,
      title: template.title,
      tagline: template.tagline,
      slug,
      theme: template.theme,
      theme_config: (template.theme_config as typeof entry.themeConfig) ?? entry.themeConfig,
      armed_links: armedLinks,
      status: "live",
      site_type: "product",
      is_template: false,
      template_key: key,
      sales_page_html: salesPageHtml,
      sales_page_json: template.sales_page_json,
    })
    .select()
    .single();

  if (siteErr || !siteData) throw new Error(siteErr?.message ?? "Failed to clone template");
  const site = siteData as BlogSite;

  const { data: templateThreads } = await admin
    .from("site_x_threads")
    .select("text, angle")
    .eq("site_id", template.id)
    .order("created_at", { ascending: true });

  let threadsCopied = 0;
  if (templateThreads && templateThreads.length > 0) {
    const batchId = crypto.randomUUID();
    const rows = templateThreads.map((row) => ({
      user_id: userId,
      site_id: site.id,
      text: substituteThreadText((row as { text: string }).text, url),
      angle: (row as { angle: string | null }).angle,
      batch_id: batchId,
    }));

    const { error: threadErr } = await admin.from("site_x_threads").insert(rows);
    if (threadErr) throw new Error(threadErr.message);
    threadsCopied = rows.length;
  }

  return { site, threadsCopied };
}
