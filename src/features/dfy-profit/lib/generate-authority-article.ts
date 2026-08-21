import { weaveAffiliateLinks } from "@/features/blog-builder/lib/affiliate";
import { generateBlogPostContent } from "@/features/blog-builder/lib/generate-content";
import { buildClusterTopics } from "@/features/blog-builder/lib/templates";
import type { ArmedLink, BlogSite } from "@/features/blog-builder/types";
import {
  deriveProductName,
  isNicheFallbackProductName,
} from "@/features/blog-builder/lib/product-sales-copy";

export interface GenerateAuthorityArticleParams {
  site: BlogSite;
  productName: string;
  nicheLabel: string;
  productContext?: string;
}

export interface GenerateAuthorityArticleResult {
  title: string;
  excerpt: string;
  html: string;
}

/**
 * Generate a single authority-tier article for a DFY Profit site.
 * Saved to the offer library; not published as a public site post.
 */
export async function generateAuthorityArticleForSite(
  params: GenerateAuthorityArticleParams
): Promise<GenerateAuthorityArticleResult> {
  const { site, productContext = "" } = params;
  const territory =
    params.nicheLabel.trim() ||
    site.hobby?.trim() ||
    site.territory?.trim() ||
    "this niche";
  const productName = deriveProductName({
    niche: territory,
    scrapedTitle: params.productName?.trim() || site.product_name?.trim(),
    scrapedH1: undefined,
    moneyPageHeadline: site.title?.trim(),
    affiliateLabel: undefined,
  });
  const topic = buildClusterTopics(territory, territory)[0];
  const articleTopic = isNicheFallbackProductName(productName, territory)
    ? `${territory}: Complete Buyer's Guide`
    : productName.toLowerCase() !== territory.toLowerCase()
      ? `${territory}: ${productName} — Complete Buyer's Guide`
      : topic.title;
  const armedLinks = (site.armed_links ?? []) as ArmedLink[];
  const content = await generateBlogPostContent({
    topic: articleTopic,
    territory,
    hobby: territory,
    angle: topic.angle ?? "pillar-guide",
    affiliateContext: armedLinks.map((l) => `${l.label}: ${l.url}`).join("\n"),
    productContext,
    productName,
    contentTier: "authority",
  });

  const postId = crypto.randomUUID();
  const html = weaveAffiliateLinks(content.html, armedLinks, postId, site.id);

  return {
    title: content.title,
    excerpt: content.excerpt,
    html,
  };
}
