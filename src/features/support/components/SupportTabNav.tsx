"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Headphones, HelpCircle } from "lucide-react";
import { clsx } from "clsx";
import { supportRoutes } from "@/config/support.config";

const tabs = [
  { href: supportRoutes.contact, label: "Contact Support", icon: Headphones },
  { href: supportRoutes.faq, label: "FAQ", icon: HelpCircle },
] as const;

function isTabActive(pathname: string, href: string) {
  if (href === supportRoutes.faq) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  return pathname === href;
}

export function SupportTabNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-6 flex flex-wrap gap-3 border-b border-border-dim"
      aria-label="Support sections"
    >
      {tabs.map(({ href, label, icon: Icon }) => {
        const isActive = isTabActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "relative -mb-px inline-flex items-center gap-2 rounded-t-lg px-5 py-2.5 text-[11px] uppercase tracking-[0.12em] transition-all",
              isActive
                ? "border-b-2 border-accent bg-surface font-bold text-accent-readable shadow-sm"
                : "border-b-2 border-transparent font-medium text-text-muted hover:bg-surface/60 hover:text-text-secondary"
            )}
          >
            <Icon size={14} className={isActive ? "text-accent" : "text-text-muted"} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
