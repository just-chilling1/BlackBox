import type { SupabaseClient } from "@supabase/supabase-js";

export interface SavedRecurringArticle {
  id: string;
  site_id: string;
  template_id: number;
  title: string;
  html: string;
  created_at: string;
}

export async function listRecurringArticlesForSite(
  supabase: SupabaseClient,
  userId: string,
  siteId: string
): Promise<SavedRecurringArticle[]> {
  const { data, error } = await supabase
    .from("site_recurring_articles")
    .select("id, site_id, template_id, title, html, created_at")
    .eq("user_id", userId)
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as SavedRecurringArticle[];
}

export async function saveRecurringArticle(
  supabase: SupabaseClient,
  userId: string,
  siteId: string,
  templateId: number,
  title: string,
  html: string
): Promise<SavedRecurringArticle> {
  const { data, error } = await supabase
    .from("site_recurring_articles")
    .upsert(
      {
        user_id: userId,
        site_id: siteId,
        template_id: templateId,
        title,
        html,
      },
      { onConflict: "user_id,site_id,template_id" }
    )
    .select("id, site_id, template_id, title, html, created_at")
    .single();

  if (error) throw new Error(error.message);
  return data as SavedRecurringArticle;
}

export async function countRecurringArticlesBySite(
  supabase: SupabaseClient,
  userId: string,
  siteIds: string[]
): Promise<Record<string, number>> {
  if (siteIds.length === 0) return {};

  const { data, error } = await supabase
    .from("site_recurring_articles")
    .select("site_id")
    .eq("user_id", userId)
    .in("site_id", siteIds);

  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const siteId = (row as { site_id: string }).site_id;
    counts[siteId] = (counts[siteId] ?? 0) + 1;
  }
  return counts;
}
