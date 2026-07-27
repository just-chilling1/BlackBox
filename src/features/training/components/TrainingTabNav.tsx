"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, HelpCircle } from "lucide-react";
import { clsx } from "clsx";
import { trainingRoutes } from "@/config/training.config";

const tabs = [
  { href: trainingRoutes.videos, label: "Training Videos", icon: Play },
  { href: trainingRoutes.faq, label: "FAQ", icon: HelpCircle },
] as const;

export function TrainingTabNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="Training sections">
      {tabs.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all",
              isActive
                ? "bg-accent text-text-on-accent shadow-[0_0_20px_color-mix(in_srgb,var(--brand-primary)_25%,transparent)]"
                : "border border-border-dim/40 bg-surface/40 text-text-primary hover:border-accent/30 hover:bg-accent/5"
            )}
          >
            <Icon size={14} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
