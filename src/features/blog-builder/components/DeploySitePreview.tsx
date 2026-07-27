"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, Link2, Eye } from "lucide-react";
import type { BlogSite } from "../types";

interface DeploySitePreviewProps {
  site: BlogSite;
  showLiveLink?: boolean;
}

export function DeploySitePreview({ site, showLiveLink = false }: DeploySitePreviewProps) {
  const armedCount = site.armed_links?.length ?? 0;
  const publicPath = `/sites/${site.slug}`;
  const isLive = site.status === "live";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-w-0 max-w-full rounded-xl border border-accent/35 bg-gradient-to-br from-accent/8 to-transparent p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2">
          Cash asset initialized
        </p>
        {isLive && (
          <Link
            href={publicPath}
            target="_blank"
            rel="noopener noreferrer"
            title="View website"
            aria-label={`View ${site.title}`}
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-promo-accent/35 bg-promo-accent/10 text-promo-accent hover:bg-promo-accent/20 transition-colors -mt-1"
          >
            <Eye size={18} strokeWidth={2} />
          </Link>
        )}
      </div>
      <h2 className="brand-font text-xl sm:text-2xl text-text-secondary tracking-tight">{site.title}</h2>
      {site.tagline && <p className="text-sm text-text-muted mt-1">{site.tagline}</p>}

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-promo-accent/30 bg-promo-accent/10 px-3 py-1.5 text-promo-accent">
          <Globe size={14} />
          Topic: {site.hobby}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border-dim bg-page px-3 py-1.5 text-text-secondary">
          <Link2 size={14} className="text-accent" />
          {armedCount} product link{armedCount === 1 ? "" : "s"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border-dim bg-page px-3 py-1.5 text-text-muted font-mono truncate max-w-full">
          {publicPath}
        </span>
      </div>

      {showLiveLink && isLive && (
        <Link
          href={publicPath}
          target="_blank"
          rel="noopener noreferrer"
          title="View website"
          aria-label={`View ${site.title}`}
          className="mt-4 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-promo-accent/40 bg-promo-accent/10 px-5 py-3 text-sm font-semibold text-promo-accent transition-colors hover:bg-promo-accent/15"
        >
          <Eye size={16} />
          View live questionnaire
        </Link>
      )}
    </motion.div>
  );
}
