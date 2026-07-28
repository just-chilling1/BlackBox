"use client";

import Link from "next/link";
import { Clock, Star, Shield, Headphones, Mail, ExternalLink } from "lucide-react";
import { clsx } from "clsx";
import { support } from "@/config/support.config";
import { SupportPageLayout } from "../components/SupportPageLayout";

const STAT_ICONS = {
  clock: Clock,
  star: Star,
  shield: Shield,
} as const;

export default function SupportPage() {
  const contactHref = support.contactUrl || `mailto:${support.email}`;

  return (
    <SupportPageLayout>
      <div className="card-base flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <Headphones className="text-accent" size={22} />
          </div>
          <div className="min-w-0">
            <h2 className="brand-font text-lg sm:text-xl text-text-primary mb-1">{support.headline}</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{support.subcopy}</p>
          </div>
        </div>

        <a href={contactHref} className="btn-primary w-full sm:w-fit">
          <Mail size={18} />
          {support.ctaLabel}
        </a>

        <ul className="grid gap-4 sm:grid-cols-3">
          {support.stats.map((stat, index) => {
            const Icon = STAT_ICONS[stat.icon as keyof typeof STAT_ICONS] ?? Star;
            const isPrimary = index === 0;

            return (
              <li
                key={stat.label}
                className={clsx(
                  "flex items-start gap-3 rounded-xl border p-4 text-sm transition-colors",
                  isPrimary
                    ? "border-accent/35 bg-accent/5 ring-1 ring-accent/15 text-text-primary"
                    : "border-border-dim bg-page/50 text-text-secondary"
                )}
              >
                <div
                  className={clsx(
                    "flex shrink-0 items-center justify-center rounded-lg",
                    isPrimary ? "h-10 w-10 bg-accent/15" : "h-8 w-8 bg-slate-100"
                  )}
                >
                  <Icon
                    size={isPrimary ? 20 : 16}
                    className={clsx(isPrimary ? "text-accent-readable" : "text-text-muted")}
                  />
                </div>
                <span className={clsx("leading-snug", isPrimary && "font-medium")}>
                  {isPrimary ? (
                    <>
                      <span className="block text-xs font-bold uppercase tracking-wide text-text-muted mb-0.5">
                        {stat.label.replace(":", "")}
                      </span>
                      {"highlight" in stat && stat.highlight ? (
                        <span className={clsx("text-base font-bold", stat.highlightClass ?? "text-accent-readable")}>
                          {stat.highlight}
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {stat.label}{" "}
                      {"highlight" in stat && stat.highlight ? (
                        <span className={stat.highlightClass ?? "text-accent"}>{stat.highlight}</span>
                      ) : null}
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        {support.helpCenterUrl ? (
          <Link
            href={support.helpCenterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
            Visit help center
            <ExternalLink size={14} />
          </Link>
        ) : null}
      </div>
    </SupportPageLayout>
  );
}
