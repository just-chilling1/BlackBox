import { getAppUrl } from "@/lib/brand-vars";

/** Supabase email links must land on /auth/callback so we can exchange the code / verify OTP. */
export function buildAuthCallbackUrl(nextPath: string): string {
  const base = getAppUrl().replace(/\/$/, "");
  const next = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
  return `${base}/auth/callback?next=${encodeURIComponent(next)}`;
}
