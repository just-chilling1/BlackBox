import type { SupabaseClient } from "@supabase/supabase-js";

function schemaMissing(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const code = error.code || "";
  const message = error.message || "";
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    code === "42703" ||
    /schema cache|does not exist|Could not find the/i.test(message)
  );
}

export type UserSiteRow = {
  id: string;
  title?: string;
  product_name?: string | null;
  slug?: string;
  status: string | null;
  owner_handle?: string | null;
  created_at?: string;
};

/** Load a member's sites with fallbacks for older schemas (matches /api/results). */
export async function loadUserSites(
  supabase: SupabaseClient,
  userId: string
): Promise<{ sites: UserSiteRow[]; error: string | null }> {
  const full = await supabase
    .from("sites")
    .select("id, title, product_name, slug, status, owner_handle, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!full.error) {
    return { sites: (full.data ?? []) as UserSiteRow[], error: null };
  }

  if (schemaMissing(full.error)) {
    const withoutHandle = await supabase
      .from("sites")
      .select("id, title, product_name, slug, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!withoutHandle.error) {
      return { sites: (withoutHandle.data ?? []) as UserSiteRow[], error: null };
    }

    if (schemaMissing(withoutHandle.error)) {
      const minimal = await supabase
        .from("sites")
        .select("id, title, slug, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!minimal.error) {
        return { sites: (minimal.data ?? []) as UserSiteRow[], error: null };
      }
      return { sites: [], error: minimal.error.message };
    }

    return { sites: [], error: withoutHandle.error.message };
  }

  return { sites: [], error: full.error.message };
}

export function countLiveSites(sites: UserSiteRow[]): number {
  return sites.filter((site) => site.status === "live").length;
}
