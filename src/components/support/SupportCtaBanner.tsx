"use client";

import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";
import { clsx } from "clsx";
import { support, supportRoutes } from "@/config/support.config";

interface SupportCtaBannerProps {
  className?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  href?: string;
}

export function SupportCtaBanner({
  className,
  title = "Need help with your account?",
  description = "Our support team is here if something looks off.",
  ctaLabel = support.ctaLabel,
  href = supportRoutes.contact,
}: SupportCtaBannerProps) {
  return (
    <section
      className={clsx(
        "accent-card relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-white via-white to-amber-50/60 shadow-sm",
        className
      )}
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/15 text-accent shadow-gold">
            <Headphones size={22} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-text-heading sm:text-lg">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{description}</p>
          </div>
        </div>

        <Link
          href={href}
          className="btn-primary-prominent w-full shrink-0 sm:w-auto normal-case tracking-normal text-sm font-semibold px-6"
        >
          {ctaLabel}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
