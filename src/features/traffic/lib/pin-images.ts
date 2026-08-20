import type { SupabaseClient } from "@supabase/supabase-js";
import {
  normalizeImageUrl,
  persistExternalImage,
  resolveFastImageUrl,
} from "@/features/blog-builder/lib/images";
import { SiteImagePool } from "@/features/blog-builder/lib/site-image-pool";
import type { PinCopy } from "@/features/traffic/lib/pin-rules";

const STOP = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "for",
  "to",
  "of",
  "in",
  "on",
  "with",
  "your",
  "review",
  "reviews",
  "honest",
  "worth",
  "product",
  "featured",
  "pin",
  "2024",
  "2025",
  "2026",
]);

function productSearchTokens(productName: string): string[] {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w));
}

/** Pixabay queries anchored to the product name — never pin-headline fluff. */
function productStockQueries(productName: string, hobby?: string | null): string[] {
  const tokens = productSearchTokens(productName);
  const base = tokens.length > 0 ? tokens.join(" ") : "";

  if (!base) {
    const hobbyBits = (hobby || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s&]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w));
    return hobbyBits.length
      ? [`${hobbyBits.slice(0, 4).join(" ")} product`, hobbyBits.slice(0, 3).join(" ")]
      : [];
  }

  const queries = [`${base} product`, base];

  const combat = /box|glove|mma|martial|kick|sparr|punch/i.test(`${productName} ${hobby || ""}`);
  if (combat) {
    if (/glove/i.test(productName)) {
      queries.push("boxing gloves", "mma gloves", "red boxing glove", "sparring gloves");
    } else {
      queries.push("boxing training", "punching bag", "boxing ring");
    }
  }

  const fitness = /fitness|gym|sport|workout/i.test(hobby || "");
  if (fitness && !combat) queries.push(`${tokens[0]} fitness`);

  return [...new Set(queries.filter(Boolean))].slice(0, 6);
}

/**
 * Product-tagged Flickr photos via LoremFlickr — works without API keys and
 * stays related to the product (unlike random Picsum).
 */
export function productPhotoFallbackUrl(productName: string, seed = 0): string | null {
  const tags = productSearchTokens(productName).slice(0, 3);
  if (tags.length === 0) return null;
  const lock = Math.abs(seed) % 10_000;
  return `https://loremflickr.com/1200/675/${encodeURIComponent(tags.join(","))}/all?lock=${lock}`;
}

function pollinationsProductUrl(
  productName: string,
  pinIdx: number,
  width = 1200,
  height = 675
): string {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    `photorealistic product photo of ${productName}, clean studio lighting, no text, no watermark`
  )}?width=${width}&height=${height}&nologo=true&seed=${pinIdx * 31 + 7}`;
}

/**
 * Ordered background candidates for the pin OG image renderer.
 * Per-pin unique fallbacks must come before the shared money-page hero,
 * otherwise every pin collapses to the same photo when source_image_url is missing.
 */
export function pinRenderBackgroundCandidates(params: {
  sourceImageUrl?: string | null;
  pinImageUrl?: string | null;
  heroImage?: string | null;
  productName: string;
  pinIdx: number;
  headline: string;
  width?: number;
  height?: number;
}): string[] {
  const width = params.width ?? 1200;
  const height = params.height ?? 675;
  const uniqueFallback = productPhotoFallbackUrl(
    params.productName,
    params.pinIdx * 17 + params.headline.length
  );
  const aiFallback = params.productName.trim()
    ? pollinationsProductUrl(params.productName, params.pinIdx, width, height)
    : null;

  return [
    params.sourceImageUrl,
    params.pinImageUrl,
    uniqueFallback,
    aiFallback,
    // Shared money-page hero is last — never the default for every pin.
    params.heroImage,
  ].filter((u): u is string => Boolean(u?.trim()));
}

/**
 * Resolve unique Pinterest pin backgrounds:
 * one preferred hero (pin 0) → Pixabay product stock (varied) → scrape fallback → tagged photos.
 *
 * Always prefer stock after the first preferred slot so every pin does not re-scrape
 * the same affiliate og:image (often stored under a different persisted URL than the hero).
 * Every returned URL is unique within the batch (and vs preferred/prior images).
 */
export async function resolvePinBackgroundImages(params: {
  pins: PinCopy[];
  productName: string;
  hobby?: string | null;
  scrapeUrl?: string | null;
  scrapeUrls?: string[];
  preferredImages?: (string | null | undefined)[];
  /** Already-used backgrounds (prior batches) — never reuse these. */
  excludeImages?: (string | null | undefined)[];
  userId: string;
  supabase: SupabaseClient;
}): Promise<(string | null)[]> {
  const pool = new SiteImagePool();
  const results: (string | null)[] = [];
  const usedKeys = new Set<string>();

  const collectHttpUrls = (list: (string | null | undefined)[] | undefined) =>
    [
      ...new Set(
        (list ?? []).filter((u): u is string => {
          if (typeof u !== "string") return false;
          const trimmed = u.trim();
          return trimmed.length > 0 && /^https?:\/\//i.test(trimmed) && !/picsum\.photos/i.test(trimmed);
        })
      ),
    ];

  const preferred = collectHttpUrls(params.preferredImages);
  const excluded = collectHttpUrls(params.excludeImages);

  const markUsed = (...urls: (string | null | undefined)[]) => {
    for (const url of urls) {
      if (!url?.trim()) continue;
      usedKeys.add(normalizeImageUrl(url));
      pool.seed([{ url, stockId: normalizeImageUrl(url) }]);
    }
  };

  const isUsed = (url: string | null | undefined) =>
    Boolean(url?.trim() && usedKeys.has(normalizeImageUrl(url)));

  const heroForFirstPin = preferred[0] ?? null;

  // Exclude prior/extra-batch images and preferred aliases — but leave the first-pin
  // hero free so it can be claimed exactly once.
  markUsed(...excluded, ...preferred.slice(1));
  if (heroForFirstPin) {
    // Still exclude hero aliases from stock/scrape for pins 1+ by seeding the pool
    // without blocking the explicit pin-0 claim below.
    pool.seed([{ url: heroForFirstPin, stockId: normalizeImageUrl(heroForFirstPin) }]);
  }

  const stockQueries = productStockQueries(params.productName, params.hobby);
  const productTokens = productSearchTokens(params.productName);

  const pickUnusedFallback = (pinIdx: number, headlineLen: number): string | null => {
    for (let attempt = 0; attempt < 12; attempt++) {
      const candidate = productPhotoFallbackUrl(
        params.productName,
        pinIdx * 17 + productTokens.length + headlineLen + attempt * 97
      );
      if (candidate && !isUsed(candidate)) return candidate;
    }
    const ai = params.productName.trim()
      ? pollinationsProductUrl(params.productName, pinIdx * 50 + headlineLen + usedKeys.size)
      : null;
    return ai && !isUsed(ai) ? ai : null;
  };

  for (let i = 0; i < params.pins.length; i++) {
    const pin = params.pins[i];
    const keywords = [
      ...productTokens,
      ...(pin.keywords ?? []).flatMap((k) => productSearchTokens(k)),
    ].slice(0, 12);

    let chosen: string | null = null;

    // 1) At most one known product photo (money-page hero) on the first pin.
    if (i === 0 && heroForFirstPin && !isUsed(heroForFirstPin)) {
      chosen = heroForFirstPin;
    }

    // 2) Product-name Pixabay first (horizontal), scrape only as fallback.
    if (!chosen) {
      const queryList =
        stockQueries.length > 0 ? stockQueries : [params.productName.trim()].filter(Boolean);
      const rotated = [
        ...queryList.slice(i % queryList.length),
        ...queryList.slice(0, i % queryList.length),
      ];
      for (let q = 0; q < rotated.length && !chosen; q++) {
        try {
          const resolved = await pool.resolveUnique({
            title: pin.headline || pin.title || params.productName,
            subject: [
              params.productName,
              "Photorealistic product photo matching this exact product",
              "horizontal landscape composition",
              "no text overlay",
            ].join(". "),
            hobby: params.hobby?.trim() || undefined,
            // Avoid scrape for later pins — affiliate og:image is almost always the same hero.
            scrapeUrl:
              i === 0 && q === rotated.length - 1
                ? params.scrapeUrl?.trim() || undefined
                : undefined,
            scrapeUrls:
              i === 0 && q === rotated.length - 1 ? params.scrapeUrls : undefined,
            scrapeKeywords: keywords.length ? keywords : productTokens,
            pickOffset: i * 3 + q,
            seedBoost: i * 11 + q * 3 + keywords.length + (pin.headline?.length ?? 0) + usedKeys.size,
            customQuery: rotated[q],
            orientation: "horizontal",
            preferStock: true,
            allowPicsumFallback: false,
          });
          if (resolved.url && !isUsed(resolved.url)) {
            chosen = resolved.url;
          }
        } catch {
          // try next query
        }
      }
    }

    // 3) Product-tagged / AI fallback — must be unused.
    if (!chosen || isUsed(chosen)) {
      chosen = pickUnusedFallback(i, pin.headline?.length ?? 0);
    }

    if (!chosen || isUsed(chosen)) {
      results.push(null);
      continue;
    }

    try {
      const persisted = await persistExternalImage({
        url: chosen,
        userId: params.userId,
        supabase: params.supabase,
      });
      let finalUrl = persisted ?? chosen;

      // Persisted CDN path might collide with an earlier pin — force a fresh fallback.
      if (isUsed(finalUrl) && normalizeImageUrl(finalUrl) !== normalizeImageUrl(chosen)) {
        const retry = pickUnusedFallback(i, (pin.headline?.length ?? 0) + 13);
        if (!retry) {
          results.push(null);
          continue;
        }
        chosen = retry;
        const persistedRetry = await persistExternalImage({
          url: retry,
          userId: params.userId,
          supabase: params.supabase,
        });
        finalUrl = persistedRetry ?? retry;
        if (isUsed(finalUrl)) {
          results.push(null);
          continue;
        }
      } else if (isUsed(finalUrl)) {
        results.push(null);
        continue;
      }

      results.push(finalUrl);
      markUsed(chosen, finalUrl);
    } catch {
      if (isUsed(chosen)) {
        results.push(null);
        continue;
      }
      results.push(chosen);
      markUsed(chosen);
    }

    // If pin 0 skipped the hero, still burn it so later pins never reuse it.
    if (i === 0 && heroForFirstPin && !isUsed(heroForFirstPin)) {
      markUsed(heroForFirstPin);
    }
  }

  return results;
}
