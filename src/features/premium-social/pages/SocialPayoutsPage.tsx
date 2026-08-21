"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  Image as ImageIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
import { brand } from "@/config/brand.config";
import { PremiumWorkflowShell } from "@/components/premium/PremiumWorkflowShell";
import { PremiumErrorAlert } from "@/components/premium/PremiumErrorAlert";
import { LiveAssetPicker, type LiveAssetSummary } from "@/components/premium/LiveAssetPicker";
import { GenerationProgress, GENERATION_RESULTS_ID } from "@/components/ui/generation-progress";
import { GlassPanel } from "@/components/ui/glass-panel";

interface PinRow {
  id: string;
  headline: string;
  title: string;
  description: string;
  keywords?: string[];
  image_url: string | null;
  batch_id?: string | null;
  trackingUrl?: string;
  created_at?: string;
}

const SITE_STORAGE_KEY = `${brand.storagePrefix}_pin_multiplier_site`;

function pinImageSrc(url: string) {
  const base = url.includes("?") ? url : `${url}?v=7`;
  if (base.includes("v=")) return base.replace(/([?&])v=\d+/, "$1v=7");
  return `${base}&v=7`;
}

function pinDownloadHref(url: string | null) {
  if (!url) return "#";
  const withVersion = pinImageSrc(url);
  return `${withVersion}${withVersion.includes("?") ? "&" : "?"}download=1`;
}

export default function SocialPayoutsPage() {
  const searchParams = useSearchParams();
  const preferredId = searchParams.get("siteId");

  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<LiveAssetSummary | null>(null);
  const [pins, setPins] = useState<PinRow[]>([]);
  const [loadingPins, setLoadingPins] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [lastBatchId, setLastBatchId] = useState<string | null>(null);

  const loadPins = useCallback(async (siteId: string) => {
    if (!siteId) {
      setPins([]);
      return;
    }
    setLoadingPins(true);
    setError("");
    try {
      const res = await fetch(`/api/premium/social-payouts?siteId=${encodeURIComponent(siteId)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load pins");
      setPins(Array.isArray(data.pins) ? data.pins : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load pins");
      setPins([]);
    } finally {
      setLoadingPins(false);
    }
  }, []);

  const handleAssetChange = useCallback(
    (assetId: string, asset: LiveAssetSummary | null) => {
      setSelectedSiteId(assetId);
      setSelectedAsset(asset);
      setLastBatchId(null);
      void loadPins(assetId);
    },
    [loadPins]
  );

  const generateExtraBatch = async () => {
    if (!selectedSiteId) {
      setError("Select a money page first.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/pins/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: selectedSiteId, extraBatch: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate pins");
      const newPins = (data.pins ?? []) as PinRow[];
      setLastBatchId(newPins[0]?.batch_id ?? data.batchId ?? null);
      await loadPins(selectedSiteId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate pins");
    } finally {
      setGenerating(false);
    }
  };

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(""), 2000);
    } catch {
      /* ignore */
    }
  };

  const trackingBase = selectedAsset?.publicUrl ?? "";

  const destination = (pinId: string) =>
    pins.find((p) => p.id === pinId)?.trackingUrl ||
    (trackingBase ? `${trackingBase}?pin=${pinId}&src=pinterest` : "");

  const batches = useMemo(() => {
    const map = new Map<string, PinRow[]>();
    for (const pin of pins) {
      const key = pin.batch_id || "legacy";
      const list = map.get(key) ?? [];
      list.push(pin);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [pins]);

  const latestBatchPins = lastBatchId
    ? pins.filter((p) => p.batch_id === lastBatchId)
    : batches[0]?.[1] ?? [];

  return (
    <PremiumWorkflowShell
      title="Pin Multiplier"
      subtitle="Generate extra Pinterest pin batches for a live money page — new hooks and angles beyond your first 10."
      training={{
        vimeoId: "1215530104",
        title: "Pin Multiplier Training",
        description:
          "Pick a live money page, generate another batch of Pinterest pins, then download and post with tracking links.",
        iframeTitle: "Pin Multiplier training video",
      }}
      tip={
        <>
          Tip: Each batch appends to your pin vault — open{" "}
          <span className="text-text-primary">Traffic</span> anytime to download images and copy.
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
          disabled={generating}
        />

        {selectedSiteId ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={generating}
              onClick={() => void generateExtraBatch()}
              className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {generating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              Generate 10 more pins
            </button>
            <Link
              href={`/traffic/${selectedSiteId}`}
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              <ImageIcon size={14} />
              Open in Traffic
              <ArrowRight size={14} />
            </Link>
            <p className="text-xs text-text-muted">
              {pins.length} pin{pins.length === 1 ? "" : "s"} on this page
              {batches.length > 1 ? ` · ${batches.length} batches` : ""}
            </p>
          </div>
        ) : null}

        {error ? <PremiumErrorAlert message={error} /> : null}
      </GlassPanel>

      <GenerationProgress
        active={generating}
        label="Generating an extra Pinterest pin batch with new angles…"
      />

      {loadingPins && pins.length === 0 ? (
        <p className="inline-flex items-center gap-2 text-sm text-text-muted">
          <Loader2 size={14} className="animate-spin" />
          Loading pins…
        </p>
      ) : null}

      {latestBatchPins.length > 0 || pins.length > 0 ? (
        <section id={GENERATION_RESULTS_ID} className="scroll-mt-24 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-medium text-text-primary">
                {lastBatchId ? "New pin batch" : "Your pins"}
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Download the image, copy title and description, paste the tracking link on Pinterest.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {(lastBatchId ? latestBatchPins : pins.slice(0, 10)).map((pin, index) => (
              <GlassPanel key={pin.id} className="overflow-hidden p-0">
                <div className="relative aspect-[2/3] bg-[var(--np-surface-field)]">
                  {pin.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pinImageSrc(pin.image_url)}
                      alt={pin.headline}
                      className="h-full w-full object-cover"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-text-muted">
                      Pin {index + 1}
                    </div>
                  )}
                </div>
                <div className="space-y-2 p-3">
                  <p className="line-clamp-2 text-xs font-semibold text-text-primary">{pin.headline}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <a
                      href={pinDownloadHref(pin.image_url)}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--np-line)] px-2 py-1 text-[11px] font-medium text-text-secondary hover:border-pulse-700 hover:text-pulse-700"
                    >
                      <Download size={11} />
                      Image
                    </a>
                    <button
                      type="button"
                      onClick={() => void copy(`t${pin.id}`, pin.title)}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--np-line)] px-2 py-1 text-[11px] font-medium text-text-secondary hover:border-pulse-700 hover:text-pulse-700"
                    >
                      {copied === `t${pin.id}` ? <Check size={11} /> : <Copy size={11} />}
                      Title
                    </button>
                    <button
                      type="button"
                      onClick={() => void copy(`d${pin.id}`, pin.description)}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--np-line)] px-2 py-1 text-[11px] font-medium text-text-secondary hover:border-pulse-700 hover:text-pulse-700"
                    >
                      {copied === `d${pin.id}` ? <Check size={11} /> : <Copy size={11} />}
                      Desc
                    </button>
                    <button
                      type="button"
                      onClick={() => void copy(`l${pin.id}`, destination(pin.id))}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--np-line)] px-2 py-1 text-[11px] font-medium text-text-secondary hover:border-pulse-700 hover:text-pulse-700"
                    >
                      {copied === `l${pin.id}` ? <Check size={11} /> : <Copy size={11} />}
                      Link
                    </button>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </section>
      ) : null}
    </PremiumWorkflowShell>
  );
}
