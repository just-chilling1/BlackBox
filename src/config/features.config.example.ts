import type { FeatureId } from "./features.config";

/**
 * Example presets — copy into enabledFeatures in features.config.ts.
 * Pick the stack that matches the product you are building.
 */

/** Affiliate reply workflow product */
export const affiliateWorkflowFeatures: FeatureId[] = [
  "training",
  "core-workflow",
  "dopamine",
  "scale-upsell",
  "premium-dfy",
  "premium-instant",
  "premium-autopilot",
];

/** SEO article / content site product */
export const contentSiteFeatures: FeatureId[] = [
  "training",
  "article-wizard",
  "article-images",
  "article-publish",
  "portfolio",
  "dopamine",
  "premium-10x",
  "premium-infinite",
  "premium-automation",
  "premium-dfy",
];

/** Image + link affiliate product */
export const imageLinkFeatures: FeatureId[] = [
  "training",
  "image-forge",
  "money-links-vault",
  "launchpad",
  "premium-dfy",
  "premium-instant",
  "premium-autopilot",
];

/** B2B outreach product */
export const b2bOutreachFeatures: FeatureId[] = [
  "training",
  "b2b-outreach",
  "dopamine",
  "premium-dfy",
  "premium-instant",
  "premium-autopilot",
  "protector",
];

/** Bridge page + traffic product */
export const bridgeTrafficFeatures: FeatureId[] = [
  "training",
  "wealth-sync",
  "traffic-hub",
  "income-calculator",
  "dopamine",
  "premium-dfy",
  "premium-recurring",
  "premium-instant",
  "protector",
];

/** Digital product launcher */
export const digitalProductFeatures: FeatureId[] = [
  "training",
  "product-wizard",
  "niche-finder",
  "dopamine",
  "premium-dfy",
  "premium-instant",
  "premium-autopilot",
  "protector",
];

/** Enable every catalog module (dev / reference only) */
export const allFeaturesExample: FeatureId[] = [
  "training",
  "dopamine",
  "scale-upsell",
  "core-workflow",
  "image-forge",
  "money-links-vault",
  "launchpad",
  "article-wizard",
  "article-images",
  "article-publish",
  "portfolio",
  "b2b-outreach",
  "wealth-sync",
  "traffic-hub",
  "income-calculator",
  "product-wizard",
  "niche-finder",
  "premium-dfy",
  "premium-instant",
  "premium-autopilot",
  "premium-10x",
  "premium-infinite",
  "premium-automation",
  "premium-recurring",
  "protector",
];
