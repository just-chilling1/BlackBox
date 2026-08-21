import {
  PREMIUM_NICHE_OPTIONS,
  type PremiumNicheLabel,
  type PremiumNicheValue,
} from "@/lib/premium-niches";

function inferNicheValue(productName: string, context = ""): PremiumNicheValue {
  const text = `${productName} ${context}`.toLowerCase();
  const rules: [RegExp, PremiumNicheValue][] = [
    [/sleep|insomnia|melatonin|mattress|wellness|supplement|vitamin/, "health"],
    [/box(ing)?|glove|mma|martial|kickbox|sparring|punch|gym|workout|weight|keto|diet|fat loss|fitness|sport/, "fitness"],
    [/money|invest|crypto|wealth|income|finance|budget|dividend|stock|trading/, "finance"],
    [/skincare|skin|serum|wrinkle|beauty|makeup|cosmetic/, "beauty"],
    [/ai |chatgpt|software|saas|app|seo|marketing|funnel|ads/, "marketing"],
    [/self.?help|mindset|relationship|personal development|confidence|habit/, "selfhelp"],
    [/course|training|coaching|ebook|learn|study|school|exam|tutor/, "education"],
    [/business|entrepreneur|startup|freelanc|side hustle|client/, "business"],
    [/dog|cat|pet|puppy|travel|lifestyle|garden|home|vacation|trip/, "travel"],
  ];
  for (const [re, niche] of rules) {
    if (re.test(text)) return niche;
  }
  return "business";
}

/** Returns the canonical premium niche label for storage on sites (hobby / territory). */
export function inferNiche(productName: string, context = ""): PremiumNicheLabel {
  const value = inferNicheValue(productName, context);
  return (
    PREMIUM_NICHE_OPTIONS.find((n) => n.value === value)?.label ?? "Business & Entrepreneurship"
  );
}

/** Returns the canonical niche value key (for stock-photo query maps). */
export function inferNicheKey(productName: string, context = ""): PremiumNicheValue {
  return inferNicheValue(productName, context);
}
