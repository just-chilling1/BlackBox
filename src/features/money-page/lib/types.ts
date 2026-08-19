export interface MoneyPageCopy {
  headline: string;
  subheadline: string;
  productIntro: string;
  overview: string;
  benefits: { title: string; description: string }[];
  whoFor: string[];
  features: string[];
  pros: string[];
  cons: string[];
  review: string;
  faqs: { question: string; answer: string }[];
  finalRecommendation: string;
  ctaLabel: string;
  heroImage?: string;
}

export function isMoneyPageCopy(value: unknown): value is MoneyPageCopy {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.headline === "string" &&
    typeof v.subheadline === "string" &&
    typeof v.productIntro === "string" &&
    typeof v.overview === "string" &&
    Array.isArray(v.benefits) &&
    Array.isArray(v.whoFor) &&
    Array.isArray(v.features) &&
    Array.isArray(v.pros) &&
    Array.isArray(v.cons) &&
    typeof v.review === "string" &&
    Array.isArray(v.faqs) &&
    typeof v.finalRecommendation === "string" &&
    typeof v.ctaLabel === "string"
  );
}
