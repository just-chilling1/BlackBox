"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Filter,
  Sparkles,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { brand } from "@/config/brand.config";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { ACCELERATOR_NICHES } from "@/features/premium-accelerator/lib/catalog";

const PAGE_SIZE = 24;
const AFFILIATE_STORAGE_KEY = `${brand.storagePrefix}_accelerator_affiliate`;
const SEED_POLL_MS = 15_000;

interface TemplateRow {
  id: number;
  niche: string;
  productName: string;
  templateName: string;
  seeded: boolean;
}

interface TemplateCardProps {
  template: TemplateRow;
  cloningId: number | null;
  copiedId: number | null;
  hasAffiliateLink: boolean;
  onClone: (id: number) => void;
}

const TemplateCard = memo(function TemplateCard({
  template,
  cloningId,
  copiedId,
  hasAffiliateLink,
  onClone,
}: TemplateCardProps) {
  const isCloning = cloningId === template.id;
  const isCopied = copiedId === template.id;

  return (
    <article
      className="glass-card flex flex-col gap-3 p-4 transition-colors hover:border-accent/20 [content-visibility:auto] [contain-intrinsic-size:auto_180px]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-accent">{template.niche}</p>
          <h3 className="mt-1 line-clamp-2 font-bold text-text-primary">{template.productName}</h3>
          <p className="mt-1 text-xs text-text-muted">{template.templateName}</p>
        </div>
        {!template.seeded && (
          <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-[10px] text-text-muted">
            Pending
          </span>
        )}
      </div>
      <button
        type="button"
        disabled={!template.seeded || isCloning || !hasAffiliateLink}
        onClick={() => onClone(template.id)}
        className="btn-primary mt-auto inline-flex items-center justify-center gap-2 text-sm disabled:opacity-40"
      >
        {isCloning ? (
          <Loader2 size={14} className="animate-spin" />
        ) : isCopied ? (
          <Check size={14} />
        ) : (
          <Copy size={14} />
        )}
        {isCopied ? "Cloned!" : "Use this template"}
      </button>
    </article>
  );
});

export default function AcceleratorPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [seededCount, setSeededCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [niche, setNiche] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [cloningId, setCloningId] = useState<number | null>(null);
  const [clonedUrl, setClonedUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AFFILIATE_STORAGE_KEY);
      if (saved) setAffiliateLink(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      if (affiliateLink.trim()) {
        localStorage.setItem(AFFILIATE_STORAGE_KEY, affiliateLink.trim());
      }
    } catch {
      /* ignore */
    }
  }, [affiliateLink]);

  const loadTemplates = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    if (silent) setRefreshing(true);
    else setLoading(true);

    setError("");
    try {
      const res = await fetch("/api/premium/accelerator/templates", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load templates");
      setTemplates(data.templates ?? []);
      setSeededCount(data.seededCount ?? 0);
      setReady(Boolean(data.ready));
      if (data.seedStatusError) {
        setError(data.seedStatusError);
      }
    } catch (e) {
      if (!silent) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  useEffect(() => {
    if (ready) return;
    const timer = window.setInterval(() => void loadTemplates({ silent: true }), SEED_POLL_MS);
    return () => window.clearInterval(timer);
  }, [ready, loadTemplates]);

  const filtered = useMemo(() => {
    return templates.filter((t) => niche === "All" || t.niche === niche);
  }, [templates, niche]);

  const visibleTemplates = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [niche]);

  const hasAffiliateLink = affiliateLink.trim().length > 0;
  const hasMore = visibleCount < filtered.length;

  const handleClone = useCallback(async (catalogId: number) => {
    if (!affiliateLink.trim()) {
      setError("Enter your affiliate link first.");
      return;
    }
    setCloningId(catalogId);
    setError("");
    setClonedUrl(null);
    try {
      const res = await fetch("/api/premium/accelerator/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalogId, affiliateUrl: affiliateLink.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Clone failed");
      setClonedUrl(data.siteUrl);
      setCopiedId(catalogId);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Clone failed");
    } finally {
      setCloningId(null);
    }
  }, [affiliateLink]);

  if (loading && templates.length === 0) {
    return <PageLoading message="Loading Accelerator templates..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-stack max-w-6xl"
    >
      <PageHeader
        eyebrow="Premium"
        title="Accelerator"
        subtitle={`${seededCount} of 200 pre-made sales pages + X threads across every niche. Pick a template, add your link, and deploy — nothing regenerates on access.`}
      />

      <section className="glass-card overflow-hidden p-0">
        <div className="border-b border-divider bg-accent/5 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <Rocket size={24} />
              </div>
              <div>
                <p className="font-bold text-text-primary">200 Sales Pages + X Threads</p>
                <p className="text-sm text-text-secondary">
                  Templates are generated once and stored — your picks clone instantly.
                </p>
              </div>
            </div>
            {!ready && (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
                {refreshing && <Loader2 size={12} className="animate-spin" />}
                Seeding in progress ({seededCount}/200)
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4 p-6 md:p-8">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <LinkIcon size={14} className="text-accent" />
              Your affiliate link
            </span>
            <input
              type="url"
              value={affiliateLink}
              onChange={(e) => setAffiliateLink(e.target.value)}
              placeholder="https://..."
              className="input-base w-full"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <Filter size={14} className="text-text-muted" />
            {["All", ...ACCELERATOR_NICHES].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNiche(n)}
                className={clsx(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  niche === n
                    ? "bg-accent text-black"
                    : "bg-slate-100 text-text-secondary hover:bg-slate-200/70"
                )}
              >
                {n}
              </button>
            ))}
          </div>

          <p className="text-xs text-text-muted">
            Showing {visibleTemplates.length} of {filtered.length} template{filtered.length !== 1 ? "s" : ""}
            {filtered.length !== templates.length ? ` (${templates.length} total)` : ""}
          </p>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}

          {clonedUrl && (
            <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-emerald-900">
                <Sparkles size={16} className="shrink-0 text-emerald-700" />
                <span className="font-semibold">Offer cloned with X threads!</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={clonedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition-all hover:bg-emerald-800 active:scale-[0.98]"
                >
                  View offer
                  <ExternalLink size={14} />
                </Link>
                <Link
                  href="/offers"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-800 transition-all hover:bg-emerald-100 active:scale-[0.98]"
                >
                  <FolderOpen size={14} />
                  Offers Library
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTemplates.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            cloningId={cloningId}
            copiedId={copiedId}
            hasAffiliateLink={hasAffiliateLink}
            onClone={handleClone}
          />
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <p className="text-center text-sm text-text-muted">No templates match this filter.</p>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="btn-secondary px-6 py-2 text-sm"
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}

      <p className="text-xs text-text-muted">
        Powered by {brand.productName}. Accelerator templates are seeded once via admin — members always clone stored copies.
      </p>
    </motion.div>
  );
}
