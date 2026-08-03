import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Find a live site by slug, optionally scoped to a member handle.
 * Slugs are unique per member (not globally), so unscoped legacy lookups
 * deterministically take the oldest match.
 */
export async function findLiveSiteBySlug<T>(
  supabase: SupabaseClient,
  columns: string,
  slug: string,
  ownerHandle?: string
): Promise<T | null> {
  let query = supabase
    .from("sites")
    .select(columns)
    .eq("slug", slug)
    .eq("status", "live");
  if (ownerHandle) query = query.eq("owner_handle", ownerHandle);

  const { data } = await query.order("created_at", { ascending: true }).limit(1);
  return (data?.[0] as T | undefined) ?? null;
}
