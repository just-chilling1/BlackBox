"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { WorkflowPage } from "@/components/ui/workflow-page";
import { isMoneyPageCopy, type MoneyPageCopy } from "@/features/money-page/lib/types";
import {
  getMoneyPageColorTheme,
  MONEY_PAGE_COLOR_THEMES,
  type MoneyPageColorThemeId,
  isMoneyPageColorThemeId,
} from "@/features/money-page/lib/themes";
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
  const [colorTheme, setColorTheme] = useState<MoneyPageColorThemeId>("ocean");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  function applyThemeFromPayload(data: Record<string, unknown>) {
    if (isMoneyPageColorThemeId(data.colorTheme)) {
      setColorTheme(data.colorTheme);
      return;
    }
    const config = (data.site as { theme_config?: unknown } | undefined)?.theme_config;
    if (config && typeof config === "object" && isMoneyPageColorThemeId((config as Record<string, unknown>).moneyColorTheme)) {
      setColorTheme((config as Record<string, unknown>).moneyColorTheme as MoneyPageColorThemeId);
    }
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/assets/${assetId}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not load asset");
        return;
      }
      setSite(data.site);
      const pageCopy = isMoneyPageCopy(data.site.sales_page_json) ? data.site.sales_page_json : null;
      if (pageCopy) setCopy(pageCopy);
      applyThemeFromPayload(data);
      const links = Array.isArray(data.site.armed_links) ? data.site.armed_links : [];
      const link = links[0]?.url || data.site.product_url || "";
      setAffiliateUrl(link);

      // Rebuild stored HTML when FAQ arrow styles are missing (template updates).
      const html = typeof data.site.sales_page_html === "string" ? data.site.sales_page_html : "";
      if (pageCopy && !html.includes("summary::after")) {
        const config = data.site.theme_config;
        const fromConfig =
          config && typeof config === "object"
            ? (config as Record<string, unknown>).moneyColorTheme
            : null;
        const theme = isMoneyPageColorThemeId(data.colorTheme)
          ? data.colorTheme
          : isMoneyPageColorThemeId(fromConfig)
            ? fromConfig
            : "ocean";
        const rebuild = await fetch(`/api/assets/${assetId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ copy: pageCopy, affiliateUrl: link, colorTheme: theme }),
        });
        const rebuilt = await rebuild.json().catch(() => null);
        if (rebuild.ok && rebuilt?.site) {
          setSite(rebuilt.site);
          applyThemeFromPayload(rebuilt);
        } else if (!rebuild.ok) {
          setError(rebuilt?.error || "Could not refresh the live preview");
        }
      }
    } catch {
      setError("Could not load asset");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [assetId]);

  async function save(nextTheme?: MoneyPageColorThemeId) {
    setBusy(nextTheme ? "theme" : "save");
    setError("");
    const theme = nextTheme ?? colorTheme;
    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copy, affiliateUrl, colorTheme: theme }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Save failed");
        return false;
      }
      setSite(data.site);
      applyThemeFromPayload(data);
      if (!nextTheme) setEditing(false);
      return true;
    } catch {
      setError("Save failed");
      return false;
    } finally {
      setBusy("");
    }
  }

  async function changeTheme(themeId: MoneyPageColorThemeId) {
    if (themeId === colorTheme || busy) return;
    const previous = colorTheme;
    setColorTheme(themeId);
    const ok = await save(themeId);
    if (!ok) setColorTheme(previous);
  }

  async function regenerate() {
    setBusy("regen");
    setError("");
    const res = await fetch(`/api/assets/${assetId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "regenerate", colorTheme }),
    });
    const data = await res.json();
    setBusy("");
    if (!res.ok) {
      setError(data.error || "Regenerate failed");
      return;
    }
    setSite(data.site);
    if (isMoneyPageCopy(data.site.sales_page_json)) setCopy(data.site.sales_page_json);
    applyThemeFromPayload(data);
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
  const previewBg = getMoneyPageColorTheme(colorTheme).css.bg;

  return (
    <WorkflowPage>
      <PageHeader
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

      <GlassPanel className="space-y-5 p-6 sm:p-7">
        <div>
          <h2 className="ds-h3">Color theme</h2>
          <p className="mt-1 text-sm text-ink-2">Pick one of four looks for your sales page.</p>
        </div>
        <div className="money-theme-grid" role="radiogroup" aria-label="Money page color theme">
          {MONEY_PAGE_COLOR_THEMES.map((theme) => {
            const selected = theme.id === colorTheme;
            return (
              <button
                key={theme.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={busy === "theme" || busy === "regen"}
                className={`money-theme-card ${selected ? "is-selected" : ""}`}
                style={{ "--theme-accent": theme.swatch } as React.CSSProperties}
                onClick={() => void changeTheme(theme.id)}
              >
                <span
                  className={`money-theme-swatch ${selected ? "is-selected" : ""}`}
                  style={{ background: theme.swatch }}
                  aria-hidden
                >
                  {selected ? <Check size={14} strokeWidth={3} className="money-theme-swatch-check" /> : null}
                </span>
                <span className="money-theme-copy">
                  <span className="money-theme-label">{theme.label}</span>
                  <span className="money-theme-desc">{theme.description}</span>
                </span>
              </button>
            );
          })}
        </div>
        {busy === "theme" ? <p className="text-xs text-ink-3">Updating theme…</p> : null}
      </GlassPanel>

      {live ? (
        <GlassPanel className="space-y-5 p-6 sm:p-7">
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
            <button type="button" className="btn-primary" onClick={() => router.push("/traffic")}>
              Open Generate Traffic
            </button>
          </div>
        </GlassPanel>
      ) : null}

      {editing && copy ? (
        <GlassPanel className="space-y-5 p-6 sm:p-7">
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
        <div className="preview-frame preview-frame--fill">
          <div className="preview-frame-bar">
            <span className="preview-frame-dot" />
            <span className="preview-frame-dot" />
            <span className="preview-frame-dot" />
            <span className="preview-frame-label">Live preview</span>
          </div>
          <iframe
            title="Money page preview"
            className="preview-frame-iframe"
            style={{ background: previewBg }}
            srcDoc={site.sales_page_html as string}
          />
        </div>
      ) : (
        <GlassPanel className="p-6 text-sm text-ink-4">No preview available yet.</GlassPanel>
      )}
    </WorkflowPage>
  );
}
