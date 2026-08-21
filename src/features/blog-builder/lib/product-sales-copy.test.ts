import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deriveProductName, isNicheFallbackProductName } from "./product-sales-copy";

describe("deriveProductName", () => {
  it("rejects generic scraped titles like Google", () => {
    assert.equal(
      deriveProductName({
        niche: "Health & Wellness",
        scrapedTitle: "Google",
        affiliateLabel: "Promotional Offer",
      }),
      "The Complete Health & Wellness Solution"
    );
  });

  it("uses a real scraped product title", () => {
    assert.equal(
      deriveProductName({
        niche: "Health & Wellness",
        scrapedTitle: "Metabolic Masterclass — Official Site",
      }),
      "Metabolic Masterclass"
    );
  });

  it("extracts product names from review-style headlines", () => {
    assert.equal(
      deriveProductName({
        niche: "Health & Wellness",
        scrapedTitle: "Should You Buy Melatonin? What to Check First",
      }),
      "Melatonin"
    );
  });
});

describe("isNicheFallbackProductName", () => {
  it("detects niche fallback names", () => {
    assert.equal(
      isNicheFallbackProductName("The Complete Health & Wellness Solution", "Health & Wellness"),
      true
    );
    assert.equal(isNicheFallbackProductName("Melatonin", "Health & Wellness"), false);
  });
});
