"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  FolderOpen,
  Globe,
  Plus,
  Trash2,
  Loader2,
  MousePointerClick,
} from "lucide-react";
import { getAppUrl } from "@/lib/brand-vars";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { EmptyState } from "@/components/ui/empty-state";
import { AssetFolderCard, type SiteVaultSummary } from "../components/AssetFolderCard";
import { getSiteTerritory } from "../lib/site-territory";
import type { BlogSite, GenerationQuota } from "../types";

export default function AssetCommandPage() {
  const [summaries, setSummaries] = useState<SiteVaultSummary[]>([]);
  const [activeSiteId, setActiveSiteId] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<BlogSite | null>(null);
  const [clicks, setClicks] = useState(0);
  const [quota, setQuota] = useState<GenerationQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openSiteId, setOpenSiteId] = useState<string | null>(null);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/blog/site", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setSummaries(Array.isArray(data.summaries) ? data.summaries : []);
        if (data.quota) setQuota(data.quota);
        if (data.activeSiteId) setActiveSiteId(data.activeSiteId);
      })
      .finally(() => setLoading(false));
  }, []);

  const openFolder = async (siteId: string) => {
    setOpenSiteId(siteId);
    setDetailLoading(true);
    setSelectedSite(null);

    try {
      const res = await fetch(`/api/blog/site?siteId=${encodeURIComponent(siteId)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load site");

      setSelectedSite(data.site as BlogSite);
      setClicks(data.clicks ?? 0);
      if (Array.isArray(data.summaries)) setSummaries(data.summaries);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeFolder = () => {
    setOpenSiteId(null);
    setSelectedSite(null);
    setClicks(0);
  };

  const publicUrl = selectedSite
    ? `${typeof window !== "undefined" ? window.location.origin : getAppUrl()}/sites/${selectedSite.slug}`
    : "";

  const copyUrl = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteSite = async (siteId: string, siteTitle: string) => {
    const confirmed = window.confirm(
      `Delete "${siteTitle}"?\n\nThis removes the website, all its articles, and saved posts. This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingSiteId(siteId);
    try {
      const res = await fetch(`/api/blog/site?siteId=${encodeURIComponent(siteId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete website");

      setSummaries((prev) => prev.filter((s) => s.site.id !== siteId));
      if (openSiteId === siteId) closeFolder();
      if (activeSiteId === siteId) setActiveSiteId(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete website";
      window.alert(msg);
    } finally {
      setDeletingSiteId(null);
    }
  };

  if (loading) {
    return <PageLoading message="Loading your websites..." />;
  }

  if (summaries.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
          eyebrow="My Websites"
          title="Your websites"
          subtitle="Every website you launch is saved here. Open one to see visitor clicks and its public link."
        />
        <EmptyState
          icon={FolderOpen}
          title="No websites yet"
          description="Deploy a website and it will appear here as a saved folder you can open anytime."
          action={{ label: "Start building", href: "/sales-offer-generator" }}
        />
      </div>
    );
  }

  if (openSiteId) {
    return (
      <div className="page-container">
        <button
          type="button"
          onClick={closeFolder}
          className="inline-flex items-center gap-2 text-sm text-promo-accent hover:underline w-fit"
        >
          <ArrowLeft size={16} />
          Back to My Websites
        </button>

        {detailLoading || !selectedSite ? (
          <PageLoading message="Opening website..." className="max-w-none" />
        ) : (
          <>
            <PageHeader
              eyebrow="Site folder"
              title={selectedSite.title}
              subtitle={getSiteTerritory(selectedSite)}
              actions={
                <button
                  type="button"
                  onClick={() => void deleteSite(selectedSite.id, selectedSite.title)}
                  disabled={deletingSiteId === selectedSite.id}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                >
                  {deletingSiteId === selectedSite.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete website
                </button>
              }
            />

            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                    Public website
                  </p>
                  <p className="break-all text-sm text-text-primary">{publicUrl}</p>
                  <p className="mt-2 text-xs text-text-muted">
                    Created {new Date(selectedSite.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="action-row sm:justify-end">
                  <button
                    type="button"
                    onClick={copyUrl}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-promo-accent/40 px-4 py-2.5 text-sm font-medium text-promo-accent sm:w-auto"
                  >
                    <Copy size={16} />
                    {copied ? "Copied!" : "Copy URL"}
                  </button>
                  <Link
                    href={`/sites/${selectedSite.slug}`}
                    target="_blank"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-promo-accent px-4 py-2.5 text-sm font-bold text-text-on-accent sm:w-auto"
                  >
                    View
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="stat-grid">
              <div className="glass-tile flex items-center gap-3 px-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-muted/15 text-accent-muted">
                  <MousePointerClick size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-text-muted">Clicks</p>
                  <p className="brand-font text-2xl text-text-heading">{clicks}</p>
                </div>
              </div>
              <div className="glass-tile flex items-center gap-3 px-4 py-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    selectedSite.status === "live"
                      ? "bg-promo-accent/15 text-promo-accent"
                      : "bg-accent/15 text-accent"
                  }`}
                >
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-text-muted">Status</p>
                  <p className="brand-font text-2xl capitalize text-text-heading">{selectedSite.status}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  const latestSiteId = activeSiteId ?? summaries[0]?.site.id ?? null;

  return (
    <div className="page-container">
      <PageHeader
        eyebrow="My Websites"
        title="Your websites"
        subtitle="Every website you launch is saved here. Open one to see visitor clicks and its public link."
        actions={
          quota ? (
            <p className="text-xs text-promo-accent text-right max-w-[220px]">
              {quota.unlimited
                ? `Unlimited new sites · ${quota.usedToday} generated today`
                : `${quota.remaining} of ${quota.limit} new sites remaining today`}
            </p>
          ) : (
            <p className="text-xs text-text-muted">
              {summaries.length} {summaries.length === 1 ? "site" : "sites"} saved
            </p>
          )
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaries.map((summary) => (
          <AssetFolderCard
            key={summary.site.id}
            summary={summary}
            isActive={summary.site.id === latestSiteId}
            onOpen={() => openFolder(summary.site.id)}
            onDelete={() => void deleteSite(summary.site.id, summary.site.title)}
            deleting={deletingSiteId === summary.site.id}
          />
        ))}

        {(quota?.unlimited || (quota?.remaining ?? 0) > 0) && (
          <Link
            href="/sales-offer-generator"
            className="rounded-xl border border-dashed border-promo-accent/35 p-4 sm:p-5 flex flex-col items-center justify-center gap-3 min-h-[140px] text-center hover:border-promo-accent/55 hover:bg-promo-accent/5 transition-colors"
          >
            <div className="w-11 h-11 rounded-lg bg-promo-accent/10 text-promo-accent flex items-center justify-center">
              <Plus size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-heading">New website</p>
              <p className="text-xs text-text-muted mt-1">
                {quota?.unlimited ? "Unlimited generations" : `${quota?.remaining} generations left today`}
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
