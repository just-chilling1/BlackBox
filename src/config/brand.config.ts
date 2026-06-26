export const brand = {
  /** Software display name — set via NEXT_PUBLIC_PRODUCT_NAME in .env */
  productName: process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "Product Skeleton",
  storagePrefix: "product_skeleton",
  tagline: "Modular App Platform",
  authTagline: "Secure member access",
  signupTagline: "Create your account",
  logo: {
    type: "icon" as const,
    icon: "Target",
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
