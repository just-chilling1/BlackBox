"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Megaphone, Globe } from "lucide-react";
import { getAppUrl } from "@/lib/brand-vars";
import { getSiteTerritory } from "@/features/blog-builder/lib/site-territory";
import type { SiteVaultSummary } from "@/app/api/blog/site/route";
import type { BlogSite } from "@/features/blog-builder/types";
import type { PublishKitSite } from "../types";
import { PublishKitPanel } from "../components/PublishKitPanel";

function toPublishKitSite(site: BlogSite, siteUrl: string): PublishKitSite {
  const affiliate = site.armed_links?.[0];
  return {
    siteId: site.id,
    siteName: site.title,
    siteUrl,
    territory: getSiteTerritory(site),
    tagline: site.tagline,
    affiliateLink: affiliate?.url,
    affiliateLabel: affiliate?.label,
    status: site.status,
  };
}

export default function PromotePage() {
  const [summaries, setSummaries] = useState<SiteVaultSummary[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<BlogSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetch("/api/blog/site", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.summaries) ? data.summaries : [];
        setSummaries(list);
        if (list.length === 1) {
          void loadSite(list[0].site.id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const loadSite = async (siteId: string) => {
    setSelectedSiteId(siteId);
    setDetailLoading(true);
    setSelectedSite(null);

    try {
      const res = await fetch(`/api/blog/site?siteId=${encodeURIComponent(siteId)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load site");
      setSelectedSite(data.site as BlogSite);
    } finally {
      setDetailLoading(false);
    }
  };

  const siteUrl = useMemo(() => {
    if (!selectedSite) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : getAppUrl();
    return `${origin}/sites/${selectedSite.slug}`;
  }, [selectedSite]);

  const kitSite = useMemo(() => {
    if (!selectedSite) return null;
    return toPublishKitSite(selectedSite, siteUrl);
  }, [selectedSite, siteUrl]);

  if (loading) {
    return (
      <div className="page-stack w-full">
        <p className="text-text-muted text-base animate-pulse">Loading your websites...</p>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="page-stack w-full">
        <PageHeader />
        <div className="rounded-xl border border-dashed border-white/15 p-10 text-center flex flex-col items-center gap-4">
          <Globe className="text-text-muted" size={40} strokeWidth={1.25} />
          <p className="text-text-muted text-sm max-w-md">
            Deploy a website first — then come back here to analyze your product and site, and generate ready-to-copy
            posts for LinkedIn or X.
          </p>
          <Link
            href="/territory"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-promo-accent text-[#0B0C10] text-sm font-bold"
          >
            Pick Your Topic
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack w-full">
      <PageHeader />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,280px)_1fr] gap-6">
        <aside className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Your websites</p>
          {summaries.map((summary) => {
            const active = summary.site.id === selectedSiteId;
            return (
              <button
                key={summary.site.id}
                type="button"
                onClick={() => loadSite(summary.site.id)}
                className={`glass-card p-4 text-left transition-colors ${
                  active ? "border-promo-accent/40 bg-promo-accent/5" : "hover:border-white/20"
                }`}
              >
                <p className="brand-font text-sm text-text-heading truncate">{summary.site.title}</p>
                <p className="text-xs text-text-muted mt-1 truncate">{getSiteTerritory(summary.site)}</p>
                <p className="text-[11px] text-text-muted mt-2 capitalize">{summary.site.status}</p>
              </button>
            );
          })}
        </aside>

        <section className="flex flex-col gap-4 min-w-0">
          {!selectedSiteId ? (
            <div className="glass-card p-8 text-center text-text-muted text-sm">
              Select a website on the left to analyze your product and generate social posts.
            </div>
          ) : detailLoading ? (
            <p className="text-text-muted text-sm animate-pulse">Loading site details...</p>
          ) : kitSite ? (
            <PublishKitPanel site={kitSite} />
          ) : null}
        </section>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent flex items-center gap-2">
        <Megaphone size={14} />
        Platform promotion
      </p>
      <h1 className="brand-font text-2xl sm:text-3xl text-text-heading tracking-tight">Promotion kit</h1>
      <p className="text-text-secondary text-base max-w-2xl leading-relaxed">
        Analyze your product and website, then generate 10 ready-to-copy posts for LinkedIn or X.
      </p>
    </div>
  );
}
