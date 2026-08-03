"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Megaphone, Globe, Clock, BookmarkCheck, Link2 } from "lucide-react";
import { getAppUrl } from "@/lib/brand-vars";
import { sitePublicPath } from "@/lib/app-url";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PremiumStepsSection } from "@/components/premium/PremiumStepsSection";
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
    return `${title} (${summary.xThreadCount} thread${summary.xThreadCount !== 1 ? "s" : ""} saved)`;
  }
  return title;
}

const WHAT_TO_EXPECT = [
  {
    icon: Clock,
    text: "Generating takes about a minute, and you have a daily generation limit — it's shown above the generate button.",
  },
  {
    icon: BookmarkCheck,
    text: "Every generation is saved to the offer as a new version, so you can come back and copy any of them without regenerating.",
  },
  {
    icon: Link2,
    text: "You get the best results when your offer is live and has an affiliate link armed.",
  },
];

function WhatToExpectPanel() {
  return (
    <section className="glass-card p-5 md:p-6">
      <h2 className="text-sm font-medium uppercase tracking-wider text-text-heading">
        What to expect
      </h2>
      <div className="mt-4 space-y-2">
        {WHAT_TO_EXPECT.map((item, i) => (
          <div key={i} className="wizard-inset-row">
            <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-brass-700" />
            <span className="text-sm text-text-primary">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
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

        // Only preselect when explicitly deep-linked (e.g. from Offers Library).
        if (initialSiteId) {
          const summary = list.find((s) => s.site.id === initialSiteId);
          if (summary) {
            setSelectedSiteId(summary.site.id);
            setSelectedSite(summary.site);
          }
        }
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
    return `${origin}${sitePublicPath(selectedSite)}`;
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
        <section className="glass-card space-y-4 p-4 sm:p-5 md:p-6">
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

      <PremiumStepsSection
        steps={[
          {
            num: "1",
            title: "Select an offer",
            desc: "Pick any sales page you launched with the Sales Offer Generator — the AI analyzes its product and live offer page.",
          },
          {
            num: "2",
            title: "Generate a story thread",
            desc: `One click creates a ${THREADS_PER_GENERATION}-post thread — hook, struggle, solution, proof, and a single call to action. Posts 1, 4, and 7 include niche images.`,
          },
          {
            num: "3",
            title: "Copy and post to X",
            desc: "Copy posts one by one or all at once, publish them to X, and add the bonus hashtags for extra reach.",
          },
        ]}
      />

      <section className="glass-card space-y-4 p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brass-100 text-brass-700">
            <Megaphone size={22} />
          </div>
          <div>
            <p className="font-medium text-text-primary">X story thread generator</p>
            <p className="text-sm text-text-secondary">
              Pick an offer, analyze your product, and generate a {THREADS_PER_GENERATION}-post story thread.
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
            <option value="" disabled>
              Choose an offer to promote…
            </option>
            {summaries.map((summary) => (
              <option key={summary.site.id} value={summary.site.id}>
                {offerLabel(summary)}
              </option>
            ))}
          </select>
        </label>

        {selectedSummary ? (
          <p className="text-xs text-text-muted">
            Niche: {getSiteTerritory(selectedSummary.site)}
            {selectedSummary.site.armed_links?.[0]?.url
              ? " · Link armed"
              : " · Add a link in Links Library for best results"}
            {selectedSummary.xThreadCount > 0
              ? ` · ${selectedSummary.xThreadCount} thread${selectedSummary.xThreadCount !== 1 ? "s" : ""} saved`
              : ""}
          </p>
        ) : (
          <p className="text-xs text-text-muted">
            You have {summaries.length} offer{summaries.length === 1 ? "" : "s"} ready to promote.
          </p>
        )}
      </section>

      <section className="min-w-0">
        {kitSite ? <PublishKitPanel key={kitSite.siteId} site={kitSite} /> : null}
      </section>

      <WhatToExpectPanel />
    </div>
  );
}
