"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImageIcon, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { WorkflowPage } from "@/components/ui/workflow-page";
import { WorkflowStepsBar } from "@/components/ui/workflow-steps";
import { EmptyState } from "@/components/ui/empty-state";
import { sitePublicPath } from "@/lib/app-url";

interface PinRow {
  id: string;
  headline: string;
  title: string;
  description: string;
  keywords: string[];
  image_url: string | null;
}

function pinImageSrc(url: string) {
  const base = url.includes("?") ? url : `${url}?v=6`;
  if (base.includes("v=")) return base.replace(/([?&])v=\d+/, "$1v=6");
  return `${base}&v=6`;
}

function pinDownloadHref(url: string | null) {
  if (!url) return "#";
  const withVersion = pinImageSrc(url);
  return `${withVersion}${withVersion.includes("?") ? "&" : "?"}download=1`;
}

export default function TrafficPage() {
  const { assetId } = useParams<{ assetId: string }>();
  const router = useRouter();
  const [pins, setPins] = useState<PinRow[]>([]);
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [pinRes, siteRes] = await Promise.all([
        fetch(`/api/pins/generate?siteId=${assetId}`),
        fetch(`/api/assets/${assetId}`),
      ]);
      const pinData = await pinRes.json().catch(() => ({}));
      const siteData = await siteRes.json().catch(() => ({}));
      setPins(pinData.pins ?? []);
      if (siteData.site?.slug) setSlug(siteData.site.slug);
      if (!pinRes.ok && typeof pinData.error === "string") {
        setError(pinData.error);
      } else if (!siteRes.ok && typeof siteData.error === "string") {
        setError(siteData.error);
      }
    } catch {
      setError("Could not load traffic assets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [assetId]);

  async function generate() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/pins/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: assetId, regenerate: pins.length > 0 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not generate pins");
        return;
      }
      setPins(data.pins ?? []);
    } catch {
      setError("Could not generate pins");
    } finally {
      setBusy(false);
    }
  }

  function destination(pinId: string) {
    if (!slug || typeof window === "undefined") return "";
    return `${window.location.origin}${sitePublicPath({ slug })}?pin=${pinId}&src=pinterest`;
  }

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1200);
  }

  return (
    <WorkflowPage>
      <WorkflowStepsBar current="traffic" assetId={assetId} />
      <PageHeader
        eyebrow="Step 3"
        title="Activate your traffic"
        subtitle="NullPing prepares Pinterest pins that send visitors straight to your money page."
      />

      <GlassPanel className="space-y-5 p-6 sm:p-7">
        <p className="text-sm leading-relaxed text-ink-2">
          Post these pins to Pinterest and use the provided link. Each visitor will be sent directly to your money page.
        </p>
        {error ? <div className="alert-banner">{error}</div> : null}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" disabled={busy || loading} onClick={() => void generate()}>
            {busy ? "Generating..." : pins.length ? "Regenerate traffic assets" : "Generate traffic assets"}
          </button>
          {pins.length > 0 ? (
            <button type="button" className="btn-secondary" onClick={() => router.push("/results")}>
              Save & continue to Results
            </button>
          ) : null}
        </div>
      </GlassPanel>

      {loading ? (
        <GlassPanel className="flex items-center justify-center gap-3 p-10 text-ink-3">
          <Loader2 className="h-5 w-5 animate-spin text-pulse-500" />
          Loading pins...
        </GlassPanel>
      ) : busy ? (
        <div className="pin-generating-panel" role="status" aria-live="polite">
          <div className="pin-generating-visual" aria-hidden>
            <span className="pin-generating-ring" />
            <span className="pin-generating-ring pin-generating-ring--delay" />
            <Loader2 className="pin-generating-spinner" />
          </div>
          <h3 className="ds-h3">Generating your pins</h3>
          <p className="pin-generating-copy">
            Creating images, titles, and tracking links for your money page. This usually takes a moment.
          </p>
          <div className="pin-generating-bars" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : pins.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No traffic assets yet"
          description="Generate 10 ready-to-post Pinterest pins for this money page. Each pin includes the image, title, description, and tracking link."
        />
      ) : (
        <>
          <div className="pin-card-grid">
            {pins.map((pin, index) => (
              <GlassPanel key={pin.id} className="pin-card p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="ds-h4">Pin #{index + 1}</h3>
                  {copied.endsWith(pin.id) ? (
                    <span className="text-xs font-medium text-success">Copied</span>
                  ) : null}
                </div>

                {pin.image_url ? (
                  <div className="pin-card-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pinImageSrc(pin.image_url)}
                      alt={pin.headline}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : null}

                <p className="text-base font-medium leading-snug text-ink">{pin.headline}</p>

                <div className="pin-meta-row">
                  <div>
                    <div className="pin-meta-label">Title</div>
                    {pin.title}
                  </div>
                  <div>
                    <div className="pin-meta-label">Description</div>
                    {pin.description}
                  </div>
                  <div>
                    <div className="pin-meta-label">Keywords</div>
                    {(pin.keywords || []).join(", ")}
                  </div>
                  <div>
                    <div className="pin-meta-label">Destination</div>
                    <span className="break-all text-xs leading-relaxed">{destination(pin.id)}</span>
                  </div>
                </div>

                <div className="pin-card-actions">
                  <a className="btn-compact" href={pinDownloadHref(pin.image_url)}>
                    Download image
                  </a>
                  <button type="button" className="btn-compact" onClick={() => void copy(`t${pin.id}`, pin.title)}>
                    {copied === `t${pin.id}` ? "Copied" : "Copy title"}
                  </button>
                  <button
                    type="button"
                    className="btn-compact"
                    onClick={() => void copy(`d${pin.id}`, pin.description)}
                  >
                    {copied === `d${pin.id}` ? "Copied" : "Copy description"}
                  </button>
                  <button
                    type="button"
                    className="btn-compact"
                    onClick={() => void copy(`l${pin.id}`, destination(pin.id))}
                  >
                    {copied === `l${pin.id}` ? "Copied" : "Copy link"}
                  </button>
                </div>
              </GlassPanel>
            ))}
          </div>

          <GlassPanel className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <h2 className="ds-h3">Ready to track results?</h2>
              <p className="mt-1 text-sm text-ink-3">
                Your pins are saved. Continue to see visits, clicks, and what is converting.
              </p>
            </div>
            <button type="button" className="btn-primary" onClick={() => router.push("/results")}>
              Continue to Results
            </button>
          </GlassPanel>
        </>
      )}
    </WorkflowPage>
  );
}
