"use client";



import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

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



export default function TrafficPage() {

  const { assetId } = useParams<{ assetId: string }>();

  const [pins, setPins] = useState<PinRow[]>([]);

  const [slug, setSlug] = useState("");

  const [busy, setBusy] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [copied, setCopied] = useState("");



  async function load() {

    setLoading(true);

    setError("");

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

    setLoading(false);

  }



  useEffect(() => {

    void load();

  }, [assetId]);



  async function generate() {

    setBusy(true);

    setError("");

    const res = await fetch("/api/pins/generate", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ siteId: assetId }),

    });

    const data = await res.json();

    setBusy(false);

    if (!res.ok) {

      setError(data.error || "Could not generate pins");

      return;

    }

    setPins(data.pins ?? []);

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



      <GlassPanel className="space-y-4 p-6">

        <p className="text-sm leading-relaxed text-ink-2">

          Post these pins to Pinterest and use the provided link. Each visitor will be sent directly to your money page.

        </p>

        {error ? <div className="alert-banner">{error}</div> : null}

        <button type="button" className="btn-primary" disabled={busy || loading} onClick={() => void generate()}>

          {busy ? "Generating..." : pins.length ? "Regenerate traffic assets" : "Generate traffic assets"}

        </button>

      </GlassPanel>



      {loading ? (

        <GlassPanel className="flex items-center justify-center gap-3 p-10 text-ink-3">

          <Loader2 className="h-5 w-5 animate-spin text-pulse-500" />

          Loading pins...

        </GlassPanel>

      ) : pins.length === 0 ? (

        <EmptyState
          icon={ImageIcon}
          title="No traffic assets yet"
          description="Generate 10 ready-to-post Pinterest pins for this money page. Each pin includes the image, title, description, and tracking link."
        />

      ) : (

        <div className="pin-card-grid">

          {pins.map((pin, index) => (

            <GlassPanel key={pin.id} className="pin-card p-5">

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
                    src={pin.image_url.includes("?") ? pin.image_url : `${pin.image_url}?v=2`}
                    alt={pin.headline}
                    loading="lazy"
                    decoding="async"
                  />

                </div>

              ) : null}

              <p className="text-base font-medium text-ink">{pin.headline}</p>

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

                  <span className="break-all text-xs">{destination(pin.id)}</span>

                </div>

              </div>

              <div className="mt-auto flex flex-wrap gap-2">

                <a className="btn-secondary" href={`${pin.image_url}?download=1`}>

                  Download image

                </a>

                <button type="button" className="btn-secondary" onClick={() => void copy(`t${pin.id}`, pin.title)}>

                  {copied === `t${pin.id}` ? "Copied" : "Copy title"}

                </button>

                <button type="button" className="btn-secondary" onClick={() => void copy(`d${pin.id}`, pin.description)}>

                  {copied === `d${pin.id}` ? "Copied" : "Copy description"}

                </button>

                <button type="button" className="btn-secondary" onClick={() => void copy(`l${pin.id}`, destination(pin.id))}>

                  {copied === `l${pin.id}` ? "Copied" : "Copy link"}

                </button>

              </div>

            </GlassPanel>

          ))}

        </div>

      )}

    </WorkflowPage>

  );

}

