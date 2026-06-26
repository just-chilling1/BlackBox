import { brand } from "@/config/brand.config";

/** CSS custom properties derived from brand.config — inject via BrandStyleProvider */
export function getBrandCssVars(): Record<string, string> {
  return {
    "--bg-page": brand.colors.page,
    "--bg-sidebar": brand.colors.sidebar,
    "--bg-panel": brand.colors.panel,
    "--brand-primary": brand.colors.primary,
    "--brand-secondary": brand.colors.secondary,
    "--brand-tint": `${brand.colors.primary}1a`,
    "--promo-accent": brand.colors.promoAccent,
    "--promo-cta": brand.colors.promoCta,
    "--text-primary": "#F8FAFC",
  };
}

export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
