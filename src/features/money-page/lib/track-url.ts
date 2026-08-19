import { normalizeAffiliateUrl } from "@/features/blog-builder/lib/affiliate-url";

export function moneyPageTrackHref(siteId: string, destination: string): string {
  const url = normalizeAffiliateUrl(destination);
  return `/api/track/click?site=${encodeURIComponent(siteId)}&to=${encodeURIComponent(url)}`;
}
