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
    if (/glove/i.test(productName)) queries.push("boxing gloves");
    else queries.push("boxing training");
  }

  const fitness = /fitness|gym|sport|workout/i.test(hobby || "");
  if (fitness && !combat) queries.push(`${tokens[0]} fitness`);

  return [...new Set(queries.filter(Boolean))].slice(0, 4);
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

/**
 * Resolve unique Pinterest pin backgrounds:
 * preferred scraped/hero → affiliate scrape → Pixabay → product-tagged photos.
 */
export async function resolvePinBackgroundImages(params: {
  pins: PinCopy[];
  productName: string;
  hobby?: string | null;
  scrapeUrl?: string | null;
  scrapeUrls?: string[];
  preferredImages?: (string | null | undefined)[];
  userId: string;
  supabase: SupabaseClient;
}): Promise<(string | null)[]> {
  const pool = new SiteImagePool();
  const results: (string | null)[] = [];
  const preferred = [
    ...new Set(
      (params.preferredImages ?? []).filter(
        (u): u is string => Boolean(u?.trim()) && /^https?:\/\//i.test(u.trim()) && !/picsum\.photos/i.test(u)
      )
    ),
  ];
  const stockQueries = productStockQueries(params.productName, params.hobby);
  const productTokens = productSearchTokens(params.productName);

  for (let i = 0; i < params.pins.length; i++) {
    const pin = params.pins[i];
    const keywords = [
      ...productTokens,
      ...(pin.keywords ?? []).flatMap((k) => productSearchTokens(k)),
    ].slice(0, 12);

    let chosen: string | null = null;

    // 1) Seed early pins with known product photos (hero / scraped).
    if (i < preferred.length) {
      chosen = preferred[i];
    }

    // 2) Scrape + product-name Pixabay (horizontal for landscape cards).
    if (!chosen) {
      const queryList =
        stockQueries.length > 0 ? stockQueries : [params.productName.trim()].filter(Boolean);
      for (let q = 0; q < queryList.length && !chosen; q++) {
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
            scrapeUrl: params.scrapeUrl?.trim() || undefined,
            scrapeUrls: params.scrapeUrls,
            scrapeKeywords: keywords.length ? keywords : productTokens,
            pickOffset: i + q,
            seedBoost: i * 11 + q * 3 + keywords.length,
            customQuery: queryList[q],
            orientation: "horizontal",
            preferStock: q > 0 || !params.scrapeUrl,
            allowPicsumFallback: false,
          });
          if (resolved.url) chosen = resolved.url;
        } catch {
          // try next query
        }
      }
    }

    // 3) Product-tagged stock photo (no API key required).
    if (!chosen) {
      chosen = productPhotoFallbackUrl(params.productName, i * 17 + productTokens.length);
    }

    // 4) Reuse a preferred product photo rather than leaving the pin blank.
    if (!chosen && preferred.length > 0) {
      chosen = preferred[i % preferred.length];
    }

    if (!chosen) {
      results.push(null);
      continue;
    }

    try {
      const persisted = await persistExternalImage({
        url: chosen,
        userId: params.userId,
        supabase: params.supabase,
      });
      const finalUrl = persisted ?? chosen;
      results.push(finalUrl);
      pool.seed([{ url: finalUrl, stockId: normalizeImageUrl(finalUrl) }]);
    } catch {
      results.push(chosen);
      pool.seed([{ url: chosen, stockId: normalizeImageUrl(chosen) }]);
    }
  }

  return results;
}
