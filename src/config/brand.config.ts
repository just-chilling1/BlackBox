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
    /** Square mark for collapsed sidebar and favicon */
    iconSrc: "/logo-icon.png",
    alt: PRODUCT_NAME,
    /** Logo image already includes the product name */
    wordmark: true,
  },
  colors: {
    primary: "#2DD4BF",
    secondary: "#5EEAD4",
    promoAccent: "#2DD4BF",
    promoCta: "#2DD4BF",
    page: "#080C12",
    sidebar: "#0C1016",
    panel: "#121820",
    authPage: "#080C12",
    textHeading: "#F1F5F9",
    textPrimary: "#E2E8F0",
    textMuted: "#94A3B8",
    panelGlass: "#121820",
    borderGlow: "rgba(45, 212, 191, 0.12)",
    borderTeal: "rgba(45, 212, 191, 0.32)",
    border: "rgba(241, 245, 249, 0.08)",
    encryptedGreen: "#34D399",
    vaultGold: "#2DD4BF",
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
