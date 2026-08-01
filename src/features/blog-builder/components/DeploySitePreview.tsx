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
      className="min-w-0 max-w-full rounded-xl border border-border-dim bg-white p-5 shadow-sm ring-1 ring-brass-100 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="mb-2 text-[13px] font-medium uppercase tracking-[0.2em] text-brass-700">
          Cash asset initialized
        </p>
        {isLive && (
          <Link
            href={publicPath}
            target="_blank"
            rel="noopener noreferrer"
            title="View website"
            aria-label={`View ${site.title}`}
            className="-mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--bb-line-brass)] bg-brass-100 text-brass-700 transition-colors hover:border-[var(--bb-line-brass)] hover:bg-brass-100"
          >
            <Eye size={18} strokeWidth={2} />
          </Link>
        )}
      </div>
      <h2 className="brand-font text-xl tracking-tight text-text-heading sm:text-2xl">{site.title}</h2>
      {site.tagline && <p className="mt-1 text-sm text-text-secondary">{site.tagline}</p>}

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--bb-line-brass)] bg-brass-100 px-3 py-1.5 font-medium text-brass-700">
          <Globe size={14} aria-hidden />
          Topic: {site.hobby}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border-dim bg-canvas px-3 py-1.5 font-medium text-text-secondary">
          <Link2 size={14} className="text-brass-700" aria-hidden />
          {armedCount} product link{armedCount === 1 ? "" : "s"}
        </span>
        <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-lg border border-border-dim bg-canvas px-3 py-1.5 font-mono text-text-secondary">
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
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-grad-brass px-5 py-3 text-sm font-medium text-text-on-accent shadow-brass transition-all hover:brightness-105 sm:w-auto"
        >
          <Eye size={16} aria-hidden />
          View live questionnaire
        </Link>
      )}
    </motion.div>
  );
}
