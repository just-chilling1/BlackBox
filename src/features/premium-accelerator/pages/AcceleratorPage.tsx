"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Rocket,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  Loader2,
  Filter,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { brand } from "@/config/brand.config";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { GenerationProgress, GENERATION_RESULTS_ID } from "@/components/ui/generation-progress";
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
  clonedSiteUrl: string | null;
  hasAffiliateLink: boolean;
  onClone: (id: number) => void;
}

const TemplateCard = memo(function TemplateCard({
  template,
  cloningId,
  clonedSiteUrl,
  hasAffiliateLink,
  onClone,
}: TemplateCardProps) {
  const isCloning = cloningId === template.id;
  const isCloned = Boolean(clonedSiteUrl);

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
      {isCloned ? (
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={clonedSiteUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-2 text-sm"
          >
            View offer
            <ExternalLink size={14} />
          </Link>
          <Link
            href="/offers"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-divider bg-white px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
          >
            <FolderOpen size={14} />
            Offers Library
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <button
          type="button"
          disabled={!template.seeded || isCloning || !hasAffiliateLink}
          onClick={() => onClone(template.id)}
          className="btn-primary mt-auto inline-flex items-center justify-center gap-2 text-sm disabled:opacity-40"
        >
          {isCloning ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Copy size={14} />
          )}
          Use this template
        </button>
      )}
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
  const [cloneResult, setCloneResult] = useState<{ catalogId: number; siteUrl: string } | null>(null);
  const [error, setError] = useState("");

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
    setCloneResult(null);
    try {
      const res = await fetch("/api/premium/accelerator/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalogId, affiliateUrl: affiliateLink.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Clone failed");
      setCloneResult({ catalogId, siteUrl: data.siteUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Clone failed");
    } finally {
      setCloningId(null);
    }
  }, [affiliateLink]);

  if (loading && templates.length === 0) {
    return (
      <div className="page-stack max-w-6xl">
        <PageHeader
          eyebrow="Premium"
          title="Accelerator"
          subtitle="200 pre-made sales pages + 10-post X story threads with niche images."
        />
        <PageSkeleton cards={6} className="max-w-6xl" />
      </div>
    );
  }

  return (
    <div className="page-stack max-w-6xl">
      <PageHeader
        eyebrow="Premium"
        title="Accelerator"
        subtitle={`${seededCount} of 200 pre-made sales pages + story threads across every niche. Each clone includes a 10-post thread with images on posts 1, 4, and 7.`}
      />

      <section className="glass-card overflow-hidden p-0">
        <div className="border-b border-divider bg-accent/5 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <Rocket size={24} />
              </div>
              <div>
                <p className="font-bold text-text-primary">200 Sales Pages + Story Threads</p>
                <p className="text-sm text-text-secondary">
                  Each template includes a ready-made 10-post X story thread with niche images — clone instantly with your link.
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
                className={clsx("select-chip-pill", niche === n && "is-selected")}
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

        </div>
      </section>

      <GenerationProgress
        active={cloningId !== null}
        label="Cloning pre-made sales page with your affiliate link..."
      />

      <div id={GENERATION_RESULTS_ID} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 scroll-mt-24">
        {visibleTemplates.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            cloningId={cloningId}
            clonedSiteUrl={
              cloneResult?.catalogId === t.id ? cloneResult.siteUrl : null
            }
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
    </div>
  );
}
