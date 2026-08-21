"use client";

import { memo } from "react";
import {
  Copy,
  ExternalLink,
  Eye,
  Loader2,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { resolvePublicUrl } from "@/lib/app-url";

export interface VaultTemplateRow {
  id: number;
  niche: string;
  productName: string;
  templateName: string;
  seeded: boolean;
  accent: string;
  hook: string;
  toneLabel: string;
  themeLabel?: string;
  colorTheme?: string;
  variationId?: string;
  used?: boolean;
  usedAssetId?: string | null;
  usedSiteUrl?: string | null;
  usedAt?: string | null;
}

interface VaultTemplateCardProps {
  template: VaultTemplateRow;
  cloningId: number | null;
  viewingId: number | null;
  clonedSiteUrl: string | null;
  clonedAssetId: string | null;
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
  const sitePath = clonedSiteUrl || template.usedSiteUrl || null;
  const liveSiteUrl = sitePath ? resolvePublicUrl(sitePath) : null;
  const isCloned = Boolean(liveSiteUrl);

  return (
    <article
      className={clsx(
        "glass-card flex flex-col gap-3 p-4 transition-colors hover:border-[var(--np-line-pulse)] [content-visibility:auto] [contain-intrinsic-size:auto_180px]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13px] font-medium uppercase tracking-wider text-pulse-700">
            {template.niche}
          </p>
          <h3 className="mt-1 line-clamp-2 font-medium text-text-primary">{template.productName}</h3>
          <p className="mt-1 text-xs text-text-muted">{template.templateName}</p>
        </div>
        {!template.seeded ? (
          <span className="shrink-0 rounded bg-pulse-100 px-2 py-0.5 text-[13px] text-text-muted">
            Pending
          </span>
        ) : null}
      </div>

      {isCloned && liveSiteUrl ? (
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={liveSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-2 text-sm"
          >
            View offer
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
            disabled={!template.seeded || isViewing}
            onClick={() => onView(template.id)}
            className="btn-secondary inline-flex items-center justify-center gap-2 text-sm disabled:opacity-40"
          >
            {isViewing ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
            View
          </button>
          <button
            type="button"
            disabled={!template.seeded || isCloning || !hasAffiliateLink}
            onClick={() => onClone(template.id)}
            className="btn-primary inline-flex items-center justify-center gap-2 text-sm disabled:opacity-40"
          >
            {isCloning ? <Loader2 size={14} className="animate-spin" /> : <Copy size={14} />}
            Use this template
          </button>
        </div>
      )}
    </article>
  );
});
