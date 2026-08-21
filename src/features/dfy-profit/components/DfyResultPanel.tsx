"use client";

import { useCallback, useState } from "react";
import {
  Check,
  Copy,
  Image as ImageIcon,
  Loader2,
  Pin,
  RefreshCw,
} from "lucide-react";
import { GENERATION_RESULTS_ID } from "@/components/ui/generation-progress";
import { PostCreateJourney } from "@/components/premium/PostCreateJourney";

export interface DfySalesResult {
  siteId: string;
  offerUrl: string;
  templateName: string;
  templateId: string;
  productName: string;
}

export interface DfyPinResult {
  id: string;
  headline: string;
  title: string;
  description: string;
  keywords: string[];
  image_url: string | null;
}

interface DfyResultPanelProps {
  sales: DfySalesResult | null;
  pins: DfyPinResult[];
  pinsError: string;
  isGeneratingPins: boolean;
  retryingPins: boolean;
  onRetryPins: () => void;
}

function pinImageSrc(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return null;
}

export function DfyResultPanel({
  sales,
  pins,
  pinsError,
  isGeneratingPins,
  retryingPins,
  onRetryPins,
}: DfyResultPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  if (!sales && pins.length === 0 && !pinsError && !isGeneratingPins) {
    return null;
  }

  return (
    <section id={GENERATION_RESULTS_ID} className="scroll-mt-24 space-y-4">
      <h2 className="text-lg font-medium text-text-primary">Your One-Click Asset</h2>

      {sales ? (
        <PostCreateJourney
          assetId={sales.siteId}
          publicUrl={sales.offerUrl}
          productName={sales.productName}
          pinCount={pins.length || undefined}
          title="Ready — finish the NullPing loop"
        />
      ) : null}

      <article className="glass-card space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pulse-100 text-pulse-700">
              <Pin size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary">Pinterest pins</p>
              <p className="mt-1 text-sm text-text-secondary">
                {pins.length > 0
                  ? `${pins.length} ready-to-post pins with images — download from Traffic or copy below.`
                  : pinsError ||
                    (isGeneratingPins
                      ? "Generating 10 Pinterest pins with images…"
                      : "Your pins will appear here after the money page is ready.")}
              </p>
            </div>
          </div>
        </div>

        {isGeneratingPins && pins.length === 0 ? (
          <p className="inline-flex items-center gap-2 text-sm text-text-muted">
            <Loader2 size={14} className="animate-spin" />
            Building 10 pin images and headlines…
          </p>
        ) : null}

        {pinsError && pins.length === 0 ? (
          <button
            type="button"
            disabled={retryingPins}
            onClick={onRetryPins}
            className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {retryingPins ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Retry pins
          </button>
        ) : null}

        {pins.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {pins.map((pin, index) => {
              const src = pinImageSrc(pin.image_url);
              return (
                <li
                  key={pin.id}
                  className="overflow-hidden rounded-xl border border-[var(--np-line)] bg-[var(--np-surface)]"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-[var(--np-surface-field)]">
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={pin.headline}
                        className="h-full w-full object-cover"
                        loading={index < 3 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-text-muted">
                        Pin {index + 1}
                      </div>
                    )}
                    <span className="absolute left-2 top-2 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      Pin {index + 1}
                    </span>
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="line-clamp-3 text-xs font-semibold leading-snug text-text-primary">
                      {pin.headline}
                    </p>
                    <button
                      type="button"
                      onClick={() => void copyText(pin.id, `${pin.title}\n\n${pin.description}`)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-pulse-700 hover:underline"
                    >
                      {copiedId === pin.id ? <Check size={11} /> : <Copy size={11} />}
                      {copiedId === pin.id ? "Copied" : "Copy copy"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}

        {sales && pins.length > 0 ? (
          <p className="inline-flex items-center gap-2 text-xs text-text-muted">
            <ImageIcon size={12} />
            Full pin workspace lives in Traffic for this money page.
          </p>
        ) : null}
      </article>
    </section>
  );
}
