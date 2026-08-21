import type { SupabaseClient } from "@supabase/supabase-js";
import type { BlogSite } from "@/features/blog-builder/types";

export interface DfyOwnedSite extends BlogSite {
  product_name?: string | null;
  product_url?: string | null;
}

export async function loadOwnedDfySite(
  supabase: SupabaseClient,
  userId: string,
  siteId: string
): Promise<DfyOwnedSite | null> {
  const { data: site } = await supabase
    .from("sites")
    .select("*")
    .eq("id", siteId)
    .eq("user_id", userId)
    .maybeSingle();

  return (site as DfyOwnedSite | null) ?? null;
}
