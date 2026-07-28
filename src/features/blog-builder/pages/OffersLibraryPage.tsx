"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  FolderOpen,
  Globe,
  Megaphone,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { ThreadCard } from "@/features/publish-kit/components/ThreadCard";
import { ThreadListSection } from "@/features/publish-kit/components/ThreadListSection";
import { getAppUrl } from "@/lib/brand-vars";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { EmptyState } from "@/components/ui/empty-state";
import { getSiteTerritory } from "@/features/blog-builder/lib/site-territory";
import type { SiteVaultSummary } from "@/app/api/blog/site/route";
import type { SavedXThread } from "@/features/publish-kit/lib/x-threads-vault";

function OfferCard({
  summary,
  siteUrl,
  threads,
  loadingThreads,
  onExpand,
  expanded,
}: {
  summary: SiteVaultSummary;
  siteUrl: string;
  threads: SavedXThread[];
  loadingThreads: boolean;
  onExpand: () => void;
  expanded: boolean;
}) {
  const { site, xThreadCount = 0 } = summary;
  const territory = getSiteTerritory(site);
  const affiliate = site.armed_links?.[0];
  const hasThreads = xThreadCount > 0;

  return (
    <article className="glass-card overflow-hidden">
      <button
        type="button"
        onClick={onExpand}
        className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-slate-50"
      >
        <div
          className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-lg ${
            site.status === "live" ? "bg-promo-accent/15 text-promo-accent" : "bg-accent/10 text-accent"
          }`}
        >
          <FolderOpen size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="brand-font text-lg text-text-heading">{site.title}</h3>
          {site.tagline && <p className="mt-0.5 text-sm text-text-secondary line-clamp-2">{site.tagline}</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-accent-muted/20 px-2 py-0.5 text-[10px] font-medium text-accent-muted">
              {territory}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                site.status === "live" ? "bg-success/20 text-success" : "bg-black/10 text-text-muted"
              }`}
            >
              {site.status}
            </span>
            <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-medium text-text-muted">
              {hasThreads ? `${xThreadCount}-post thread saved` : "No story thread yet"}
            </span>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-border-dim px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {siteUrl && (
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-dim bg-slate-100 px-3 py-2 text-xs font-medium text-text-heading hover:bg-slate-200/70"
              >
                <Globe size={14} />
                View sales page
                <ExternalLink size={12} />
              </a>
            )}
            {affiliate?.url && (
              <a
                href={affiliate.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-dim bg-slate-100 px-3 py-2 text-xs font-medium text-text-heading hover:bg-slate-200/70"
              >
                <ExternalLink size={14} />
                {affiliate.label || "Affiliate link"}
              </a>
            )}
            <Link
              href={`/promote?siteId=${encodeURIComponent(site.id)}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-promo-accent px-3 py-2 text-xs font-semibold text-[#0B0C10] hover:brightness-110"
            >
              <Megaphone size={14} />
              {hasThreads ? "Regenerate story thread" : "Generate story thread"}
            </Link>
          </div>

          {loadingThreads ? (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Loader2 size={14} className="animate-spin" />
              Loading threads...
            </div>
          ) : threads.length > 0 ? (
            <ThreadListSection title="Story thread" count={threads.length}>
              {threads.map((thread, i) => (
                <ThreadCard
                  key={thread.id}
                  index={i + 1}
                  label={`Post ${i + 1} · ${thread.angle || "Post"}`}
                  text={thread.text}
                  imageUrl={thread.image_url}
                  defaultOpen={i === 0}
                />
              ))}
            </ThreadListSection>
          ) : (
            <p className="text-sm text-text-secondary">
              No story thread saved for this offer yet. Open X-Power Promotions to generate one.
            </p>
          )}
        </div>
      )}
    </article>
  );
}

export default function OffersLibraryPage() {
  const [summaries, setSummaries] = useState<SiteVaultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [threadsBySite, setThreadsBySite] = useState<Record<string, SavedXThread[]>>({});
  const [loadingThreadsId, setLoadingThreadsId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/blog/site", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setSummaries(Array.isArray(data.summaries) ? data.summaries : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : getAppUrl();

  const siteUrls = useMemo(() => {
    const map: Record<string, string> = {};
    for (const summary of summaries) {
      map[summary.site.id] = `${origin}/sites/${summary.site.slug}`;
    }
    return map;
  }, [summaries, origin]);

  const loadThreads = async (siteId: string) => {
    if (threadsBySite[siteId]) return;
    setLoadingThreadsId(siteId);
    try {
      const res = await fetch(`/api/blog/site?siteId=${encodeURIComponent(siteId)}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok && Array.isArray(data.xThreads)) {
        setThreadsBySite((prev) => ({ ...prev, [siteId]: data.xThreads as SavedXThread[] }));
      }
    } finally {
      setLoadingThreadsId(null);
    }
  };

  const toggleExpand = (siteId: string) => {
    if (expandedId === siteId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(siteId);
    void loadThreads(siteId);
  };

  if (loading) {
    return <PageLoading message="Loading your offers..." />;
  }

  if (summaries.length === 0) {
    return (
      <div className="page-stack w-full max-w-4xl mx-auto">
        <PageHeader
          eyebrow="Offers library"
          title="Your generated sales offers"
          subtitle="Every launched sales page lives here with its saved X promotion threads."
        />
        <EmptyState
          icon={FolderOpen}
          title="No offers yet"
          description="Run the Sales Offer Generator to create your first sales page, then come back here to view it and its X threads."
          action={{ label: "Start Sales Offer Generator", href: "/sales-offer-generator" }}
        />
      </div>
    );
  }

  return (
    <div className="page-stack w-full max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Offers library"
        title="Your generated sales offers"
        subtitle="Browse every sales page you launched. Expand an offer to view its saved X threads or generate new ones."
      />

      <div className="space-y-4">
        {summaries.map((summary) => (
          <OfferCard
            key={summary.site.id}
            summary={summary}
            siteUrl={siteUrls[summary.site.id] ?? ""}
            threads={threadsBySite[summary.site.id] ?? []}
            loadingThreads={loadingThreadsId === summary.site.id}
            expanded={expandedId === summary.site.id}
            onExpand={() => toggleExpand(summary.site.id)}
          />
        ))}
      </div>
    </div>
  );
}
