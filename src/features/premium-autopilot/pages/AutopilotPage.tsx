"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Image as ImageIcon, Lightbulb, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { brand } from "@/config/brand.config";
import { PremiumWorkflowShell } from "@/components/premium/PremiumWorkflowShell";
import { GlassPanel } from "@/components/ui/glass-panel";
import { LiveAssetPicker, type LiveAssetSummary } from "@/components/premium/LiveAssetPicker";
import { SourceCard } from "@/features/premium-autopilot/components/SourceCard";
import { SourceInstructionsOverlay } from "@/features/premium-autopilot/components/SourceInstructionsOverlay";
import {
  NICHES,
  filterSourcesByNiche,
  resolveAutopilotNiche,
  SOURCES,
  autopilotTrackingUrl,
} from "@/features/premium-autopilot/lib/traffic-sources";
import {
  fetchAutopilotState,
  migrateLegacyCompletions,
  saveAutopilotSettings,
  setAutopilotCompletion,
} from "@/features/premium-autopilot/lib/autopilot-client";

const PAGE_SIZE = 24;
const LINK_PLACEHOLDER = "[YOUR_MONEY_PAGE_URL]";
const SITE_STORAGE_KEY = `${brand.storagePrefix}_autopilot_site`;

function renderSourceCopy(template: string, pageUrl: string) {
  return template.replaceAll("{LINK}", pageUrl || LINK_PLACEHOLDER);
}

export default function AutomatedProfitsPage() {
  const searchParams = useSearchParams();
  const preferredId = searchParams.get("siteId");

  const [selectedNiche, setSelectedNiche] = useState("All");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<LiveAssetSummary | null>(null);
  const [pageUrl, setPageUrl] = useState("");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedDescId, setCopiedDescId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [hydrated, setHydrated] = useState(false);
  const lastSavedUrl = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const initialState = await fetchAutopilotState();
      const state = await migrateLegacyCompletions(initialState);
      if (cancelled) return;

      const savedUrl = state?.promotion_url?.trim() ?? "";
      if (savedUrl) {
        setPageUrl(savedUrl);
        lastSavedUrl.current = savedUrl;
      }

      const savedNiche = resolveAutopilotNiche(state?.selected_niche);
      setSelectedNiche(savedNiche === "All" ? "All" : savedNiche);

      if (state?.completed_source_ids?.length) {
        setCompleted(new Set(state.completed_source_ids));
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAssetChange = useCallback((assetId: string, asset: LiveAssetSummary | null) => {
    setSelectedSiteId(assetId);
    setSelectedAsset(asset);
    if (asset?.publicUrl) {
      setPageUrl(asset.publicUrl);
      lastSavedUrl.current = null;
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const trimmed = pageUrl.trim();
    if (lastSavedUrl.current === trimmed) return;
    const timer = window.setTimeout(() => {
      void (async () => {
        const ok = await saveAutopilotSettings({
          promotion_url: trimmed || null,
        });
        if (ok) lastSavedUrl.current = trimmed;
      })();
    }, 500);
    return () => window.clearTimeout(timer);
  }, [pageUrl, hydrated]);

  const handleNicheChange = useCallback(
    async (niche: string) => {
      if (niche === selectedNiche) return;
      setSelectedNiche(niche);
      setVisibleCount(PAGE_SIZE);
      await saveAutopilotSettings({ selected_niche: niche });
    },
    [selectedNiche]
  );

  const filtered = useMemo(() => filterSourcesByNiche(selectedNiche), [selectedNiche]);
  const visible = filtered.slice(0, visibleCount);
  const progress = SOURCES.length ? Math.round((completed.size / SOURCES.length) * 100) : 0;

  const toggleComplete = async (id: string) => {
    const next = !completed.has(id);
    setCompleted((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(id);
      else copy.delete(id);
      return copy;
    });
    const ok = await setAutopilotCompletion(id, next);
    if (!ok) {
      setCompleted((prev) => {
        const copy = new Set(prev);
        if (next) copy.delete(id);
        else copy.add(id);
        return copy;
      });
    }
  };

  const copyDescription = async (id: string) => {
    const source = SOURCES.find((s) => s.id === id);
    if (!source) return;
    const url = autopilotTrackingUrl(pageUrl, id) || pageUrl || LINK_PLACEHOLDER;
    const body = renderSourceCopy(source.description, url);
    try {
      await navigator.clipboard.writeText(body);
      setCopiedDescId(id);
      window.setTimeout(() => setCopiedDescId(null), 2000);
    } catch {
      /* ignore */
    }
  };

  const expanded = expandedId ? SOURCES.find((s) => s.id === expandedId) ?? null : null;
  const trafficHref = selectedSiteId ? `/traffic/${selectedSiteId}` : undefined;

  return (
    <PremiumWorkflowShell
      title="Pinterest Autopilot"
      subtitle="A guided Pinterest posting playbook for your live money page — not auto-publish. Download pins from Traffic, post manually, track in Results."
      training={{
        vimeoId: "1215530104",
        title: "Pinterest Autopilot Training",
        description:
          "Pick a live money page, work through the Pinterest checklist, and use Traffic to download pin images with tracking links.",
        iframeTitle: "Pinterest Autopilot training video",
      }}
      tip={
        <>
          Tip: This is a checklist for real Pinterest work. Use{" "}
          <span className="text-text-primary">Traffic</span> for pin images — Autopilot does not
          post for you.
        </>
      }
    >
      <GlassPanel className="space-y-5 p-5 sm:p-6">
        <LiveAssetPicker
          value={selectedSiteId}
          preferredId={preferredId}
          storageKey={SITE_STORAGE_KEY}
          onChange={handleAssetChange}
          label="Live money page"
        />

        {selectedAsset ? (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--np-line)] bg-[var(--np-surface-field)] px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary">{selectedAsset.productName}</p>
              <p className="truncate text-xs text-text-muted">{pageUrl || selectedAsset.publicUrl}</p>
            </div>
            <Link
              href={`/traffic/${selectedAsset.id}`}
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              <ImageIcon size={14} />
              Open Traffic
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Lightbulb size={14} className="text-pulse-700" />
            Progress: {completed.size}/{SOURCES.length} ({progress}%)
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter playbook">
            {NICHES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => void handleNicheChange(n)}
                className={clsx("select-chip-pill", selectedNiche === n && "is-selected")}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </GlassPanel>

      <div className="grid gap-3 sm:grid-cols-2">
        {visible.map((source, index) => (
          <SourceCard
            key={source.id}
            source={source}
            isDone={completed.has(source.id)}
            index={index}
            onView={() => setExpandedId(source.id)}
            onToggleComplete={() => void toggleComplete(source.id)}
          />
        ))}
      </div>

      {visibleCount < filtered.length ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="btn-secondary px-6 py-2 text-sm"
          >
            Load more
          </button>
        </div>
      ) : null}

      <SourceInstructionsOverlay
        source={expanded}
        isDone={expanded ? completed.has(expanded.id) : false}
        copied={expanded ? copiedDescId === expanded.id : false}
        onClose={() => setExpandedId(null)}
        onToggleComplete={() => {
          if (expanded) void toggleComplete(expanded.id);
        }}
        onCopyDescription={() => {
          if (expanded) void copyDescription(expanded.id);
        }}
        renderCopy={(template) =>
          renderSourceCopy(
            template,
            expanded
              ? autopilotTrackingUrl(pageUrl, expanded.id) || pageUrl
              : pageUrl
          )
        }
        trafficHref={trafficHref}
      />
    </PremiumWorkflowShell>
  );
}
