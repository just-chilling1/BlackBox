"use client";

import { useCallback, useState } from "react";
import {
  Check,
  Copy,
  Facebook,
  FileText,
  Image as ImageIcon,
  Loader2,
  Pin,
  RefreshCw,
} from "lucide-react";
import { GENERATION_RESULTS_ID } from "@/components/ui/generation-progress";
import { PostCreateJourney } from "@/components/premium/PostCreateJourney";
import { FacebookPostCard } from "@/features/blog-builder/components/FacebookPostCard";
import type { SavedFacebookPost } from "@/features/blog-builder/lib/facebook-posts-vault";

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

export interface DfyArticleResult {
  id: string;
  title: string;
  excerpt: string;
  html: string;
}

interface DfyResultPanelProps {
  sales: DfySalesResult | null;
  pins: DfyPinResult[];
  pinsError: string;
  isGeneratingPins: boolean;
  retryingPins: boolean;
  onRetryPins: () => void;
  article: DfyArticleResult | null;
  articleError: string;
  isGeneratingArticle: boolean;
  retryingArticle: boolean;
  onRetryArticle: () => void;
  facebookPosts: SavedFacebookPost[];
  postsError: string;
  isGeneratingPosts: boolean;
  retryingPosts: boolean;
  onRetryPosts: () => void;
}

function pinImageSrc(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return null;
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export function DfyResultPanel({
  sales,
  pins,
  pinsError,
  isGeneratingPins,
  retryingPins,
  onRetryPins,
  article,
  articleError,
  isGeneratingArticle,
  retryingArticle,
  onRetryArticle,
  facebookPosts,
  postsError,
  isGeneratingPosts,
  retryingPosts,
  onRetryPosts,
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

  const hasAnything =
    Boolean(sales) ||
    pins.length > 0 ||
    Boolean(pinsError) ||
    isGeneratingPins ||
    Boolean(article) ||
    Boolean(articleError) ||
    isGeneratingArticle ||
    facebookPosts.length > 0 ||
    Boolean(postsError) ||
    isGeneratingPosts;

  if (!hasAnything) return null;

  return (
    <section id={GENERATION_RESULTS_ID} className="scroll-mt-24 space-y-4">
      <h2 className="text-lg font-medium text-text-primary">Your Done-For-You Profit kit</h2>

      {sales ? (
        <PostCreateJourney
          assetId={sales.siteId}
          publicUrl={sales.offerUrl}
          productName={sales.productName}
          pinCount={pins.length || undefined}
          title="Live sales page"
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
                      ? "Generating 3 Pinterest pins with images…"
                      : "Your pins will appear here after the sales page is ready.")}
              </p>
            </div>
          </div>
        </div>

        {isGeneratingPins && pins.length === 0 ? (
          <p className="inline-flex items-center gap-2 text-sm text-text-muted">
            <Loader2 size={14} className="animate-spin" />
            Building 3 pin images and headlines…
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
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <article className="glass-card space-y-4 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pulse-100 text-pulse-700">
            <FileText size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary">Authority article</p>
            <p className="mt-1 text-sm text-text-secondary">
              {article
                ? "Copy HTML for a site editor, or plain text for Medium and LinkedIn. Saved to your offer library."
                : articleError ||
                  (isGeneratingArticle
                    ? "Writing your authority article…"
                    : "Your article will appear here after pins are ready.")}
            </p>
          </div>
        </div>

        {isGeneratingArticle && !article ? (
          <p className="inline-flex items-center gap-2 text-sm text-text-muted">
            <Loader2 size={14} className="animate-spin" />
            Writing a long-form authority article…
          </p>
        ) : null}

        {articleError && !article ? (
          <button
            type="button"
            disabled={retryingArticle}
            onClick={onRetryArticle}
            className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {retryingArticle ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Retry article
          </button>
        ) : null}

        {article ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-text-primary">{article.title}</p>
            {article.excerpt ? (
              <p className="text-sm leading-relaxed text-text-secondary">{article.excerpt}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copyText("article-html", article.html)}
                className="btn-secondary inline-flex items-center gap-2 text-sm"
              >
                {copiedId === "article-html" ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === "article-html" ? "Copied" : "Copy HTML"}
              </button>
              <button
                type="button"
                onClick={() => void copyText("article-text", htmlToPlainText(article.html))}
                className="btn-secondary inline-flex items-center gap-2 text-sm"
              >
                {copiedId === "article-text" ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === "article-text" ? "Copied" : "Copy text"}
              </button>
            </div>
          </div>
        ) : null}
      </article>

      <article className="glass-card space-y-4 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pulse-100 text-pulse-700">
            <Facebook size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary">Facebook posts</p>
            <p className="mt-1 text-sm text-text-secondary">
              {facebookPosts.length > 0
                ? `${facebookPosts.length} variants promoting your live sales page — copy one and post.`
                : postsError ||
                  (isGeneratingPosts
                    ? "Generating 3 Facebook posts…"
                    : "Your Facebook posts will appear here after the article is ready.")}
            </p>
          </div>
        </div>

        {isGeneratingPosts && facebookPosts.length === 0 ? (
          <p className="inline-flex items-center gap-2 text-sm text-text-muted">
            <Loader2 size={14} className="animate-spin" />
            Writing 3 Facebook post variants…
          </p>
        ) : null}

        {postsError && facebookPosts.length === 0 ? (
          <button
            type="button"
            disabled={retryingPosts}
            onClick={onRetryPosts}
            className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {retryingPosts ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Retry Facebook posts
          </button>
        ) : null}

        {facebookPosts.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {facebookPosts.map((post) => (
              <FacebookPostCard key={post.id} post={post} resolvedText={post.body} />
            ))}
          </div>
        ) : null}
      </article>
    </section>
  );
}
