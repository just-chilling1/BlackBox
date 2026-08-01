"use client";

import { motion } from "framer-motion";
import { Globe, Link2 } from "lucide-react";
import type { BlogSite } from "../types";

interface DeploySitePreviewProps {
  site: BlogSite;
}

export function DeploySitePreview({ site }: DeploySitePreviewProps) {
  const armedCount = site.armed_links?.length ?? 0;
  const publicPath = `/sites/${site.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-w-0 max-w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-amber-100 sm:p-6"
    >
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-readable">
        Cash asset initialized
      </p>
      <h2 className="brand-font text-xl tracking-tight text-text-heading sm:text-2xl">{site.title}</h2>
      {site.tagline && <p className="mt-1 text-sm text-text-secondary">{site.tagline}</p>}

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 font-semibold text-accent-readable">
          <Globe size={14} aria-hidden />
          Topic: {site.hobby}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-text-secondary">
          <Link2 size={14} className="text-accent-readable" aria-hidden />
          {armedCount} product link{armedCount === 1 ? "" : "s"}
        </span>
        <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-text-secondary">
          {publicPath}
        </span>
      </div>
    </motion.div>
  );
}
