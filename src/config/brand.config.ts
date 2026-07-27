export const brand = {
  /** Software display name — set via NEXT_PUBLIC_PRODUCT_NAME in .env */
  productName: process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "BlackBox Cash",
  storagePrefix: "product_skeleton",
  tagline: "Affiliate Sales & Promotions",
  authTagline: "Secure member access",
  signupTagline: "Create your account",
  logo: {
    /** "icon" uses lucide icon; "image" uses public/logo.png */
    type: "icon" as "icon" | "image",
    icon: "Target",
    src: "/logo.png",
    alt: process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "BlackBox Cash",
  },
  colors: {
    primary: "#CA8A04",
    secondary: "#6366F1",
    promoAccent: "#0D9488",
    promoCta: "#EAB308",
    page: "#F8FAFC",
    sidebar: "#FFFFFF",
    panel: "#FFFFFF",
    authPage: "#F1F5F9",
    /** Extended tokens for glass UI */
    textHeading: "#0F172A",
    textPrimary: "#1E293B",
    textMuted: "#64748B",
    panelGlass: "rgba(255, 255, 255, 0.92)",
    borderGlow: "rgba(15, 23, 42, 0.08)",
    borderTeal: "rgba(13, 148, 136, 0.16)",
    border: "#E2E8F0",
    encryptedGreen: "#059669",
    vaultGold: "#CA8A04",
  },
  fonts: {
    brand: "Outfit",
    ui: "Inter",
  },
  get metadata() {
    const name = process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "BlackBox Cash";
    return {
      title: `${name} | Affiliate Sales & Promotions`,
      description: "Generate sales offers, promotion threads, and affiliate assets with BlackBox Cash.",
    };
  },
} as const;

export type BrandConfig = typeof brand;
