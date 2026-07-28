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
            className={clsx("tab-pill", isActive && "is-active")}
          >
            <Icon size={14} className={isActive ? "text-amber-800" : "text-text-muted"} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
