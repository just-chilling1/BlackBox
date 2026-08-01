const PRODUCT_NAME = "BlackBox Cash";

export const brand = {
  /** Software display name */
  productName: PRODUCT_NAME,
  storagePrefix: "blackbox_cash",
  tagline: "Affiliate Sales & Promotions",
  authTagline: "Secure member access",
  signupTagline: "Create your account",
  logo: {
    /** "icon" uses lucide icon; "image" uses public logo assets */
    type: "image" as "icon" | "image",
    icon: "Target",
    /** Full wordmark for expanded nav/header */
    src: "/logo.png",
    /** Square mark for collapsed sidebar and favicon */
    iconSrc: "/logo-icon.png",
    alt: PRODUCT_NAME,
    /** Logo image already includes the product name */
    wordmark: true,
  },
  colors: {
    /** Duke University mustard yellow (Pantone 116) */
    primary: "#EEB310",
    /** Muted gold companion — keep hover/accent family consistent (no indigo/magenta) */
    secondary: "#C9970D",
    promoAccent: "#EEB310",
    promoCta: "#EEB310",
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
    borderTeal: "rgba(238, 179, 16, 0.16)",
    border: "#E2E8F0",
    encryptedGreen: "#059669",
    vaultGold: "#EEB310",
  },
  fonts: {
    brand: "Outfit",
    ui: "Inter",
  },
  get metadata() {
    return {
      title: `${PRODUCT_NAME} | Affiliate Sales & Promotions`,
      description: `Generate sales offers, promotion threads, and affiliate assets with ${PRODUCT_NAME}.`,
    };
  },
} as const;

export type BrandConfig = typeof brand;
