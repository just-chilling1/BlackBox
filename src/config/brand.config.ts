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
    primary: "#C9971F",
    secondary: "#8A6414",
    promoAccent: "#C9971F",
    promoCta: "#C9971F",
    page: "#F6F2EA",
    sidebar: "#FFFDF8",
    panel: "#FFFFFF",
    authPage: "#F6F2EA",
    textHeading: "#1A1916",
    textPrimary: "#1A1916",
    textMuted: "#5A554B",
    panelGlass: "#FFFFFF",
    borderGlow: "rgba(28, 27, 24, 0.07)",
    borderTeal: "rgba(138, 100, 20, 0.18)",
    border: "rgba(28, 27, 24, 0.07)",
    encryptedGreen: "#3B6D11",
    vaultGold: "#C9971F",
  },
  fonts: {
    brand: "Fraunces",
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
