"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
import { THREADS_PER_GENERATION, THREADS_WITH_IMAGES } from "../lib/promote-constants";
import { ThreadCard } from "./ThreadCard";
import { ThreadListSection } from "./ThreadListSection";
import type {
  PromotePlatform,
  PublishKitSite,
  SocialPostResult,
} from "../types";
import type { ThreadGenerationQuota } from "../lib/thread-generation-quota";

const THREAD_COUNT = THREADS_PER_GENERATION;
const PROMOTE_PLATFORM = "twitter" as const;

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
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 bg-white px-4 py-3 transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        <ChevronDown
          size={16}
          className="shrink-0 text-slate-500 transition-transform group-open:rotate-180"
        />
        <span className="min-w-0 flex-1 text-sm font-semibold text-slate-900">{title}</span>
        {count !== undefined && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {count}
          </span>
        )}
      </summary>
      <div className="space-y-2 border-t border-slate-200 bg-slate-50 p-2">{children}</div>
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
      className="group overflow-hidden rounded-lg border border-slate-200 bg-white"
    >
      <summary className="flex cursor-pointer list-none items-start gap-2 bg-white px-3 py-2.5 transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        <ChevronDown
          size={14}
          className="mt-0.5 shrink-0 text-slate-500 transition-transform group-open:rotate-180"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-accent">{label}</p>
          {preview && (
            <p className="mt-0.5 line-clamp-2 text-sm text-slate-800 group-open:hidden">{preview}</p>
          )}
        </div>
      </summary>
      <div className="border-t border-slate-200 bg-white px-3 py-3">{children}</div>
    </details>
  );
}

function KitButton({
  children,
  onClick,
  loading,
  disabled,
  variant = "secondary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-br from-accent to-[#C9970D] text-text-on-accent shadow-gold hover:brightness-110"
      : variant === "ghost"
        ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        : "btn-subtle";

  return (
    <button type="button" onClick={onClick} disabled={loading || disabled} className={`${base} ${styles} ${className}`}>
      {loading ? <Loader2 size={14} className="animate-spin" /> : null}
      {children}
    </button>
  );
}

export function PublishKitPanel({ site }: { site: PublishKitSite }) {
  const [posts, setPosts] = useState<SocialPostResult[]>([]);
  const [tags, setTags] = useState<{ tag: string; reason: string }[]>([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [quota, setQuota] = useState<ThreadGenerationQuota | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" | "info" } | null>(null);

  const visiblePosts = posts;
  const visibleTags = tags;

  const promoLink = useMemo(() => site.affiliateLink || site.siteUrl || "", [site]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    setContentLoading(true);
    void fetchJson<{
      quota: ThreadGenerationQuota;
      threads?: { text: string; angle: string | null; image_url?: string | null }[];
      tags?: { tag: string; reason: string }[];
    }>(`/api/promote/social-posts?siteId=${encodeURIComponent(site.siteId)}`)
      .then((res) => {
        if (!res.ok) return;
        if (res.data.quota) setQuota(res.data.quota);
        if (Array.isArray(res.data.threads)) {
          setPosts(
            res.data.threads.map((thread) => ({
              text: thread.text,
              angle: thread.angle || undefined,
              imageUrl: thread.image_url || undefined,
            }))
          );
        } else {
          setPosts([]);
        }
        if (Array.isArray(res.data.tags)) {
          setTags(res.data.tags);
        } else {
          setTags([]);
        }
      })
      .catch(() => {})
      .finally(() => setContentLoading(false));
  }, [site.siteId]);

  const quotaBlocked = quota !== null && quota.remaining <= 0;

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
      showToast("Add an affiliate link or publish your site before generating threads.", "info");
      return;
    }

    setGenerateLoading(true);
    const res = await fetchJson<{
      platform: PromotePlatform;
      posts: SocialPostResult[];
      quota?: ThreadGenerationQuota;
    }>("/api/promote/social-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteId: site.siteId,
        siteUrl: site.siteUrl,
        platform: PROMOTE_PLATFORM,
      }),
    });
    setGenerateLoading(false);

    if (!res.ok) {
      showToast(res.error, "error");
      return;
    }

    setPosts(res.data.posts || []);
    if (res.data.quota) setQuota(res.data.quota);
    showToast(`${THREAD_COUNT} X threads ready — first ${THREADS_WITH_IMAGES} include niche images`, "success");
  };

  const runTags = async () => {
    setTagsLoading(true);
    const res = await fetchJson<{ tags: { tag: string; reason: string }[] }>("/api/suggest-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteId: site.siteId,
        platform: PROMOTE_PLATFORM,
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
    setTags(res.data.tags || []);
  };

  return (
    <div className="flex flex-col gap-6 min-w-0">
      {toast && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            toast.variant === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : toast.variant === "success"
                ? "border-accent/30 bg-accent/10 text-text-heading"
                : "border-slate-200 bg-slate-100 text-slate-800"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="glass-card p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800">X-Power Promotions</p>
            <h2 className="mt-1 brand-font text-xl text-text-heading">{site.siteName}</h2>
            {site.tagline && <p className="mt-1 text-sm text-text-secondary">{site.tagline}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                {site.territory}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                  site.status === "live" ? "border border-accent/25 bg-accent/10 text-accent" : "bg-slate-100 text-slate-600"
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
              className="text-link-action shrink-0 text-xs"
            >
              View live site
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        <section className="space-y-3">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-heading flex items-center gap-2">
              <Sparkles size={16} className="text-accent" />
              Generate threads
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Generate {THREAD_COUNT} ready-to-copy X threads based on your product and website.
              The first {THREADS_WITH_IMAGES} threads include scraped product or stock niche images.
            </p>
            {contentLoading ? (
              <p className="text-sm text-text-muted flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Loading saved promotion content...
              </p>
            ) : null}
            {quota && (
              <p className="text-xs font-medium text-text-secondary">
                {quota.remaining} of {quota.limit} generations remaining today
              </p>
            )}
            <KitButton
              variant="primary"
              onClick={runGenerate}
              loading={generateLoading}
              disabled={quotaBlocked}
              className="w-full sm:w-fit px-5 py-3"
            >
              <Megaphone size={14} />
              {generateLoading
                ? `Generating ${THREAD_COUNT} threads + ${THREADS_WITH_IMAGES} images`
                : `Generate ${THREAD_COUNT} threads`}
            </KitButton>
          </div>

          {visiblePosts.length > 0 && (
            <ThreadListSection title="X threads" count={visiblePosts.length}>
              {visiblePosts.map((post, i) => (
                <ThreadCard
                  key={i}
                  index={i + 1}
                  label={post.angle || `Thread ${i + 1}`}
                  text={post.text}
                  imageUrl={post.imageUrl}
                  defaultOpen={i === 0}
                />
              ))}
            </ThreadListSection>
          )}
        </section>

        <section className="space-y-3 border-t border-border-dim pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-text-heading flex items-center gap-2">
              <Hash size={16} className="text-accent" />
              Bonus hashtags
            </h3>
            <KitButton onClick={runTags} loading={tagsLoading}>
              Suggest for X
            </KitButton>
          </div>
          {visibleTags.length > 0 && (
            <CollapsibleResultSection title="Suggested tags" count={visibleTags.length}>
              {visibleTags.map((t) => (
                <CollapsibleResultItem key={t.tag} label={t.tag} preview={t.reason}>
                  <p className="text-sm leading-relaxed text-slate-800">{t.reason}</p>
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
          <div className="flex flex-wrap gap-2 border-t border-border-dim pt-6">
            <KitButton variant="secondary" onClick={() => copy("link", promoLink)}>
              {copiedKey === "link" ? <Check size={16} /> : <Copy size={16} />}
              Copy promotion link
            </KitButton>
          </div>
        )}
      </div>
    </div>
  );
}
