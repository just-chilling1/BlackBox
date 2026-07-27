import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildRecurringStreamCatalog,
  RECURRING_STREAM_TARGET_COUNT,
} from "./catalog";

export async function countSeededRecurringArticles(admin: SupabaseClient): Promise<number> {
  const { count } = await admin
    .from("premium_article_templates")
    .select("id", { count: "exact", head: true })
    .like("template_key", "recurring-stream-%");

  return count ?? 0;
}

/** Seed recurring-stream article templates once (idempotent). */
export async function seedRecurringStreamArticles(
  admin: SupabaseClient
): Promise<{ inserted: number; skipped: boolean; total: number }> {
  const existing = await countSeededRecurringArticles(admin);
  if (existing >= RECURRING_STREAM_TARGET_COUNT) {
    return { inserted: 0, skipped: true, total: RECURRING_STREAM_TARGET_COUNT };
  }

  const catalog = buildRecurringStreamCatalog();
  const rows = catalog.map((article) => ({
    template_key: article.templateKey,
    niche: article.niche,
    title: article.title,
    slug: article.slug,
    html: article.html,
    excerpt: article.excerpt,
    meta_description: article.metaDescription,
    angle: article.angle,
  }));

  const { error } = await admin
    .from("premium_article_templates")
    .upsert(rows, { onConflict: "template_key", ignoreDuplicates: true });

  if (error) throw new Error(error.message);

  const after = await countSeededRecurringArticles(admin);
  return {
    inserted: after - existing,
    skipped: false,
    total: after,
  };
}

export interface StoredArticleTemplate {
  id: number;
  template_key: string;
  niche: string;
  title: string;
  slug: string;
  html: string;
  excerpt: string | null;
  meta_description: string | null;
  angle: string | null;
}

export async function listRecurringStreamArticles(
  supabase: SupabaseClient,
  niche?: string
): Promise<StoredArticleTemplate[]> {
  let query = supabase
    .from("premium_article_templates")
    .select("id, template_key, niche, title, slug, html, excerpt, meta_description, angle")
    .like("template_key", "recurring-stream-%")
    .order("id", { ascending: true });

  if (niche && niche !== "All") {
    query = query.eq("niche", niche);
  }

  const { data, error } = await query;
  if (error) {
    if (error.code === "42P01") return [];
    throw new Error(error.message);
  }

  return (data ?? []) as StoredArticleTemplate[];
}
