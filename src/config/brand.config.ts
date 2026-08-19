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
    primary: "#22D3EE",
    secondary: "#5BE7F5",
    promoAccent: "#22D3EE",
    promoCta: "#22D3EE",
    page: "#070B0F",
    sidebar: "#0E141B",
    panel: "#141C25",
    authPage: "#070B0F",
    textHeading: "#E6EDF3",
    textPrimary: "#E6EDF3",
    textMuted: "#8B9AAB",
    panelGlass: "#141C25",
    borderGlow: "rgba(34, 211, 238, 0.12)",
    borderTeal: "rgba(34, 211, 238, 0.28)",
    border: "rgba(230, 237, 243, 0.08)",
    encryptedGreen: "#34D399",
    vaultGold: "#22D3EE",
  },
  fonts: {
    brand: "Space Grotesk",
    ui: "Inter",
  },
  get metadata() {
    return {
      title: `${PRODUCT_NAME} | Affiliate Money Pages`,
      description: `Choose a product, publish a money page, and generate Pinterest traffic with ${PRODUCT_NAME}.`,
    };
  },
} as const;

export type BrandConfig = typeof brand;
