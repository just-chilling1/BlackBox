import type { SupabaseClient } from "@supabase/supabase-js";

export interface SavedXThread {
  id: string;
  site_id: string;
  text: string;
  angle: string | null;
  image_url: string | null;
  batch_id: string;
  created_at: string;
}

export async function listXThreadsForSite(
  supabase: SupabaseClient,
  userId: string,
  siteId: string
): Promise<SavedXThread[]> {
  const { data, error } = await supabase
    .from("site_x_threads")
    .select("id, site_id, text, angle, image_url, batch_id, created_at")
    .eq("user_id", userId)
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") return [];
    throw new Error(error.message);
  }
  return (data ?? []) as SavedXThread[];
}

export async function saveXThreadBatch(
  supabase: SupabaseClient,
  userId: string,
  siteId: string,
  threads: { text: string; angle?: string; imageUrl?: string }[]
): Promise<SavedXThread[]> {
  const batchId = crypto.randomUUID();

  const { error: deleteError } = await supabase
    .from("site_x_threads")
    .delete()
    .eq("user_id", userId)
    .eq("site_id", siteId);

  if (deleteError && deleteError.code !== "42P01") {
    throw new Error(deleteError.message);
  }

  const rows = threads.map((thread) => ({
    user_id: userId,
    site_id: siteId,
    text: thread.text.trim(),
    angle: thread.angle?.trim() || null,
    image_url: thread.imageUrl?.trim() || null,
    batch_id: batchId,
  }));

  const { data, error } = await supabase
    .from("site_x_threads")
    .insert(rows)
    .select("id, site_id, text, angle, image_url, batch_id, created_at");

  if (error) {
    if (error.code === "42P01") return [];
    throw new Error(error.message);
  }
  return (data ?? []) as SavedXThread[];
}

export async function countXThreadsBySite(
  supabase: SupabaseClient,
  userId: string,
  siteIds: string[]
): Promise<Record<string, number>> {
  if (siteIds.length === 0) return {};

  const { data, error } = await supabase
    .from("site_x_threads")
    .select("site_id")
    .eq("user_id", userId)
    .in("site_id", siteIds);

  if (error) {
    if (error.code === "42P01") return {};
    throw new Error(error.message);
  }

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const id = (row as { site_id: string }).site_id;
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}
