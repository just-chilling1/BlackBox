"use client";



import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";

import { GlassPanel } from "@/components/ui/glass-panel";

import { WorkflowPage } from "@/components/ui/workflow-page";

import { WorkflowStepsBar } from "@/components/ui/workflow-steps";

import { isMoneyPageCopy, type MoneyPageCopy } from "@/features/money-page/lib/types";

import { sitePublicPath } from "@/lib/app-url";



const FIELD_LABELS: Partial<Record<keyof MoneyPageCopy, string>> = {

  headline: "Headline",

  subheadline: "Subheadline",

  productIntro: "Product introduction",

  overview: "Overview",

  review: "Review",

  finalRecommendation: "Final recommendation",

};



export default function MoneyPageEditor() {

  const params = useParams<{ assetId: string }>();

  const router = useRouter();

  const assetId = params.assetId;

  const [site, setSite] = useState<Record<string, unknown> | null>(null);

  const [copy, setCopy] = useState<MoneyPageCopy | null>(null);

  const [affiliateUrl, setAffiliateUrl] = useState("");

  const [editing, setEditing] = useState(false);

  const [busy, setBusy] = useState("");

  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);

  const [loading, setLoading] = useState(true);



  async function load() {

    setLoading(true);

    const res = await fetch(`/api/assets/${assetId}`);

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {

      setError(data.error || "Could not load asset");

      return;

    }

    setSite(data.site);

    if (isMoneyPageCopy(data.site.sales_page_json)) setCopy(data.site.sales_page_json);

    const links = Array.isArray(data.site.armed_links) ? data.site.armed_links : [];

    setAffiliateUrl(links[0]?.url || data.site.product_url || "");

  }



  useEffect(() => {

    void load();

  }, [assetId]);



  async function save() {

    setBusy("save");

    setError("");

    const res = await fetch(`/api/assets/${assetId}`, {

      method: "PATCH",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ copy, affiliateUrl }),

    });

    const data = await res.json();

    setBusy("");

    if (!res.ok) {

      setError(data.error || "Save failed");

      return;

    }

    setSite(data.site);

    setEditing(false);

  }



  async function regenerate() {

    setBusy("regen");

    setError("");

    const res = await fetch(`/api/assets/${assetId}`, {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ action: "regenerate" }),

    });

    const data = await res.json();

    setBusy("");

    if (!res.ok) {

      setError(data.error || "Regenerate failed");

      return;

    }

    setSite(data.site);

    if (isMoneyPageCopy(data.site.sales_page_json)) setCopy(data.site.sales_page_json);

  }



  async function publish() {

    setBusy("publish");

    setError("");

    const res = await fetch(`/api/assets/${assetId}`, {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ action: "publish" }),

    });

    const data = await res.json();

    setBusy("");

    if (!res.ok) {

      setError(data.error || "Publish failed");

      return;

    }

    setSite(data.site);

  }



  const live = site?.status === "live";

  const publicUrl =

    typeof window !== "undefined" && site?.slug

      ? `${window.location.origin}${sitePublicPath({ slug: String(site.slug), owner_handle: site.owner_handle as string | null })}`

      : "";



  return (

    <WorkflowPage>

      <WorkflowStepsBar current="money-page" assetId={assetId} />

      <PageHeader

        eyebrow="Step 2"

        title="Money page"

        subtitle="This is the review page NullPing built. Edit if you want, then publish."

        actions={

          <div className="flex flex-wrap gap-2">

            <button type="button" className="btn-secondary" onClick={() => setEditing((v) => !v)}>

              {editing ? "Close editor" : "Edit"}

            </button>

            <button type="button" className="btn-secondary" disabled={busy === "regen"} onClick={() => void regenerate()}>

              {busy === "regen" ? "Regenerating..." : "Regenerate"}

            </button>

            <button

              type="button"

              className="btn-secondary"

              onClick={() => window.open(`/api/assets/${assetId}/preview`, "_blank")}

            >

              <ExternalLink size={16} />

              Preview

            </button>

            <button type="button" className="btn-primary" disabled={busy === "publish"} onClick={() => void publish()}>

              {busy === "publish" ? "Publishing..." : live ? "Update live page" : "Publish"}

            </button>

          </div>

        }

      />



      {error ? <div className="alert-banner">{error}</div> : null}



      {live ? (

        <GlassPanel className="space-y-4 p-6">

          <div className="success-banner">

            <CheckCircle2 size={18} />

            Your money page is live

          </div>

          <div className="live-url-box">{publicUrl}</div>

          <div className="flex flex-wrap gap-3">

            <button

              type="button"

              className="btn-secondary"

              onClick={() => {

                void navigator.clipboard.writeText(publicUrl);

                setCopied(true);

                window.setTimeout(() => setCopied(false), 1500);

              }}

            >

              {copied ? "Copied" : "Copy link"}

            </button>

            <button type="button" className="btn-primary" onClick={() => router.push(`/traffic/${assetId}`)}>

              Generate traffic

            </button>

          </div>

        </GlassPanel>

      ) : null}



      {!affiliateUrl ? (

        <GlassPanel className="space-y-4 p-6">

          <h2 className="ds-h3">Add your affiliate link</h2>

          <p className="text-sm text-ink-3">Your CTA buttons will use this link once you save it.</p>

          <input className="input-base w-full" value={affiliateUrl} onChange={(e) => setAffiliateUrl(e.target.value)} />

          <button type="button" className="btn-secondary" onClick={() => void save()}>

            Save link

          </button>

        </GlassPanel>

      ) : null}



      {editing && copy ? (

        <GlassPanel className="space-y-4 p-6">

          <h2 className="ds-h3">Edit page copy</h2>

          {(["headline", "subheadline", "productIntro", "overview", "review", "finalRecommendation"] as const).map(

            (key) => (

              <label key={key} className="block">

                <span className="field-label">{FIELD_LABELS[key] ?? key}</span>

                <textarea

                  className="input-base min-h-24 w-full py-3"

                  value={copy[key]}

                  onChange={(e) => setCopy({ ...copy, [key]: e.target.value })}

                />

              </label>

            )

          )}

          <button type="button" className="btn-primary" disabled={busy === "save"} onClick={() => void save()}>

            Save edits

          </button>

        </GlassPanel>

      ) : null}



      {loading ? (

        <GlassPanel className="flex items-center justify-center gap-3 p-10 text-ink-3">

          <Loader2 className="h-5 w-5 animate-spin text-pulse-500" />

          Loading preview...

        </GlassPanel>

      ) : typeof site?.sales_page_html === "string" ? (

        <div className="preview-frame">

          <div className="preview-frame-bar">

            <span className="preview-frame-dot" />

            <span className="preview-frame-dot" />

            <span className="preview-frame-dot" />

            <span className="preview-frame-label">Live preview</span>

          </div>

          <iframe title="Money page preview" className="h-[80vh] min-h-[520px] w-full bg-[#f6f8fb]" srcDoc={site.sales_page_html as string} />

        </div>

      ) : (

        <GlassPanel className="p-6 text-sm text-ink-4">No preview available yet.</GlassPanel>

      )}

    </WorkflowPage>

  );

}

