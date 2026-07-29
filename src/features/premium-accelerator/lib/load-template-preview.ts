import type { SupabaseClient } from "@supabase/supabase-js";
import type { BlogSite } from "@/features/blog-builder/types";
import { acceleratorTemplateKey, getAcceleratorCatalogEntry } from "./catalog";
import { ACCELERATOR_LINK_PLACEHOLDER, substituteThreadLinkPlaceholder } from "./x-thread-seeds";

export interface AcceleratorThreadPreview {
  text: string;
  angle: string | null;
  image_url: string | null;
}

export interface AcceleratorTemplatePreview {
  catalogId: number;
  niche: string;
  productName: string;
  templateName: string;
  title: string;
  tagline: string | null;
  salesPageHtml: string;
  threads: AcceleratorThreadPreview[];
}

function substituteSalesPageLink(html: string, affiliateUrl?: string): string {
  if (!affiliateUrl) return html;
  return html.split(ACCELERATOR_LINK_PLACEHOLDER).join(affiliateUrl);
}

function substituteThreadText(text: string, affiliateUrl?: string): string {
  if (!affiliateUrl) return text;
  return substituteThreadLinkPlaceholder(text, affiliateUrl);
}

/** Load seeded accelerator template content for member preview (no clone). */
export async function loadAcceleratorTemplatePreview(params: {
  db: SupabaseClient;
  catalogId: number;
  affiliateUrl?: string;
}): Promise<AcceleratorTemplatePreview> {
  const { db, catalogId, affiliateUrl } = params;
  const entry = getAcceleratorCatalogEntry(catalogId);
  if (!entry) throw new Error("Template not found in catalog");

  const key = acceleratorTemplateKey(catalogId);
  const { data: templateRows } = await db
    .from("sites")
    .select("id, title, tagline, sales_page_html")
    .eq("is_template", true)
    .eq("template_key", key)
    .limit(1);

  const template = (templateRows ?? [])[0] as Pick<BlogSite, "id" | "title" | "tagline" | "sales_page_html"> | undefined;
  if (!template?.sales_page_html) {
    throw new Error("This template has not been seeded yet.");
  }

  const { data: templateThreads } = await db
    .from("site_x_threads")
    .select("text, angle, image_url")
    .eq("site_id", template.id)
    .order("created_at", { ascending: true });

  const url = affiliateUrl?.trim();

  return {
    catalogId,
    niche: entry.nicheLabel,
    productName: entry.productName,
    templateName: entry.template.name,
    title: template.title,
    tagline: template.tagline ?? null,
    salesPageHtml: substituteSalesPageLink(template.sales_page_html, url),
    threads: (templateThreads ?? []).map((row) => ({
      text: substituteThreadText((row as { text: string }).text, url),
      angle: (row as { angle: string | null }).angle,
      image_url: (row as { image_url: string | null }).image_url,
    })),
  };
}
