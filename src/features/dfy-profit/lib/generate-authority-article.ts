import type { SupabaseClient } from "@supabase/supabase-js";
import { weaveAffiliateLinks } from "@/features/blog-builder/lib/affiliate";
import { generateBlogPostContent } from "@/features/blog-builder/lib/generate-content";
import { resolvePostImage } from "@/features/blog-builder/lib/images";
import { slugify } from "@/features/blog-builder/lib/seo";
import { buildClusterTopics } from "@/features/blog-builder/lib/templates";
import type { ArmedLink, BlogPost, BlogSite } from "@/features/blog-builder/types";

export interface GenerateAuthorityArticleParams {
  supabase: SupabaseClient;
  userId: string;
  site: BlogSite;
  productName: string;
  nicheLabel: string;
  productContext?: string;
}

export interface GenerateAuthorityArticleResult {
  post: BlogPost;
  title: string;
  slug: string;
  html: string;
}

/**
 * Generate a single authority-tier article for a DFY Profit site.
 * Does NOT append cluster internal links (there are no sibling posts).
 */
export async function generateAuthorityArticleForSite(
  params: GenerateAuthorityArticleParams
): Promise<GenerateAuthorityArticleResult> {
  const { supabase, userId, site, productName, nicheLabel, productContext = "" } = params;
  const territory = productName.trim() || nicheLabel.trim();
  const hobby = nicheLabel.trim() || territory;
  const topic = buildClusterTopics(territory, hobby)[0];
  const armedLinks = (site.armed_links ?? []) as ArmedLink[];
  const scrapeUrl = armedLinks[0]?.url?.trim() || undefined;

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
  let imageUrl: string | null = null;
  let imageAlt = `${content.title} — ${territory}`;

  try {
    const image = await resolvePostImage({
      title: content.title,
      subject: territory,
      userId,
      supabase,
      scrapeUrl,
    });
    imageUrl = image.url || null;
    imageAlt = image.alt;
  } catch {
    /* article still publishes without a hero */
  }

  const html = weaveAffiliateLinks(content.html, armedLinks, postId, site.id);
  const slugBase = slugify(content.title) || topic.slug || "authority-guide";
  let slug = slugBase;

  const { data: existing } = await supabase
    .from("posts")
    .select("slug")
    .eq("site_id", site.id)
    .like("slug", `${slugBase}%`);
  const taken = new Set((existing ?? []).map((row) => row.slug as string));
  for (let n = 2; taken.has(slug); n++) {
    slug = `${slugBase}-${n}`;
  }

  const now = new Date().toISOString();
  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      id: postId,
      site_id: site.id,
      user_id: userId,
      title: content.title,
      slug,
      html,
      excerpt: content.excerpt,
      meta_description: content.metaDescription,
      image_url: imageUrl,
      image_alt: imageAlt,
      is_pillar: true,
      status: "live",
      publish_at: now,
    })
    .select()
    .single();

  if (error || !post) {
    throw new Error(error?.message ?? "Failed to save authority article");
  }

  return {
    post: post as BlogPost,
    title: content.title,
    slug,
    html,
  };
}
