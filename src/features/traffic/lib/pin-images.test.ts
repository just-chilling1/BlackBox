import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  pinRenderBackgroundCandidates,
  productPhotoFallbackUrl,
} from "./pin-images";
import { cleanProductLabel } from "./product-label";
import { pickFirstUnusedImageCandidate } from "@/features/blog-builder/lib/images";

describe("cleanProductLabel", () => {
  it("strips review-headline fluff down to the product name", () => {
    assert.equal(
      cleanProductLabel("Should You Buy Melatonin? What to Check First"),
      "melatonin"
    );
    assert.equal(cleanProductLabel("Is Melatonin Worth It? An Honest Look"), "melatonin");
    assert.equal(cleanProductLabel("Melatonin"), "melatonin");
  });
});

describe("pinRenderBackgroundCandidates", () => {
  it("does not put the shared hero ahead of unique per-pin fallbacks", () => {
    const hero = "https://cdn.example.com/boxing-hero.jpg";
    const a = pinRenderBackgroundCandidates({
      heroImage: hero,
      productName: "Is boxing gloves Worth It? An Honest Look",
      pinIdx: 0,
      headline: "7 things nobody tells you",
    });
    const b = pinRenderBackgroundCandidates({
      heroImage: hero,
      productName: "Is boxing gloves Worth It? An Honest Look",
      pinIdx: 1,
      headline: "Is it worth it in 2026?",
    });

    assert.notEqual(a[0], hero);
    assert.notEqual(b[0], hero);
    assert.notEqual(a[0], b[0]);
    // Pins after the first must never fall back to the shared hero.
    assert.ok(!b.includes(hero));
  });

  it("still prefers an explicit source image when present", () => {
    const source = "https://cdn.example.com/pin-0.jpg";
    const hero = "https://cdn.example.com/boxing-hero.jpg";
    const candidates = pinRenderBackgroundCandidates({
      sourceImageUrl: source,
      heroImage: hero,
      productName: "boxing gloves",
      pinIdx: 2,
      headline: "Honest review",
    });
    assert.equal(candidates[0], source);
  });
});

describe("productPhotoFallbackUrl", () => {
  it("varies by seed for the same boxing product", () => {
    const a = productPhotoFallbackUrl("boxing gloves", 0);
    const b = productPhotoFallbackUrl("boxing gloves", 17);
    assert.ok(a);
    assert.ok(b);
    assert.notEqual(a, b);
  });

  it("uses cleaned product tags instead of review-title fluff", () => {
    const url = productPhotoFallbackUrl("Should You Buy Melatonin? What to Check First", 3);
    assert.ok(url);
    assert.match(url!, /melatonin/i);
    assert.doesNotMatch(url!, /should/i);
  });

  it("produces distinct locks across a typical pin batch", () => {
    const urls = Array.from({ length: 8 }, (_, i) =>
      productPhotoFallbackUrl("boxing gloves", i * 97 + i * 7919 + 42)
    );
    const unique = new Set(urls);
    assert.equal(unique.size, urls.length);
  });
});

describe("uniquePinFallbackUrl", () => {
  it("returns distinct URLs for each pin index in a batch", async () => {
    const { uniquePinFallbackUrl } = await import("./pin-images");
    const { normalizeImageUrl } = await import("@/features/blog-builder/lib/images");
    const used = new Set<string>();
    const urls: string[] = [];
    for (let i = 0; i < 10; i++) {
      const url = uniquePinFallbackUrl({
        productName: "apple",
        pinIdx: i,
        usedKeys: used,
        headlineLen: 12 + i,
      });
      assert.ok(url);
      urls.push(url!);
      used.add(normalizeImageUrl(url!));
    }
    assert.equal(new Set(urls.map((u) => normalizeImageUrl(u))).size, 10);
  });
});

describe("pickFirstUnusedImageCandidate", () => {
  it("never returns the same scraped url twice for sequential picks", () => {
    const candidates = [
      "https://cdn.example.com/scraped-a.jpg",
      "https://cdn.example.com/scraped-b.jpg",
      "https://cdn.example.com/scraped-a.jpg?size=large",
    ];
    const first = pickFirstUnusedImageCandidate(candidates, []);
    assert.equal(first, candidates[0]);

    const second = pickFirstUnusedImageCandidate(candidates, [first!]);
    assert.equal(second, candidates[1]);

    const third = pickFirstUnusedImageCandidate(candidates, [first!, second!]);
    assert.equal(third, null);
  });
});
