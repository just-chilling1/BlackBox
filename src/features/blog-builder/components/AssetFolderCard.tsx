"use client";

import Link from "next/link";
import { FolderOpen, Globe, MousePointerClick, FileText, Facebook, Eye } from "lucide-react";
import { getSiteTerritory } from "../lib/site-territory";
import type { BlogSite } from "../types";

export interface SiteVaultSummary {
  site: BlogSite;
  postCount: number;
  livePostCount: number;
  clickCount: number;
  facebookPostCount?: number;
}

interface AssetFolderCardProps {
  summary: SiteVaultSummary;
  isActive: boolean;
  onOpen: () => void;
}

function formatCreatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AssetFolderCard({ summary, isActive, onOpen }: AssetFolderCardProps) {
  const { site, postCount, livePostCount, clickCount, facebookPostCount = 0 } = summary;
  const territory = getSiteTerritory(site);
  const isLive = site.status === "live";
  const viewHref = `/sites/${site.slug}`;

  return (
    <div
      className={`group relative rounded-xl border p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--glow-teal)] ${
        isActive
          ? "border-[#45A29E]/45 bg-[#45A29E]/8"
          : "border-white/10 glass-tile hover:border-[#45A29E]/35"
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#45A29E]/50 rounded-lg -m-1 p-1"
        >
          <div className="flex items-start gap-3">
            <div
              className={`shrink-0 w-11 h-11 rounded-lg flex items-center justify-center ${
                isLive
                  ? "bg-[#45A29E]/15 text-[#45A29E]"
                  : "bg-[#D4AF37]/10 text-[#D4AF37]"
              }`}
            >
              <FolderOpen size={22} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1 pr-8 sm:pr-0">
                <h3 className="brand-font text-base text-text-heading truncate">{site.title}</h3>
                {site.template_key ? (
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#D4AF37] px-1.5 py-0.5 rounded border border-[#D4AF37]/30 bg-[#D4AF37]/5">
                    Premium
                  </span>
                ) : (
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#45A29E]/80 px-1.5 py-0.5 rounded border border-[#45A29E]/25">
                    Generated
                  </span>
                )}
                {isActive && (
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#45A29E] px-1.5 py-0.5 rounded border border-[#45A29E]/30">
                    Latest
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{territory}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
            <span
              className={
                isLive ? "status-pill-active text-[10px]" : "status-pill-muted text-[10px]"
              }
            >
              {site.status}
            </span>
            <span className="inline-flex items-center gap-1">
              <FileText size={12} />
              {postCount} articles
              {livePostCount > 0 && livePostCount !== postCount ? ` · ${livePostCount} live` : ""}
            </span>
            {facebookPostCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Facebook size={12} />
                {facebookPostCount} FB posts
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <MousePointerClick size={12} />
              {clickCount} clicks
            </span>
            <span className="inline-flex items-center gap-1 ml-auto">
              <Globe size={12} />
              {formatCreatedAt(site.created_at)}
            </span>
          </div>
        </button>

        {isLive ? (
          <Link
            href={viewHref}
            target="_blank"
            rel="noopener noreferrer"
            title="View website"
            aria-label={`View ${site.title}`}
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#45A29E]/35 bg-[#45A29E]/10 text-[#45A29E] hover:bg-[#45A29E]/20 hover:border-[#45A29E]/50 transition-colors"
          >
            <Eye size={18} strokeWidth={2} />
          </Link>
        ) : (
          <span
            title="Publish your site to view it live"
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-text-muted opacity-50 cursor-not-allowed"
            aria-hidden
          >
            <Eye size={18} strokeWidth={2} />
          </span>
        )}
      </div>
    </div>
  );
}
