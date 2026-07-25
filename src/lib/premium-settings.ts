import type { SupabaseClient } from "@supabase/supabase-js";
import { storageKeys } from "@/lib/storage-keys";

export interface PremiumSettings {
  instant_income_niche: string | null;
  instant_income_affiliate_url: string | null;
  autopilot_promotion_url: string | null;
  autopilot_selected_niche: string | null;
}

const DEFAULT_SETTINGS: PremiumSettings = {
  instant_income_niche: null,
  instant_income_affiliate_url: null,
  autopilot_promotion_url: null,
  autopilot_selected_niche: "All",
};

export async function fetchPremiumSettings(
  supabase: SupabaseClient,
  userId: string
): Promise<PremiumSettings> {
  const { data } = await supabase
    .from("user_premium_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return DEFAULT_SETTINGS;

  return {
    instant_income_niche: data.instant_income_niche ?? null,
    instant_income_affiliate_url: data.instant_income_affiliate_url ?? null,
    autopilot_promotion_url: data.autopilot_promotion_url ?? null,
    autopilot_selected_niche: data.autopilot_selected_niche ?? "All",
  };
}

export async function upsertPremiumSettings(
  supabase: SupabaseClient,
  userId: string,
  patch: Partial<PremiumSettings>
): Promise<void> {
  await supabase.from("user_premium_settings").upsert({
    user_id: userId,
    ...patch,
    updated_at: new Date().toISOString(),
  });
}

/** Migrate legacy localStorage autopilot completions to DB when premium APIs are wired. */
export function migrateLegacyAutopilotLocalStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKeys.autopilotCompleted);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
