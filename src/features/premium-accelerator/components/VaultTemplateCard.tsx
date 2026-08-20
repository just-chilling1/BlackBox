"use client";

import { memo } from "react";
import {
  Copy,
  ExternalLink,
  Eye,
  FolderOpen,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export interface VaultTemplateRow {
  id: number;
  niche: string;
  productName: string;
  templateName: string;
  seeded: boolean;
  accent: string;
  hook: string;
  toneLabel: string;
}

interface VaultTemplateCardProps {
  template: VaultTemplateRow;
  cloningId: number | null;
  viewingId: number | null;
  clonedSiteUrl: string | null;
  hasAffiliateLink: boolean;
  onView: (id: number) => void;
  onClone: (id: number) => void;
}

export const VaultTemplateCard = memo(function VaultTemplateCard({
  template,
  cloningId,
  viewingId,
  clonedSiteUrl,
  hasAffiliateLink,
  onView,
  onClone,
}: VaultTemplateCardProps) {
  const isCloning = cloningId === template.id;
  const isViewing = viewingId === template.id;
  const isCloned = Boolean(clonedSiteUrl);
  const accent = template.accent || "#14B8A6";

  return (
    <article className="vault-asset-card group flex flex-col overflow-hidden [content-visibility:auto] [contain-intrinsic-size:auto_220px]">
      <div
        className="vault-asset-card__hero relative h-24 shrink-0 overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${accent} 0%, color-mix(in srgb, ${accent} 35%, #0B1220) 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-40" aria-hidden>
          <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute bottom-2 left-3 right-3 space-y-1.5">
            <div className="h-1.5 w-2/3 rounded-full bg-white/50" />
            <div className="h-1 w-1/2 rounded-full bg-white/35" />
            <div className="h-1 w-3/5 rounded-full bg-white/25" />
          </div>
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-black/35 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
            {template.niche}
          </span>
          {template.seeded ? (
            <span className="rounded-md bg-[var(--np-success)]/25 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              Live copy
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-pulse-700">{template.templateName}</p>
          <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-text-primary">
            {template.productName}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-text-muted">
            {template.hook}
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wide text-text-muted/80">
            {template.toneLabel}
          </p>
        </div>

        {isCloned ? (
          <div className="mt-auto flex flex-col gap-2">
            <Link
              href={clonedSiteUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 text-sm"
            >
              Open sales page
              <ExternalLink size={14} />
            </Link>
            <Link
              href="/offers"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--np-line)] bg-[var(--np-surface)] px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-[var(--np-line-strong)]"
            >
              <FolderOpen size={14} />
              Offers Library
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="mt-auto flex flex-col gap-2">
            <button
              type="button"
              disabled={isViewing}
              onClick={() => onView(template.id)}
              className="btn-secondary inline-flex items-center justify-center gap-2 text-sm disabled:opacity-40"
            >
              {isViewing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Eye size={14} />
              )}
              Preview
            </button>
            <button
              type="button"
              disabled={isCloning || !hasAffiliateLink}
              onClick={() => onClone(template.id)}
              className="btn-primary inline-flex items-center justify-center gap-2 text-sm disabled:opacity-40"
            >
              {isCloning ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Copy size={14} />
              )}
              Use page
            </button>
          </div>
        )}
      </div>
    </article>
  );
});
