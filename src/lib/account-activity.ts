import type { SupabaseClient } from "@supabase/supabase-js";
import { getServiceRoleClient } from "@/lib/api-auth";
import { countLiveSites, loadUserSites } from "@/lib/user-sites";

export interface AccountActivitySummary {
  livePages: number;
  pinCount: number;
  lastPublishAt: string | null;
  lastPinAt: string | null;
  lastVisitAt: string | null;
}

const EMPTY_ACTIVITY: AccountActivitySummary = {
  livePages: 0,
  pinCount: 0,
  lastPublishAt: null,
  lastPinAt: null,
  lastVisitAt: null,
};

/** Real account activity for Cyber Protection — uses service role after the caller verified auth. */
export async function loadAccountActivity(
  supabase: SupabaseClient,
  userId: string
): Promise<AccountActivitySummary> {
  const db = getServiceRoleClient() ?? supabase;
  const { sites: siteList, error } = await loadUserSites(db, userId);

  if (error) {
    console.error("[account-activity] failed to load sites:", error);
    return EMPTY_ACTIVITY;
  }

  const livePages = countLiveSites(siteList);
  const live = siteList
    .filter((site) => site.status === "live")
    .sort(
      (a, b) =>
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    );
  const siteIds = siteList.map((site) => site.id);

  if (siteIds.length === 0) {
    return { ...EMPTY_ACTIVITY, livePages };
  }

  const [{ data: latestPin }, { count: pinCount }, { data: latestVisit }] = await Promise.all([
    db
      .from("site_pins")
      .select("created_at")
      .eq("user_id", userId)
      .in("site_id", siteIds)
      .order("created_at", { ascending: false })
      .limit(1),
    db
      .from("site_pins")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("site_id", siteIds),
    db
      .from("page_visits")
      .select("created_at")
      .in("site_id", siteIds)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  return {
    livePages,
    pinCount: pinCount ?? 0,
    lastPublishAt: live[0]?.created_at ?? null,
    lastPinAt: latestPin?.[0]?.created_at ?? null,
    lastVisitAt: latestVisit?.[0]?.created_at ?? null,
  };
}
