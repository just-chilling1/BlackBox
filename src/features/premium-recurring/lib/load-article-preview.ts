import type { SupabaseClient } from "@supabase/supabase-js";
import type { BlogSite } from "@/features/blog-builder/types";
import { weaveAffiliateIntoArticle } from "./catalog";
import { buildOfferPageUrl } from "@/lib/app-url";
import { getAppUrl } from "@/lib/brand-vars";

export interface RecurringArticlePreview {
  id: number;
  title: string;
  html: string;
  excerpt: string | null;
  metaDescription: string | null;
  promoLink: string | null;
}

function moneyPagePromoLink(site: BlogSite, origin?: string): string {
  const base = buildOfferPageUrl(
    origin || getAppUrl(),
    site.slug,
    site.owner_handle
  );
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}src=article`;
}

export async function loadRecurringArticlePreview(
  reader: SupabaseClient,
  articleId: number,
  site: BlogSite,
  options?: { origin?: string }
): Promise<RecurringArticlePreview> {
  const { data, error } = await reader
    .from("premium_article_templates")
    .select("id, title, html, excerpt, meta_description")
    .eq("id", articleId)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Article not found");
  }

  const promoLink = moneyPagePromoLink(site, options?.origin);
  const affiliateFallback = site.armed_links?.[0]?.url?.trim() ?? "";
  const weaveUrl = promoLink || affiliateFallback;
  const html = weaveAffiliateIntoArticle((data as { html: string }).html, weaveUrl);

  return {
    id: (data as { id: number }).id,
    title: (data as { title: string }).title,
    html,
    excerpt: (data as { excerpt: string | null }).excerpt,
    metaDescription: (data as { meta_description: string | null }).meta_description,
    promoLink: weaveUrl || null,
  };
}

/** Strip article HTML to a plain-text block suitable for a money-page section. */
export function articleHtmlToAuthorityBody(html: string, maxChars = 1200): string {
  const text = html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  if (text.length <= maxChars) return text;
  const sliced = text.slice(0, maxChars);
  const lastBreak = Math.max(sliced.lastIndexOf(". "), sliced.lastIndexOf("\n"));
  return `${(lastBreak > 400 ? sliced.slice(0, lastBreak + 1) : sliced).trim()}…`;
}
