const PRODUCT_NAME = "NullPing Cash";

export const brand = {
  /** Software display name */
  productName: PRODUCT_NAME,
  storagePrefix: "nullping_cash",
  tagline: "Activate. Publish. Get traffic.",
  authTagline: "Secure member access",
  signupTagline: "Create your account",
  logo: {
    /** "icon" uses lucide icon; "image" uses public logo assets */
    type: "image" as "icon" | "image",
    icon: "Activity",
    /** Full wordmark for expanded nav/header */
    src: "/logo.png",
    /** SVG fallback when PNG has not been installed yet */
    srcFallback: "/logo.svg",
    /** Square mark for collapsed sidebar and favicon */
    iconSrc: "/logo-icon.png",
    iconSrcFallback: "/logo-icon.svg",
    alt: "NullPing",
    /** Logo image already includes the product name */
    wordmark: true,
  },
  colors: {
    primary: "#00F0FF",
    secondary: "#67E8FF",
    promoAccent: "#00F0FF",
    promoCta: "#2563EB",
    page: "#050508",
    sidebar: "#08080F",
    panel: "#0C0C14",
    authPage: "#050508",
    textHeading: "#F1F5F9",
    textPrimary: "#E2E8F0",
    textMuted: "#94A3B8",
    panelGlass: "#0C0C14",
    borderGlow: "rgba(0, 240, 255, 0.12)",
    borderTeal: "rgba(0, 240, 255, 0.28)",
    border: "rgba(241, 245, 249, 0.08)",
    encryptedGreen: "#34D399",
    vaultGold: "#A855F7",
  },
  fonts: {
    brand: "Space Grotesk",
    ui: "Plus Jakarta Sans",
  },
  get metadata() {
    return {
      title: `${PRODUCT_NAME} | Affiliate Money Pages`,
      description: `Choose a product, publish a money page, and generate Pinterest traffic with ${PRODUCT_NAME}.`,
    };
  },
} as const;

export type BrandConfig = typeof brand;
