/**
 * Canonical niche list shared across all premium features
 * (Done-For-You Profit, Guaranteed High-Ticket Payouts, Unlimited, Instant Income, etc.).
 */

export interface NicheOption {
  value: string;
  label: string;
}

export const PREMIUM_NICHE_OPTIONS = [
  { value: "health", label: "Health & Wellness" },
  { value: "finance", label: "Finance & Investing" },
  { value: "fitness", label: "Fitness & Sports" },
  { value: "marketing", label: "Digital Marketing" },
  { value: "selfhelp", label: "Self-Help & Personal Development" },
  { value: "beauty", label: "Beauty & Skincare" },
  { value: "education", label: "Education & Learning" },
  { value: "business", label: "Business & Entrepreneurship" },
  { value: "travel", label: "Travel & Lifestyle" },
] as const satisfies readonly NicheOption[];

export type PremiumNicheValue = (typeof PREMIUM_NICHE_OPTIONS)[number]["value"];
export type PremiumNicheLabel = (typeof PREMIUM_NICHE_OPTIONS)[number]["label"];

/** @deprecated Use PREMIUM_NICHE_OPTIONS — kept for blog-builder compatibility. */
export const NICHE_OPTIONS = PREMIUM_NICHE_OPTIONS;

export const PREMIUM_NICHE_LABELS: PremiumNicheLabel[] = PREMIUM_NICHE_OPTIONS.map((n) => n.label);

export const PREMIUM_NICHE_VALUES: PremiumNicheValue[] = PREMIUM_NICHE_OPTIONS.map((n) => n.value);

/** Filter chips: Guaranteed High-Ticket Payouts, DFY Profit, etc. */
export const PREMIUM_NICHE_FILTER_LABELS = ["All", ...PREMIUM_NICHE_LABELS] as const;

export function findPremiumNicheByValue(value: string): NicheOption | undefined {
  const key = value.trim().toLowerCase();
  return PREMIUM_NICHE_OPTIONS.find((n) => n.value === key);
}

export function findPremiumNicheByLabel(label: string): NicheOption | undefined {
  const normalized = label.trim().toLowerCase();
  return PREMIUM_NICHE_OPTIONS.find((n) => n.label.toLowerCase() === normalized);
}

export function resolvePremiumNicheLabel(valueOrLabel: string | null | undefined): PremiumNicheLabel | null {
  if (!valueOrLabel?.trim()) return null;
  const byValue = findPremiumNicheByValue(valueOrLabel);
  if (byValue) return byValue.label as PremiumNicheLabel;
  const byLabel = findPremiumNicheByLabel(valueOrLabel);
  if (byLabel) return byLabel.label as PremiumNicheLabel;
  return null;
}

export function resolvePremiumNicheValue(valueOrLabel: string | null | undefined): PremiumNicheValue | null {
  if (!valueOrLabel?.trim()) return null;
  const byValue = findPremiumNicheByValue(valueOrLabel);
  if (byValue) return byValue.value as PremiumNicheValue;
  const byLabel = findPremiumNicheByLabel(valueOrLabel);
  if (byLabel) return byLabel.value as PremiumNicheValue;
  return null;
}

/** Map legacy accelerator / instant-income niche strings to canonical labels. */
export function mapLegacyNicheLabel(legacy: string): PremiumNicheLabel | null {
  const key = legacy.trim().toLowerCase();
  const table: Record<string, PremiumNicheLabel> = {
    sleep: "Health & Wellness",
    "health & wellness": "Health & Wellness",
    "health & fitness": "Health & Wellness",
    "health and wellness": "Health & Wellness",
    "weight loss": "Fitness & Sports",
    "boxing & combat sports": "Fitness & Sports",
    "fitness & sports": "Fitness & Sports",
    finance: "Finance & Investing",
    "finance & investing": "Finance & Investing",
    "make money": "Finance & Investing",
    "make money online": "Business & Entrepreneurship",
    marketing: "Digital Marketing",
    "digital marketing": "Digital Marketing",
    software: "Digital Marketing",
    "tech & gadgets": "Digital Marketing",
    selfhelp: "Self-Help & Personal Development",
    "self-help & personal development": "Self-Help & Personal Development",
    relationships: "Self-Help & Personal Development",
    beauty: "Beauty & Skincare",
    "beauty & skincare": "Beauty & Skincare",
    education: "Education & Learning",
    "education & learning": "Education & Learning",
    business: "Business & Entrepreneurship",
    "business & entrepreneurship": "Business & Entrepreneurship",
    general: "Business & Entrepreneurship",
    travel: "Travel & Lifestyle",
    "travel & lifestyle": "Travel & Lifestyle",
    pets: "Travel & Lifestyle",
    "home & garden": "Travel & Lifestyle",
  };
  return table[key] ?? null;
}
