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

/** Hero + 10 pins per vault page. */
export const VAULT_IMAGE_SLOT_COUNT = 11;
/** At least 25% of images must be niche/product-related stock (never AI). */
export const VAULT_NICHE_IMAGE_RATIO = 0.25;

function nicheRelatedSlotCount(total = VAULT_IMAGE_SLOT_COUNT): number {
  return Math.max(1, Math.ceil(total * VAULT_NICHE_IMAGE_RATIO));
}

function markUsed(used: Set<string>, url: string | null | undefined) {
  if (url?.trim()) used.add(normalizeImageUrl(url));
}

function nichePhotoFallbackUrl(
  entry: VaultCatalogEntry,
  slot: number,
  used: Set<string>
): string | null {
  const nicheTags = entry.niche
    .toLowerCase()
    .replace(/[^a-z0-9\s&]/g, " ")
    .split(/[\s&]+/)
    .filter((w) => w.length > 2)
    .slice(0, 3);
  const productTags = productSearchTokens(entry.productName).slice(0, 2);
  const tags = [...productTags, ...nicheTags].filter(Boolean).slice(0, 3);
  if (tags.length === 0) return null;

  for (let attempt = 0; attempt < 24; attempt++) {
    const lock = Math.abs(entry.id * 9973 + slot * 131 + attempt * 7919 + 17) % 100_000;
    const candidate = `https://loremflickr.com/1000/1500/${encodeURIComponent(tags.join(","))}/all?lock=${lock}`;
    if (!used.has(normalizeImageUrl(candidate))) return candidate;
  }
  return null;
}

/**
 * Resolve one unique non-AI image for a vault slot.
 * Niche-related slots try Pixabay niche queries, then tagged LoremFlickr.
 * Other slots use unique product/picsum fallbacks. Never generates AI images.
 */
export async function resolveUniqueVaultImage(params: {
  entry: VaultCatalogEntry;
  slot: number;
  used: Set<string>;
  nicheRelated: boolean;
}): Promise<string> {
  const { entry, slot, used, nicheRelated } = params;
  let chosen: string | null = null;

  if (nicheRelated) {
    const stock = await fetchNicheRelatedImage({
      niche: entry.niche,
      productName: entry.productName,
      seedOffset: entry.id * 31 + slot * 19 + used.size,
      excludeUrls: [...used],
    });
    if (stock && !used.has(normalizeImageUrl(stock))) {
      chosen = stock;
    }
    if (!chosen) {
      chosen = nichePhotoFallbackUrl(entry, slot, used);
    }
  }

  if (!chosen || used.has(normalizeImageUrl(chosen))) {
    chosen = uniquePinFallbackUrl({
      productName: entry.productName,
      pinIdx: slot,
      usedKeys: used,
      hobby: entry.niche,
      headlineLen: (entry.productSummary?.length ?? 0) + entry.id,
    });
  }

  if (!chosen) {
    chosen = `https://picsum.photos/seed/vault-${entry.id}-${slot}-${used.size}/1000/1500`;
  }

  markUsed(used, chosen);
  return chosen;
}

/**
 * Pre-seed image pack for one catalog entry: 1 hero + 10 pin backgrounds.
 * ~25% niche/product-related; all unique within `used` (pass a global set when seeding 200).
 */
export async function resolveVaultSeedImagePack(params: {
  entry: VaultCatalogEntry;
  used?: Set<string>;
}): Promise<{ heroImage: string; pinImages: string[] }> {
  const used = params.used ?? new Set<string>();
  const nicheSlots = nicheRelatedSlotCount(VAULT_IMAGE_SLOT_COUNT);
  const urls: string[] = [];

  for (let slot = 0; slot < VAULT_IMAGE_SLOT_COUNT; slot++) {
    urls.push(
      await resolveUniqueVaultImage({
        entry: params.entry,
        slot,
        used,
        nicheRelated: slot < nicheSlots,
      })
    );
  }

  return { heroImage: urls[0], pinImages: urls.slice(1) };
}

/** Scrape the affiliate page, else a niche-related stock photo. Empty = no sales-page image. */
export async function resolveVaultHeroImage(params: {
  productName: string;
  niche: string;
  scrapeUrl?: string | null;
  used?: Set<string>;
}): Promise<string> {
  const scrapeUrl = params.scrapeUrl?.trim() || "";
  const used = params.used ?? new Set<string>();

  if (scrapeUrl) {
    const admin = getServiceRoleClient();
    const scraped = await scrapePageWithCache(scrapeUrl, admin);
    const hero = scraped.data?.imageUrl?.trim() || "";
    if (hero && !used.has(normalizeImageUrl(hero))) {
      markUsed(used, hero);
      return hero;
    }
  }

  const nicheImage = await fetchNicheRelatedImage({
    niche: params.niche,
    productName: params.productName,
    excludeUrls: [...used],
  });
  if (nicheImage && !used.has(normalizeImageUrl(nicheImage))) {
    markUsed(used, nicheImage);
    return nicheImage;
  }

  return "";
}

/**
 * 10 vault pin backgrounds: scraped affiliate images first, then unique non-AI photos.
 * Never reuses the hero on any pin (fixes duplicated selected images).
 * Never generates AI images. At least ~25% prefer niche-related stock when scrape is thin.
 */
export async function resolveVaultPinDrafts(params: {
  entry: VaultCatalogEntry;
  scrapeUrl?: string | null;
  heroImage?: string | null;
  /** When provided (e.g. from seed), use these URLs in order instead of resolving. */
  preloadedPinImages?: string[] | null;
  userId?: string;
  supabase?: SupabaseClient | null;
}): Promise<VaultPinDraft[]> {
  const drafts = buildVaultPinDrafts(params.entry);
  const productName = params.entry.productName;
  const scrapeUrl = params.scrapeUrl?.trim() || "";
  const used = new Set<string>();
  markUsed(used, params.heroImage);

  if (params.preloadedPinImages?.length) {
    const results: VaultPinDraft[] = [];
    for (let i = 0; i < drafts.length; i++) {
      const draft = drafts[i];
      let finalUrl =
        params.preloadedPinImages[i]?.trim() ||
        (await resolveUniqueVaultImage({
          entry: params.entry,
          slot: i + 1,
          used,
          nicheRelated: i < nicheRelatedSlotCount(drafts.length),
        }));
      markUsed(used, finalUrl);

      if (params.userId && params.supabase) {
        try {
          const persisted = await persistExternalImage({
            url: finalUrl,
            userId: params.userId,
            supabase: params.supabase,
          });
          finalUrl = persisted ?? finalUrl;
          markUsed(used, finalUrl);
        } catch {
          /* keep remote URL */
        }
      }

      results.push({ ...draft, imageUrl: finalUrl });
    }
    return results;
  }

  const scrapedCandidates = scrapeUrl
    ? await collectScrapedImageCandidates({
        scrapeUrl,
        scrapeKeywords: productSearchTokens(productName),
        limit: Math.max(24, drafts.length * 3),
      })
    : [];

  const nichePinTarget = nicheRelatedSlotCount(drafts.length);
  let nicheAssigned = 0;
  const results: VaultPinDraft[] = [];

  for (let i = 0; i < drafts.length; i++) {
    const draft = drafts[i];
    let chosen: string | null = null;
    const preferNiche = nicheAssigned < nichePinTarget;

    if (scrapedCandidates.length > 0) {
      const scraped = await pickUnusedScrapedImageUrl({
        candidates: scrapedCandidates,
        excludeUrls: [...used],
      });
      if (scraped && !used.has(normalizeImageUrl(scraped))) {
        chosen = scraped;
      }
    }

    if (!chosen && preferNiche) {
      const nicheImage = await fetchNicheRelatedImage({
        niche: params.entry.niche,
        productName,
        seedOffset: i * 19 + (draft.headline?.length ?? 0) + used.size,
        excludeUrls: [...used],
      });
      if (nicheImage && !used.has(normalizeImageUrl(nicheImage))) {
        chosen = nicheImage;
        nicheAssigned++;
      } else {
        const tagged = nichePhotoFallbackUrl(params.entry, i + 1, used);
        if (tagged) {
          chosen = tagged;
          nicheAssigned++;
        }
      }
    }

    if (!chosen || used.has(normalizeImageUrl(chosen))) {
      chosen = await resolveUniqueVaultImage({
        entry: params.entry,
        slot: i + 1,
        used,
        nicheRelated: preferNiche && nicheAssigned < nichePinTarget,
      });
      if (preferNiche && nicheAssigned < nichePinTarget) nicheAssigned++;
    } else {
      markUsed(used, chosen);
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
        markUsed(used, finalUrl);
      } catch {
        finalUrl = chosen;
      }
    }

    results.push({ ...draft, imageUrl: finalUrl });
  }

  return results;
}
