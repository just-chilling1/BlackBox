"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, LogOut, ExternalLink, Headphones, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { useWorkflowNav } from "@/context/WorkflowNavContext";
import { getBottomNavTabs, getBottomNavMoreLinks } from "@/lib/features";
import { PREMIUM_FEATURES } from "@/lib/premium-features";
import { PremiumFeatureNavList } from "@/components/dashboard/PremiumFeatureNavList";
import { getExclusiveOffers } from "@/config/offers.config";
import { trainingContent } from "@/config/training.config";
import { getNavIcon } from "@/lib/nav-icons";
import { isNavPathActive } from "@/lib/nav-active";
import { support } from "@/config/support.config";

export function BottomNav() {
  const pathname = usePathname();
  const workflow = useWorkflowNav();
  const tabs = getBottomNavTabs();
  const moreLinks = getBottomNavMoreLinks();
  const exclusiveOffers = getExclusiveOffers(trainingContent.externalTrainingUrl);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [moreOpen]);

  if (tabs.length === 0) return null;

  const tabUrls = tabs.map((t) => t.path);
  const premiumUrls = PREMIUM_FEATURES.map((p) => p.href);
  const moreActive =
    !tabUrls.some((url) => isNavPathActive(pathname, url)) &&
    !premiumUrls.some((u) => pathname.startsWith(u));

  const handleSignOut = async () => {
    setMoreOpen(false);
    if (workflow?.resetSession) {
      await workflow.resetSession();
      return;
    }
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      <nav
        className="app-bottom-nav fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-page/95 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-16">
          {tabs.map((tab) => {
            const isActive = isNavPathActive(pathname, tab.path);
            const Icon = getNavIcon(tab.icon);
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={clsx(
                  "relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors",
                  isActive ? "text-accent" : "text-text-muted active:text-text-primary"
                )}
              >
                {isActive ? (
                  <span className="absolute top-0 left-3 right-3 h-[3px] rounded-b-full bg-gradient-to-r from-accent to-accent-muted" />
                ) : null}
                <Icon className="h-6 w-6" />
                <span className="text-[11px] font-semibold leading-none">{tab.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={clsx(
              "relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors",
              moreActive || moreOpen ? "text-accent" : "text-text-muted active:text-text-primary"
            )}
          >
            {(moreActive || moreOpen) ? (
              <span className="absolute top-0 left-3 right-3 h-[3px] rounded-b-full bg-gradient-to-r from-accent to-accent-muted" />
            ) : null}
            <Menu className="h-6 w-6" />
            <span className="text-[11px] font-semibold leading-none">More</span>
          </button>
        </div>
      </nav>

      {moreOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-black/10 bg-page"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
          >
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-black/15" />
            <div className="space-y-6 p-4">
              {PREMIUM_FEATURES.length > 0 ? (
                <PremiumFeatureNavList mobile onNavigate={() => setMoreOpen(false)} />
              ) : null}

              {moreLinks.length > 0 ? (
                <div>
                  <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-text-muted">
                    More Pages
                  </p>
                  <div className="space-y-1.5">
                    {moreLinks.map((item) => {
                      const Icon = getNavIcon(item.icon);
                      const isActive = isNavPathActive(pathname, item.path);
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setMoreOpen(false)}
                          className={clsx(
                            "flex min-h-[52px] items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold",
                            isActive ? "bg-accent/10 text-accent" : "text-text-secondary active:bg-black/5"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                          <ChevronRight className="ml-auto h-4 w-4 opacity-40" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {exclusiveOffers.length > 0 ? (
                <div>
                  <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-accent">
                    Exclusive Offers
                  </p>
                  <div className="space-y-1.5">
                    {exclusiveOffers.map((offer) => (
                      <a
                        key={offer.href + offer.title}
                        href={offer.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[52px] items-center gap-3 rounded-xl border border-accent/25 bg-accent/5 px-4 py-3 text-base font-semibold text-text-secondary active:bg-accent/10"
                      >
                        <Sparkles className="h-5 w-5 text-accent" />
                        <span className="flex-1">{offer.title}</span>
                        <ExternalLink className="h-4 w-4 text-accent" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="space-y-3 border-t border-black/10 pt-4">
                <Link
                  href="/support"
                  onClick={() => setMoreOpen(false)}
                  className="flex min-h-[52px] items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-text-secondary active:bg-black/5"
                >
                  <Headphones className="h-5 w-5" />
                  Contact Support
                  {support.email ? (
                    <span className="ml-auto text-xs text-text-muted truncate max-w-[120px]">{support.email}</span>
                  ) : null}
                </Link>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="flex min-h-[52px] w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-red-400/80 active:bg-red-500/5"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
