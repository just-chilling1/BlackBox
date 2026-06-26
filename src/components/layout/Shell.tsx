"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { BrandLogo } from "./BrandLogo";
import {
  GlobalTopPromo,
  GlobalFooterPromo,
  PromoOrchestrator,
} from "./PromoOrchestrator";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/") ||
    pathname.startsWith("/auth/");

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden w-full bg-page">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-border-dim bg-page/95 backdrop-blur-md shrink-0">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-dim text-text-primary hover:bg-white/5"
          >
            <Menu size={20} />
          </button>
          <Link href="/dashboard" className="min-w-0 flex-1" onClick={() => setSidebarOpen(false)}>
            <BrandLogo size="sm" showTagline={false} compact />
          </Link>
          <div className="w-10 shrink-0" aria-hidden />
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth relative">
          <div className="px-4 sm:px-6 md:px-10 lg:px-12 pt-4 sm:pt-6 lg:pt-10 pb-10 sm:pb-12 lg:pb-16 max-w-7xl mx-auto min-h-full flex flex-col w-full">
            <GlobalTopPromo />
            {children}
            <div className="mt-auto pt-10 sm:pt-16">
              <GlobalFooterPromo />
            </div>
          </div>
        </main>
      </div>

      <PromoOrchestrator />
    </div>
  );
}
