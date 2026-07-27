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
    primary: "#EAB308",
    secondary: "#6366F1",
    promoAccent: "#0cbda0",
    promoCta: "#FFBA00",
    page: "#0A0A0B",
    sidebar: "#0F0F11",
    panel: "#161618",
    authPage: "#0A0A0B",
    /** Extended tokens for glass UI */
    textHeading: "#F8FAFC",
    textPrimary: "#E2E8F0",
    textMuted: "#64748B",
    panelGlass: "rgba(22, 22, 24, 0.65)",
    borderGlow: "rgba(255, 255, 255, 0.08)",
    borderTeal: "rgba(12, 189, 160, 0.12)",
    encryptedGreen: "#34D399",
    vaultGold: "#EAB308",
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
