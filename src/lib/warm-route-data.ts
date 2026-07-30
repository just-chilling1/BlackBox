import { cachedClientFetch } from "@/lib/client-fetch-cache";

const BLOG_SESSION_ROUTES = [
  "/sales-offer-generator",
  "/territory",
  "/theme",
  "/arm-links",
  "/offers",
  "/link-vault",
  "/deploy",
  "/accelerator",
  "/recurring-wealth",
] as const;

const SITE_LIST_ROUTES = ["/promote", "/offers", "/recurring-wealth", "/accelerator"] as const;

function matchesRoute(path: string, routes: readonly string[]): boolean {
  return routes.some((route) => path === route || path.startsWith(`${route}/`));
}

export function warmBlogSession(): void {
  void cachedClientFetch("/api/blog/session").catch(() => {});
  void cachedClientFetch("/api/blog/link-vault").catch(() => {});
}

export function warmBlogSites(): void {
  void cachedClientFetch("/api/blog/site?lite=1").catch(() => {});
}

export function warmRecurringArticles(niche?: string): void {
  const q = niche && niche !== "All" ? `?niche=${encodeURIComponent(niche)}` : "";
  void cachedClientFetch(`/api/premium/recurring-stream/articles${q}`).catch(() => {});
}

/** Prefetch API data before navigation completes (sidebar hover / focus). */
export function warmRouteData(path: string): void {
  if (matchesRoute(path, BLOG_SESSION_ROUTES)) {
    warmBlogSession();
  }
  if (matchesRoute(path, SITE_LIST_ROUTES)) {
    warmBlogSites();
  }
  if (path === "/recurring-wealth" || path.startsWith("/recurring-wealth/")) {
    warmRecurringArticles();
  }
}
