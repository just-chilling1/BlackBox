"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  Sparkles,
  Hash,
  ExternalLink,
  Megaphone,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { fetchJson } from "@/lib/fetch-json";
import type {
  Platform,
  PromotePlatform,
  PromoteSocialResults,
  PublishKitSite,
  SocialPostResult,
} from "../types";

function emptyResults(): PromoteSocialResults {
  return { platform: null, posts: [], tags: [] };
}

function CollapsibleResultSection({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 transition-colors hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden">
        <ChevronDown
          size={16}
          className="shrink-0 text-text-muted transition-transform group-open:rotate-180"
        />
        <span className="min-w-0 flex-1 text-sm font-medium text-text-heading">{title}</span>
        {count !== undefined && (
          <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-text-muted">
            {count}
          </span>
        )}
      </summary>
      <div className="space-y-1.5 border-t border-white/[0.06] p-2">{children}</div>
    </details>
  );
}

function CollapsibleResultItem({
  label,
  preview,
  children,
  defaultOpen = false,
}: {
  label: string;
  preview?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-lg border border-white/[0.06] bg-[rgb(8,11,18)]/40"
    >
      <summary className="flex cursor-pointer list-none items-start gap-2 px-3 py-2.5 transition-colors hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden">
        <ChevronDown
          size={14}
          className="mt-0.5 shrink-0 text-text-muted transition-transform group-open:rotate-180"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</p>
          {preview && (
            <p className="mt-0.5 line-clamp-2 text-sm text-text-primary group-open:hidden">{preview}</p>
          )}
        </div>
      </summary>
      <div className="border-t border-white/[0.06] px-3 py-2.5">{children}</div>
    </details>
  );
}

function KitButton({
  children,
  onClick,
  loading,
  variant = "secondary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-promo-accent text-[#0B0C10] hover:brightness-110"
      : variant === "ghost"
        ? "text-text-muted hover:bg-white/[0.06] hover:text-text-heading"
        : "border border-white/[0.12] bg-white/[0.04] text-text-heading hover:bg-white/[0.08]";

  return (
    <button type="button" onClick={onClick} disabled={loading} className={`${base} ${styles} ${className}`}>
      {loading ? <Loader2 size={14} className="animate-spin" /> : null}
      {children}
    </button>
  );
}

function platformLabel(platform: PromotePlatform): string {
  return platform === "linkedin" ? "LinkedIn" : "X";
}

export function PublishKitPanel({ site }: { site: PublishKitSite }) {
  const [kitBySite, setKitBySite] = useState<Record<string, PromoteSocialResults>>({});
  const [selectedPlatform, setSelectedPlatform] = useState<PromotePlatform>("linkedin");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" | "info" } | null>(null);

  const kit = kitBySite[site.siteId] ?? emptyResults();
  const visiblePosts = kit.platform === selectedPlatform ? kit.posts : [];
  const visibleTags = kit.platform === selectedPlatform ? kit.tags : [];

  const promoLink = useMemo(() => site.affiliateLink || site.siteUrl || "", [site]);

  const updateKit = (siteId: string, patch: Partial<PromoteSocialResults>) => {
    setKitBySite((prev) => ({
      ...prev,
      [siteId]: { ...(prev[siteId] ?? emptyResults()), ...patch },
    }));
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (message: string, variant: "success" | "error" | "info" = "info") => {
    setToast({ message, variant });
  };

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      showToast("Could not copy to clipboard", "error");
    }
  };

  const runGenerate = async () => {
    if (!promoLink) {
      showToast("Add an affiliate link or publish your site before generating posts.", "info");
      return;
    }

    setGenerateLoading(true);
    const res = await fetchJson<{
      platform: PromotePlatform;
      posts: SocialPostResult[];
    }>("/api/promote/social-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteId: site.siteId,
        siteUrl: site.siteUrl,
        platform: selectedPlatform,
      }),
    });
    setGenerateLoading(false);

    if (!res.ok) {
      showToast(res.error, "error");
      return;
    }

    updateKit(site.siteId, {
      platform: res.data.platform,
      posts: res.data.posts || [],
      tags: [],
    });
    showToast(`10 ${platformLabel(selectedPlatform)} posts ready to copy`, "success");
  };

  const runTags = async () => {
    setTagsLoading(true);
    const res = await fetchJson<{ tags: { tag: string; reason: string }[] }>("/api/suggest-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: selectedPlatform as Platform,
        articleTitle: site.siteName,
        articleContent: `${site.territory}. ${site.tagline || site.affiliateLabel || ""}`.trim(),
        niche: site.territory,
      }),
    });
    setTagsLoading(false);

    if (!res.ok) {
      showToast(res.error, "error");
      return;
    }
    updateKit(site.siteId, { platform: selectedPlatform, tags: res.data.tags || [] });
  };

  return (
    <div className="flex flex-col gap-6 min-w-0">
      {toast && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            toast.variant === "error"
              ? "bg-error/20 text-red-200"
              : toast.variant === "success"
                ? "bg-success/20 text-emerald-200"
                : "bg-white/10 text-text-primary"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="glass-card p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-promo-accent/80">Promotion kit</p>
            <h2 className="mt-1 brand-font text-xl text-text-heading">{site.siteName}</h2>
            {site.tagline && <p className="mt-1 text-sm text-text-secondary">{site.tagline}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-accent-muted/20 px-2 py-0.5 text-[10px] font-medium text-accent-muted">
                {site.territory}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                  site.status === "live" ? "bg-success/20 text-success" : "bg-white/10 text-text-muted"
                }`}
              >
                {site.status}
              </span>
            </div>
          </div>
          {site.siteUrl && (
            <a
              href={site.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 shrink-0 text-xs text-promo-accent hover:underline"
            >
              View live site
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        <section className="space-y-3">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-heading flex items-center gap-2">
              <Sparkles size={16} className="text-promo-accent" />
              Generate posts
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Choose LinkedIn or X, then generate 10 ready-to-copy posts based on your product and website.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as PromotePlatform)}
                className="rounded-lg border border-white/[0.12] bg-[rgb(10,14,22)] px-3 py-2.5 text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-promo-accent/40"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">X (Twitter)</option>
              </select>
              <KitButton
                variant="primary"
                onClick={runGenerate}
                loading={generateLoading}
                className="w-full sm:w-fit px-5 py-3"
              >
                <Megaphone size={14} />
                Generate 10 posts
              </KitButton>
            </div>
          </div>

          {visiblePosts.length > 0 && (
            <CollapsibleResultSection title={`${platformLabel(selectedPlatform)} posts`} count={visiblePosts.length}>
              {visiblePosts.map((post, i) => (
                <CollapsibleResultItem
                  key={i}
                  label={post.angle || `Post ${i + 1}`}
                  preview={post.text.slice(0, 120)}
                  defaultOpen={i === 0}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{post.text}</p>
                  <KitButton
                    variant="ghost"
                    className="mt-2"
                    onClick={() => copy(`${selectedPlatform}-${i}`, post.text)}
                  >
                    {copiedKey === `${selectedPlatform}-${i}` ? <Check size={14} /> : <Copy size={14} />}
                    Copy post
                  </KitButton>
                </CollapsibleResultItem>
              ))}
            </CollapsibleResultSection>
          )}
        </section>

        <section className="space-y-3 border-t border-white/[0.08] pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-text-heading flex items-center gap-2">
              <Hash size={16} className="text-accent-muted" />
              Bonus hashtags
            </h3>
            <KitButton onClick={runTags} loading={tagsLoading}>
              Suggest for {platformLabel(selectedPlatform)}
            </KitButton>
          </div>
          {visibleTags.length > 0 && (
            <CollapsibleResultSection title="Suggested tags" count={visibleTags.length}>
              {visibleTags.map((t) => (
                <CollapsibleResultItem key={t.tag} label={t.tag} preview={t.reason}>
                  <p className="text-sm leading-relaxed text-text-secondary">{t.reason}</p>
                  <KitButton variant="ghost" className="mt-2" onClick={() => copy(`tag-${t.tag}`, t.tag)}>
                    {copiedKey === `tag-${t.tag}` ? <Check size={14} /> : <Copy size={14} />}
                    Copy tag
                  </KitButton>
                </CollapsibleResultItem>
              ))}
              <KitButton
                variant="ghost"
                className="mt-1 w-full"
                onClick={() => copy("alltags", visibleTags.map((x) => x.tag).join(" "))}
              >
                {copiedKey === "alltags" ? <Check size={14} /> : <Copy size={14} />}
                Copy all tags
              </KitButton>
            </CollapsibleResultSection>
          )}
        </section>

        {promoLink && (
          <div className="flex flex-wrap gap-2 border-t border-white/[0.08] pt-6">
            <KitButton variant="secondary" onClick={() => copy("link", promoLink)}>
              {copiedKey === "link" ? <Check size={16} /> : <Copy size={16} />}
              Copy promotion link
            </KitButton>
            {site.siteUrl && (
              <Link href={site.siteUrl} target="_blank">
                <KitButton variant="ghost">
                  <ExternalLink size={16} className="opacity-60" />
                  Open website
                </KitButton>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
