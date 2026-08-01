"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Megaphone, Globe } from "lucide-react";
import { getAppUrl } from "@/lib/brand-vars";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getSiteTerritory } from "@/features/blog-builder/lib/site-territory";
import type { SiteVaultSummary } from "@/app/api/blog/site/route";
import type { BlogSite } from "@/features/blog-builder/types";
import type { PublishKitSite } from "../types";
import { PublishKitPanel } from "../components/PublishKitPanel";
import { THREADS_PER_GENERATION } from "../lib/promote-constants";
import { cachedClientFetch } from "@/lib/client-fetch-cache";

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
    return `${title} (${summary.xThreadCount}-post thread)`;
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

  useEffect(() => {
    let cancelled = false;

    void cachedClientFetch<{ summaries?: SiteVaultSummary[] }>("/api/blog/site?lite=1")
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data.summaries) ? data.summaries : [];
        setSummaries(list);
        if (list.length === 0) return;

        const preferredId =
          initialSiteId && list.some((s) => s.site.id === initialSiteId)
            ? initialSiteId
            : list[0].site.id;

        const summary = list.find((s) => s.site.id === preferredId);
        setSelectedSiteId(preferredId);
        if (summary) setSelectedSite(summary.site);
      })
      .catch(() => {
        if (!cancelled) setSummaries([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialSiteId]);

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

  const selectSite = (siteId: string) => {
    setSelectedSiteId(siteId);
    const summary = summaries.find((s) => s.site.id === siteId);
    setSelectedSite(summary?.site ?? null);
  };

  if (loading) {
    return (
      <div className="page-container">
        <PageHeader
          eyebrow="X-Power Promotions"
          title="Generate X story thread"
          subtitle={`Analyze your product and website, then generate a ${THREADS_PER_GENERATION}-post X story thread.`}
        />
        <section className="glass-card space-y-5 p-4 sm:p-6 md:p-8">
          <PageSkeleton cards={1} className="mt-0" />
        </section>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
          eyebrow="X-Power Promotions"
          title="Generate X story thread"
          subtitle="Analyze your product and website, then generate a ready-to-copy story thread."
        />
        <EmptyState
          icon={Globe}
          title="No offers to promote yet"
          description="Launch a sales offer first — then come back here to generate your X story thread."
          action={{ label: "Start Sales Offer Generator", href: "/sales-offer-generator" }}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        eyebrow="X-Power Promotions"
        title="Generate X story thread"
        subtitle={`Analyze your product and website, then generate a ${THREADS_PER_GENERATION}-post X story thread.`}
      />

      <section className="glass-card space-y-5 p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brass-100 text-brass-700">
            <Megaphone size={22} />
          </div>
          <div>
            <p className="font-medium text-text-primary">X story thread generator</p>
            <p className="text-sm text-text-secondary">
              Pick an offer, analyze your product, and generate a 10-post story thread.
            </p>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-text-primary">Select offer</span>
          <select
            value={selectedSiteId}
            onChange={(e) => {
              if (e.target.value) selectSite(e.target.value);
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
              ? ` · ${selectedSummary.xThreadCount}-post thread saved`
              : ""}
          </p>
        )}
      </section>

      <section className="min-w-0">
        {kitSite ? <PublishKitPanel site={kitSite} /> : null}
      </section>
    </div>
  );
}
