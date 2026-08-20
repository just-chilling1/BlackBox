"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Link as LinkIcon,
  Filter,
  Loader2,
  PlayCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { clsx } from "clsx";
import { brand } from "@/config/brand.config";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { GenerationProgress, GENERATION_RESULTS_ID } from "@/components/ui/generation-progress";
import { PageHeader } from "@/components/ui/page-header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { WorkflowPage } from "@/components/ui/workflow-page";
import { AffiliateLinkField } from "@/components/premium/AffiliateLinkField";
import { PremiumErrorAlert } from "@/components/premium/PremiumErrorAlert";
import { PremiumVideoTutorial } from "@/components/premium/PremiumVideoTutorial";
import { ACCELERATOR_NICHES } from "@/features/premium-accelerator/lib/catalog";
import {
  TemplatePreviewOverlay,
  type VaultTemplatePreview,
} from "@/features/premium-accelerator/components/TemplatePreviewOverlay";
import {
  VaultTemplateCard,
  type VaultTemplateRow,
} from "@/features/premium-accelerator/components/VaultTemplateCard";

const PAGE_SIZE = 24;
const AFFILIATE_STORAGE_KEY = `${brand.storagePrefix}_accelerator_affiliate`;

export default function AcceleratorPage() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<VaultTemplateRow[]>([]);
  const [total, setTotal] = useState(200);
  const [niche, setNiche] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [cloningId, setCloningId] = useState<number | null>(null);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewCatalogId, setPreviewCatalogId] = useState<number | null>(null);
  const [previewData, setPreviewData] = useState<VaultTemplatePreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [cloneResult, setCloneResult] = useState<{
    catalogId: number;
    siteUrl: string;
    assetId: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [showTraining, setShowTraining] = useState(false);

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

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/premium/accelerator/templates", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load templates");
      setTemplates(data.templates ?? []);
      setTotal(data.total ?? 200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

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

  const handleClone = useCallback(
    async (catalogId: number) => {
      if (!affiliateLink.trim()) {
        setError("Enter your affiliate link first.");
        return;
      }
      setCloningId(catalogId);
      setError("");
      setCloneResult(null);
      try {
        const res = await fetch("/api/premium/accelerator/install", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ catalogId, affiliateUrl: affiliateLink.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Install failed");
        const assetId = (data.assetId as string) || (data.site?.id as string);
        setCloneResult({ catalogId, siteUrl: data.siteUrl, assetId });
        setPreviewOpen(false);
        setPreviewCatalogId(null);
        setPreviewData(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Install failed");
      } finally {
        setCloningId(null);
      }
    },
    [affiliateLink]
  );

  const handleView = useCallback(
    async (catalogId: number) => {
      setPreviewCatalogId(catalogId);
      setPreviewOpen(true);
      setPreviewLoading(true);
      setPreviewError("");
      setPreviewData(null);
      setViewingId(catalogId);

      try {
        const params = new URLSearchParams({ catalogId: String(catalogId) });
        const link = affiliateLink.trim();
        if (link) params.set("affiliateUrl", link);

        const res = await fetch(`/api/premium/accelerator/preview?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load preview");
        setPreviewData(data as VaultTemplatePreview);
      } catch (e) {
        setPreviewError(e instanceof Error ? e.message : "Failed to load preview");
      } finally {
        setPreviewLoading(false);
        setViewingId(null);
      }
    },
    [affiliateLink]
  );

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
    setPreviewCatalogId(null);
    setPreviewData(null);
    setPreviewError("");
    setPreviewLoading(false);
    setViewingId(null);
  }, []);

  const previewTemplate =
    previewCatalogId != null ? templates.find((t) => t.id === previewCatalogId) : undefined;

  if (loading && templates.length === 0) {
    return (
      <WorkflowPage width="wide">
        <PageHeader
          eyebrow="Premium"
          title="Asset Vault"
          subtitle="200 ready-made money pages — add your link, then generate Pinterest pins."
        />
        <PageSkeleton cards={6} />
      </WorkflowPage>
    );
  }

  return (
    <WorkflowPage width="wide">
      <PageHeader
        eyebrow="Premium"
        title="Asset Vault"
        subtitle={`${total} ready-made money pages across every niche — preview any page, install it with your link, then get pins.`}
        actions={
          <button
            type="button"
            onClick={() => setShowTraining((v) => !v)}
            className="btn-secondary inline-flex items-center gap-2 text-sm"
          >
            <PlayCircle size={16} />
            Training
            {showTraining ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        }
      />

      {showTraining ? (
        <PremiumVideoTutorial
          vimeoId="1215530104"
          title="Asset Vault Training"
          description="Browse ready-made money pages, install one with your affiliate link, then generate Pinterest pins on the Traffic step."
          iframeTitle="Asset Vault training video"
        />
      ) : null}

      <GlassPanel className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-text-primary">Your affiliate link</p>
            <p className="mt-1 text-xs text-text-muted">
              Required to use a page. CTAs wire to this link when you install.
            </p>
          </div>
          <p className="text-xs text-text-muted">All {total} pages ready to install</p>
        </div>

        <div>
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-text-primary">
            <LinkIcon size={14} className="text-pulse-700" />
            Affiliate URL
          </span>
          <AffiliateLinkField
            value={affiliateLink}
            onChange={setAffiliateLink}
            inputId="accelerator-affiliate-link"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter size={14} className="shrink-0 text-text-muted" />
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
          Showing {visibleTemplates.length} of {filtered.length} page
          {filtered.length !== 1 ? "s" : ""}
          {filtered.length !== templates.length ? ` (${templates.length} total)` : ""}
        </p>

        {error ? <PremiumErrorAlert message={error} /> : null}
      </GlassPanel>

      <p className="text-sm text-text-muted">
        Tip: Preview a page first, then hit <span className="text-text-primary">Use this page</span>{" "}
        to add it to your account with your link — then generate pins on Traffic.
      </p>

      <GenerationProgress
        active={cloningId !== null}
        label="Installing money page with your affiliate link..."
      />

      <div
        id={GENERATION_RESULTS_ID}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 scroll-mt-24"
      >
        {visibleTemplates.map((t) => (
          <VaultTemplateCard
            key={t.id}
            template={t}
            cloningId={cloningId}
            viewingId={viewingId}
            clonedSiteUrl={cloneResult?.catalogId === t.id ? cloneResult.siteUrl : null}
            clonedAssetId={cloneResult?.catalogId === t.id ? cloneResult.assetId : null}
            hasAffiliateLink={hasAffiliateLink}
            onView={handleView}
            onClone={handleClone}
          />
        ))}
      </div>

      {filtered.length === 0 && !loading ? (
        <p className="text-center text-sm text-text-muted">No pages match this filter.</p>
      ) : null}

      {hasMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="btn-secondary px-6 py-2 text-sm"
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-4 text-text-muted">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : null}

      <TemplatePreviewOverlay
        open={previewOpen}
        onClose={closePreview}
        loading={previewLoading}
        error={previewError}
        preview={previewData}
        productName={previewTemplate?.productName}
        hasAffiliateLink={hasAffiliateLink}
        isCloning={cloningId === previewCatalogId}
        onUseTemplate={() => {
          if (previewCatalogId != null) void handleClone(previewCatalogId);
        }}
      />
    </WorkflowPage>
  );
}
