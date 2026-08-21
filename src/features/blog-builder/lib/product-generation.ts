import type { SupabaseClient } from "@supabase/supabase-js";
import type { ArmedLink, ThemeConfig } from "../types";
import { deriveProductName } from "./product-sales-copy";
import { generateMoneyPageCopy } from "@/features/money-page/lib/copy";
import { buildMoneyPageHtml } from "@/features/money-page/lib/html";
import type { MoneyPageCopy } from "@/features/money-page/lib/types";

export interface GenerateProductSiteParams {
  supabase: SupabaseClient;
  userId: string;
  siteId: string;
  niche: string;
  armedLinks: ArmedLink[];
  themeConfig?: ThemeConfig | null;
  productContext?: string;
  scrapedTitle?: string;
  scrapedH1?: string;
  scrapedBrand?: string;
  scrapedDescription?: string;
}

export interface GenerateProductSiteResult {
  productName: string;
  salesPageHtml: string;
  salesPageJson: MoneyPageCopy;
  site: Record<string, unknown>;
}

export async function generateProductSite(
  params: GenerateProductSiteParams
): Promise<GenerateProductSiteResult> {
  const affiliate = params.armedLinks[0];
  if (!affiliate?.url?.trim()) {
    throw new Error("At least one affiliate link is required");
  }

  const productName = deriveProductName({
    niche: params.niche,
    scrapedTitle: params.scrapedTitle,
    scrapedH1: params.scrapedH1,
    scrapedBrand: params.scrapedBrand,
    scrapedDescription: params.scrapedDescription,
    affiliateLabel: affiliate.label,
  });

  const { copy, variationId } = await generateMoneyPageCopy({
    productName,
    niche: params.niche,
    description: params.scrapedDescription,
    productContext: params.productContext,
  });

  const salesPageHtml = buildMoneyPageHtml({
    siteId: params.siteId,
    productName,
    copy,
    ctaUrl: affiliate.url.trim(),
    variationId,
  });

  const { data: updatedSite, error } = await params.supabase
    .from("sites")
    .update({
      title: copy.headline,
      tagline: copy.subheadline.slice(0, 160),
      site_type: "product",
      sales_page_html: salesPageHtml,
      sales_page_json: copy,
      theme_config: {
        ...(params.themeConfig ?? {}),
        moneyVariation: variationId,
      },
      product_name: productName,
    })
    .eq("id", params.siteId)
    .eq("user_id", params.userId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return { productName, salesPageHtml, salesPageJson: copy, site: updatedSite };
}
