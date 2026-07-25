export const brand = {
  /** Software display name — set via NEXT_PUBLIC_PRODUCT_NAME in .env */
  productName: process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "Product Skeleton",
  storagePrefix: "product_skeleton",
  tagline: "Modular App Platform",
  authTagline: "Secure member access",
  signupTagline: "Create your account",
  logo: {
    /** "icon" uses lucide icon; "image" uses public/logo.png */
    type: "icon" as "icon" | "image",
    icon: "Target",
    src: "/logo.png",
    alt: process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "Product Skeleton",
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
    const name = process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "Product Skeleton";
    return {
      title: `${name} | Modular App Platform`,
      description: "A modular skeleton for shipping branded SaaS products.",
    };
  },
} as const;

export type BrandConfig = typeof brand;
