import type { Metadata } from "next";
import { createPublicSupabaseClient } from "@/lib/supabase-public";
import { SiteHomeView, ProductSiteView, getPublicBrand } from "@/features/blog-builder/themes";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ siteSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteSlug } = await params;
  const supabase = createPublicSupabaseClient();
  const { data: site } = await supabase
    .from("sites")
    .select("title, tagline, hobby, territory, sales_page_html, sales_page_json, site_type")
    .eq("slug", siteSlug)
    .eq("status", "live")
    .maybeSingle();

  if (!site) return { title: "Not found" };

  const isProductSite = site.site_type === "product" || Boolean(site.sales_page_html);
  const salesCopy = site.sales_page_json as { subhook?: string; hook?: string } | null;
  const productDescription =
    (typeof salesCopy?.subhook === "string" && salesCopy.subhook.trim()) ||
    (typeof site.tagline === "string" && site.tagline.trim()) ||
    undefined;

  const brand = getPublicBrand(site);
  const title = brand.name;
  const description = isProductSite ? productDescription ?? brand.tagline : brand.tagline;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function SiteHomePage({ params }: Props) {
  const { siteSlug } = await params;
  const supabase = createPublicSupabaseClient();

  const { data: site } = await supabase
    .from("sites")
    .select(
      "id, title, tagline, slug, hobby, territory, theme, theme_config, template_key, site_type, sales_page_html"
    )
    .eq("slug", siteSlug)
    .eq("status", "live")
    .maybeSingle();

  if (!site) notFound();

  const isProductSite =
    site.site_type === "product" || Boolean(site.sales_page_html);

  if (isProductSite && site.sales_page_html) {
    return <ProductSiteView html={site.sales_page_html} />;
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("title, slug, excerpt, is_pillar, created_at, image_url")
    .eq("site_id", site.id)
    .eq("status", "live")
    .order("is_pillar", { ascending: false })
    .order("created_at", { ascending: true });

  return <SiteHomeView site={site} siteSlug={siteSlug} posts={posts ?? []} />;
}
