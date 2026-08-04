import type { SupabaseClient } from "@supabase/supabase-js";
import { countRowsBySiteIds } from "@/lib/site-counts";

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
  return countRowsBySiteIds(supabase, "site_recurring_articles", siteIds, { userId });
}
