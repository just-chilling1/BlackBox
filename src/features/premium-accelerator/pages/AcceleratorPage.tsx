"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link as LinkIcon, Filter, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { brand } from "@/config/brand.config";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { GenerationProgress } from "@/components/ui/generation-progress";
import { GlassPanel } from "@/components/ui/glass-panel";
import { AffiliateLinkField } from "@/components/premium/AffiliateLinkField";
import { PremiumErrorAlert } from "@/components/premium/PremiumErrorAlert";
import { PremiumWorkflowShell } from "@/components/premium/PremiumWorkflowShell";
import { PostCreateJourney } from "@/components/premium/PostCreateJourney";
import { PREMIUM_NICHE_FILTER_LABELS } from "@/lib/premium-niches";
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
  const [linkApplied, setLinkApplied] = useState(false);
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
    productName?: string;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AFFILIATE_STORAGE_KEY);
      if (saved) {
        setAffiliateLink(saved);
        setLinkApplied(true);
      }
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
    const list = templates.filter((t) => niche === "All" || t.niche === niche);
    return [...list].sort((a, b) => {
      const aUsed = Boolean(a.used || (cloneResult?.catalogId === a.id));
      const bUsed = Boolean(b.used || (cloneResult?.catalogId === b.id));
      if (aUsed !== bUsed) return aUsed ? -1 : 1;
      if (aUsed && bUsed && cloneResult) {
        if (a.id === cloneResult.catalogId) return -1;
        if (b.id === cloneResult.catalogId) return 1;
      }
      if (aUsed && bUsed) {
        return (b.usedAt || "").localeCompare(a.usedAt || "");
      }
      return a.id - b.id;
    });
  }, [templates, niche, cloneResult]);

  const visibleTemplates = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [niche]);

  const hasAffiliateLink = affiliateLink.trim().length > 0 && linkApplied;
  const hasMore = visibleCount < filtered.length;

  const handleClone = useCallback(
    async (catalogId: number) => {
      if (!affiliateLink.trim() || !linkApplied) {
        setError("Apply your affiliate link first.");
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
        const siteUrl = data.siteUrl as string;
        const productName =
          (data.site?.product_name as string | undefined) ||
          templates.find((t) => t.id === catalogId)?.productName;
        setCloneResult({ catalogId, siteUrl, assetId, productName });
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === catalogId
              ? {
                  ...t,
                  used: true,
                  usedAssetId: assetId,
                  usedSiteUrl: siteUrl,
                  usedAt: new Date().toISOString(),
                }
              : t
          )
        );
        setPreviewOpen(false);
        setPreviewCatalogId(null);
        setPreviewData(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Install failed");
      } finally {
        setCloningId(null);
      }
    },
    [affiliateLink, linkApplied, templates]
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
        if (link && linkApplied) params.set("affiliateUrl", link);

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
    [affiliateLink, linkApplied]
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
      <PremiumWorkflowShell
        title="Unlimited"
        subtitle="200 ready-made money pages — apply your link, install a page, and get 10 pins ready."
      >
        <PageSkeleton cards={6} />
      </PremiumWorkflowShell>
    );
  }

  return (
    <PremiumWorkflowShell
      title="Unlimited"
      subtitle={`${total} ready-made money pages across every niche — apply your link, install a page with 10 pins included.`}
      training={{
        vimeoId: "1215530104",
        title: "Unlimited Training",
        description:
          "Browse ready-made money pages, apply your affiliate link, install one page, and get 10 Pinterest pins ready to post.",
        iframeTitle: "Unlimited training video",
      }}
      tip={
        <>
          Tip: Preview a page first, then hit <span className="text-text-primary">Use this page</span>{" "}
          — it installs with your link and 10 Pinterest pins from the offer page. If scrape finds no
          photo, a stock fallback is used.
        </>
      }
    >
      {cloneResult ? (
        <PostCreateJourney
          assetId={cloneResult.assetId}
          publicUrl={cloneResult.siteUrl}
          productName={cloneResult.productName}
          showRegeneratePins
          pinCount={10}
          title="Installed — finish the NullPing loop"
        />
      ) : null}

      <GlassPanel className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-text-primary">Your affiliate link</p>
            <p className="mt-1 text-xs text-text-muted">
              Apply a link to wire CTAs on every page you install.
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
            onChange={(url) => {
              setAffiliateLink(url);
              setLinkApplied(false);
            }}
            onApply={(url) => {
              setAffiliateLink(url);
              setLinkApplied(true);
              setError("");
            }}
            actionMode="apply"
            inputId="accelerator-affiliate-link"
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <Filter size={14} className="text-pulse-700" />
              Select niche
            </p>
            <p className="text-xs text-text-muted">{niche === "All" ? "All niches" : niche}</p>
          </div>
          <div
            className="flex flex-wrap gap-2 rounded-xl border border-[var(--np-line)] bg-[var(--np-surface-field)] p-3"
            role="group"
            aria-label="Select niche"
          >
            {PREMIUM_NICHE_FILTER_LABELS.map((n) => (
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
        </div>

        <p className="text-xs text-text-muted">
          Showing {visibleTemplates.length} of {filtered.length} page
          {filtered.length !== 1 ? "s" : ""}
          {filtered.length !== templates.length ? ` (${templates.length} total)` : ""}
        </p>

        {error ? <PremiumErrorAlert message={error} /> : null}
      </GlassPanel>

      <GenerationProgress
        active={cloningId !== null}
        label="Installing money page with your affiliate link and 10 pins..."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTemplates.map((t) => (
          <VaultTemplateCard
            key={t.id}
            template={
              cloneResult?.catalogId === t.id
                ? {
                    ...t,
                    used: true,
                    usedAssetId: cloneResult.assetId,
                    usedSiteUrl: cloneResult.siteUrl,
                  }
                : t
            }
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
    </PremiumWorkflowShell>
  );
}
