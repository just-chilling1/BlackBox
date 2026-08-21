import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  pinRenderBackgroundCandidates,
  productPhotoFallbackUrl,
} from "./pin-images";
import { pickFirstUnusedImageCandidate } from "@/features/blog-builder/lib/images";

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

  it("produces distinct locks across a typical pin batch", () => {
    const urls = Array.from({ length: 8 }, (_, i) =>
      productPhotoFallbackUrl("boxing gloves", i * 17 + i * 97)
    );
    const unique = new Set(urls);
    assert.equal(unique.size, urls.length);
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
