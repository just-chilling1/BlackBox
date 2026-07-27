"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { PageMotion } from "@/components/motion/PageMotion";

const Sidebar = dynamic(() => import("./Sidebar").then((m) => ({ default: m.Sidebar })), {
  ssr: false,
  loading: () => <div className="hidden w-[var(--sidebar-w)] shrink-0 lg:block" aria-hidden />,
});

const BottomNav = dynamic(() => import("./BottomNav").then((m) => ({ default: m.BottomNav })), {
  ssr: false,
});

const PromoOrchestrator = dynamic(
  () => import("./PromoOrchestrator").then((m) => ({ default: m.PromoOrchestrator })),
  { ssr: false }
);

/** Route prefixes that render without the app shell (public hosted pages). */
const PUBLIC_SHELL_BYPASS_PREFIXES = ["/sites/", "/s/", "/article/", "/review/"];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/") ||
    pathname.startsWith("/auth/");

  const isPublicPage = PUBLIC_SHELL_BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isAuthPage || isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-bg flex min-h-dvh min-w-0 overflow-x-clip">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="mobile-header-glass fixed inset-x-0 top-0 z-40 shrink-0 lg:hidden"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex items-center justify-center px-4 pb-3 pt-2">
            <Link href="/dashboard" className="min-w-0">
              <BrandLogo size="sm" showTagline={false} />
            </Link>
          </div>
        </header>

        <main className="app-main-canvas relative min-w-0 flex-1 overflow-x-clip overflow-y-auto scroll-smooth px-4 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-[calc(var(--mobile-header-h)+env(safe-area-inset-top,0px))] transition-[padding] duration-300 sm:px-6 lg:pb-8 lg:pl-[calc(var(--sidebar-w)+var(--sidebar-gap))] lg:pr-8 lg:pt-8">
          <div className="app-glow-orb app-glow-orb-teal hidden lg:block" aria-hidden />
          <div className="app-glow-orb app-glow-orb-gold hidden lg:block" aria-hidden />

          <div className="app-content-layer mx-auto flex min-h-full w-full min-w-0 max-w-7xl flex-col">
            <PageMotion>{children}</PageMotion>
          </div>
        </main>
      </div>

      <BottomNav />
      <PromoOrchestrator />
    </div>
  );
}
