import { weaveAffiliateLinks } from "@/features/blog-builder/lib/affiliate";
import { generateBlogPostContent } from "@/features/blog-builder/lib/generate-content";
import { buildClusterTopics } from "@/features/blog-builder/lib/templates";
import type { ArmedLink, BlogSite } from "@/features/blog-builder/types";

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
 * Generate a single copyable authority-tier article for a DFY Profit site.
 * It is intentionally not persisted or published as a public post.
 */
export async function generateAuthorityArticleForSite(
  params: GenerateAuthorityArticleParams
): Promise<GenerateAuthorityArticleResult> {
  const { site, productName, nicheLabel, productContext = "" } = params;
  const territory = productName.trim() || nicheLabel.trim();
  const hobby = nicheLabel.trim() || territory;
  const topic = buildClusterTopics(territory, hobby)[0];
  const armedLinks = (site.armed_links ?? []) as ArmedLink[];
  const content = await generateBlogPostContent({
    topic: topic.title,
    territory,
    hobby,
    angle: topic.angle ?? "pillar-guide",
    affiliateContext: armedLinks.map((l) => `${l.label}: ${l.url}`).join("\n"),
    productContext,
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
