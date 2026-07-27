"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Megaphone, Globe } from "lucide-react";
import { getAppUrl } from "@/lib/brand-vars";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { EmptyState } from "@/components/ui/empty-state";
import { getSiteTerritory } from "@/features/blog-builder/lib/site-territory";
import type { SiteVaultSummary } from "@/app/api/blog/site/route";
import type { BlogSite } from "@/features/blog-builder/types";
import type { PublishKitSite } from "../types";
import { PublishKitPanel } from "../components/PublishKitPanel";
import { THREADS_PER_GENERATION } from "../lib/promote-constants";

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

function offerLabel(summary: SiteVaultSummary): string {
  const title = summary.site.title || getSiteTerritory(summary.site);
  if (summary.xThreadCount > 0) {
    return `${title} (${summary.xThreadCount} threads)`;
  }
  return title;
}

export default function PromotePage() {
  const searchParams = useSearchParams();
  const initialSiteId = searchParams.get("siteId");
  const [summaries, setSummaries] = useState<SiteVaultSummary[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedSite, setSelectedSite] = useState<BlogSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadSite = useCallback(async (siteId: string) => {
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
  }, []);

  useEffect(() => {
    fetch("/api/blog/site", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.summaries) ? data.summaries : [];
        setSummaries(list);
        if (list.length === 0) return;

        const preferredId =
          initialSiteId && list.some((s: SiteVaultSummary) => s.site.id === initialSiteId)
            ? initialSiteId
            : list[0].site.id;

        void loadSite(preferredId);
      })
      .finally(() => setLoading(false));
  }, [initialSiteId, loadSite]);

  const selectedSummary = useMemo(
    () => summaries.find((s) => s.site.id === selectedSiteId),
    [summaries, selectedSiteId]
  );

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
    return <PageLoading message="Loading your websites..." />;
  }

  if (summaries.length === 0) {
    return (
      <div className="page-stack w-full max-w-4xl mx-auto">
        <PageHeader
          eyebrow="X-Power Promotions"
          title="Generate X threads"
          subtitle="Analyze your product and website, then generate ready-to-copy X threads."
        />
        <EmptyState
          icon={Globe}
          title="No offers to promote yet"
          description="Launch a sales offer first — then come back here to generate X promotion threads."
          action={{ label: "Start Sales Offer Generator", href: "/sales-offer-generator" }}
        />
      </div>
    );
  }

  return (
    <div className="page-stack w-full max-w-4xl mx-auto">
      <PageHeader
        eyebrow="X-Power Promotions"
        title="Generate X threads"
        subtitle={`Analyze your product and website, then generate ${THREADS_PER_GENERATION} ready-to-copy X threads.`}
      />

      <section className="glass-card space-y-5 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-promo-accent/15 text-promo-accent">
            <Megaphone size={22} />
          </div>
          <div>
            <p className="font-bold text-text-primary">X thread generator</p>
            <p className="text-sm text-text-secondary">
              Pick an offer, analyze your product, and generate ready-to-copy threads.
            </p>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-text-primary">Select offer</span>
          <select
            value={selectedSiteId}
            onChange={(e) => {
              if (e.target.value) void loadSite(e.target.value);
            }}
            className="input-base w-full"
          >
            {summaries.map((summary) => (
              <option key={summary.site.id} value={summary.site.id}>
                {offerLabel(summary)}
              </option>
            ))}
          </select>
        </label>

        {selectedSummary && (
          <p className="text-xs text-text-muted">
            Niche: {getSiteTerritory(selectedSummary.site)}
            {selectedSummary.site.armed_links?.[0]?.url
              ? " · Link armed"
              : " · Add a link in Links Library for best results"}
            {selectedSummary.xThreadCount > 0
              ? ` · ${selectedSummary.xThreadCount} saved threads`
              : ""}
          </p>
        )}
      </section>

      <section className="min-w-0">
        {detailLoading ? (
          <PageLoading message="Loading site details..." className="max-w-none" />
        ) : kitSite ? (
          <PublishKitPanel site={kitSite} />
        ) : null}
      </section>
    </div>
  );
}
