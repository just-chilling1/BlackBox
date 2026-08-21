import type { SupabaseClient } from "@supabase/supabase-js";
import { getServiceRoleClient } from "@/lib/api-auth";
import { scrapePageWithCache } from "@/features/blog-builder/lib/scrape-cache";
import {
  collectScrapedImageCandidates,
  fetchNicheRelatedImage,
  normalizeImageUrl,
  persistExternalImage,
  pickUnusedScrapedImageUrl,
} from "@/features/blog-builder/lib/images";
import { uniquePinFallbackUrl } from "@/features/traffic/lib/pin-images";
import { productSearchTokens } from "@/features/traffic/lib/product-label";
import type { VaultCatalogEntry } from "./catalog";
import { buildVaultPinDrafts, type VaultPinDraft } from "./vault-pins";

/** Scrape the affiliate page, else a niche-related stock photo. Empty = no sales-page image. */
export async function resolveVaultHeroImage(params: {
  productName: string;
  niche: string;
  scrapeUrl?: string | null;
}): Promise<string> {
  const scrapeUrl = params.scrapeUrl?.trim() || "";
  if (scrapeUrl) {
    const admin = getServiceRoleClient();
    const scraped = await scrapePageWithCache(scrapeUrl, admin);
    const hero = scraped.data?.imageUrl?.trim() || "";
    if (hero) return hero;
  }

  return (
    (await fetchNicheRelatedImage({
      niche: params.niche,
      productName: params.productName,
    })) ?? ""
  );
}

/**
 * 10 vault pin backgrounds: scraped affiliate images first, then any non-AI photo.
 * Never generates AI images.
 */
export async function resolveVaultPinDrafts(params: {
  entry: VaultCatalogEntry;
  scrapeUrl?: string | null;
  heroImage?: string | null;
  userId?: string;
  supabase?: SupabaseClient | null;
}): Promise<VaultPinDraft[]> {
  const drafts = buildVaultPinDrafts(params.entry);
  const productName = params.entry.productName;
  const scrapeUrl = params.scrapeUrl?.trim() || "";
  const used = new Set<string>();

  const mark = (url: string | null | undefined) => {
    if (url?.trim()) used.add(normalizeImageUrl(url));
  };

  const scrapedCandidates = scrapeUrl
    ? await collectScrapedImageCandidates({
        scrapeUrl,
        scrapeKeywords: productSearchTokens(productName),
        limit: Math.max(24, drafts.length * 3),
      })
    : [];

  const results: VaultPinDraft[] = [];

  for (let i = 0; i < drafts.length; i++) {
    const draft = drafts[i];
    let chosen: string | null = null;

    if (i === 0 && params.heroImage && !used.has(normalizeImageUrl(params.heroImage))) {
      chosen = params.heroImage;
    }

    if (!chosen && scrapedCandidates.length > 0) {
      const scraped = await pickUnusedScrapedImageUrl({
        candidates: scrapedCandidates,
        excludeUrls: [...used],
      });
      if (scraped && !used.has(normalizeImageUrl(scraped))) {
        chosen = scraped;
      }
    }

    if (!chosen) {
      const nicheImage = await fetchNicheRelatedImage({
        niche: params.entry.niche,
        productName,
        seedOffset: i * 19 + (draft.headline?.length ?? 0) + used.size,
      });
      if (nicheImage && !used.has(normalizeImageUrl(nicheImage))) {
        chosen = nicheImage;
      }
    }

    if (!chosen || used.has(normalizeImageUrl(chosen))) {
      chosen = uniquePinFallbackUrl({
        productName,
        pinIdx: i,
        usedKeys: used,
        hobby: params.entry.niche,
        headlineLen: draft.headline?.length ?? 0,
      });
    }

    if (!chosen) {
      results.push(draft);
      continue;
    }

    let finalUrl = chosen;
    if (params.userId && params.supabase) {
      try {
        const persisted = await persistExternalImage({
          url: chosen,
          userId: params.userId,
          supabase: params.supabase,
        });
        finalUrl = persisted ?? chosen;
      } catch {
        finalUrl = chosen;
      }
    }

    mark(chosen);
    mark(finalUrl);
    results.push({ ...draft, imageUrl: finalUrl });
  }

  return results;
}
