export type MoneyPageColorThemeId = "ocean" | "forest" | "sunset" | "slate";

export interface MoneyPageColorTheme {
  id: MoneyPageColorThemeId;
  label: string;
  description: string;
  /** Swatch color shown in the editor */
  swatch: string;
  css: {
    bg: string;
    bgSoft: string;
    heroEnd: string;
    accent: string;
    accentMid: string;
    accentDark: string;
    accentRgb: string;
    accentMidRgb: string;
    ctaPanelEnd: string;
  };
}

export const MONEY_PAGE_COLOR_THEMES: MoneyPageColorTheme[] = [
  {
    id: "ocean",
    label: "Ocean",
    description: "Cool teal — clear and trustworthy",
    swatch: "#0891b2",
    css: {
      bg: "#f6f8fb",
      bgSoft: "#eef3f8",
      heroEnd: "#f8fbfd",
      accent: "#0891b2",
      accentMid: "#06b6d4",
      accentDark: "#0e7490",
      accentRgb: "8, 145, 178",
      accentMidRgb: "6, 182, 212",
      ctaPanelEnd: "#164e63",
    },
  },
  {
    id: "forest",
    label: "Forest",
    description: "Fresh green — calm and grounded",
    swatch: "#059669",
    css: {
      bg: "#f5f9f7",
      bgSoft: "#eaf4ef",
      heroEnd: "#f7fbf9",
      accent: "#059669",
      accentMid: "#10b981",
      accentDark: "#047857",
      accentRgb: "5, 150, 105",
      accentMidRgb: "16, 185, 129",
      ctaPanelEnd: "#14532d",
    },
  },
  {
    id: "sunset",
    label: "Sunset",
    description: "Warm amber — energetic and bold",
    swatch: "#d97706",
    css: {
      bg: "#faf7f4",
      bgSoft: "#f5efe8",
      heroEnd: "#fbf8f4",
      accent: "#d97706",
      accentMid: "#f59e0b",
      accentDark: "#b45309",
      accentRgb: "217, 119, 6",
      accentMidRgb: "245, 158, 11",
      ctaPanelEnd: "#7c2d12",
    },
  },
  {
    id: "slate",
    label: "Slate",
    description: "Cool steel — sharp and modern",
    swatch: "#475569",
    css: {
      bg: "#f4f6f8",
      bgSoft: "#e8edf2",
      heroEnd: "#f7f9fb",
      accent: "#475569",
      accentMid: "#64748b",
      accentDark: "#334155",
      accentRgb: "71, 85, 105",
      accentMidRgb: "100, 116, 139",
      ctaPanelEnd: "#1e293b",
    },
  },
];

export const DEFAULT_MONEY_PAGE_COLOR_THEME: MoneyPageColorThemeId = "ocean";

export function isMoneyPageColorThemeId(value: unknown): value is MoneyPageColorThemeId {
  return value === "ocean" || value === "forest" || value === "sunset" || value === "slate";
}

export function getMoneyPageColorTheme(id?: string | null): MoneyPageColorTheme {
  const found = MONEY_PAGE_COLOR_THEMES.find((t) => t.id === id);
  return found ?? MONEY_PAGE_COLOR_THEMES[0];
}

export function resolveMoneyPageColorThemeId(themeConfig: unknown): MoneyPageColorThemeId {
  if (!themeConfig || typeof themeConfig !== "object") return DEFAULT_MONEY_PAGE_COLOR_THEME;
  const raw = (themeConfig as Record<string, unknown>).moneyColorTheme;
  return isMoneyPageColorThemeId(raw) ? raw : DEFAULT_MONEY_PAGE_COLOR_THEME;
}

export function withMoneyPageThemeConfig(
  existing: unknown,
  patch: { moneyColorTheme?: MoneyPageColorThemeId; moneyVariation?: string }
): Record<string, unknown> {
  const base =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? { ...(existing as Record<string, unknown>) }
      : {};
  if (patch.moneyColorTheme) base.moneyColorTheme = patch.moneyColorTheme;
  if (patch.moneyVariation) base.moneyVariation = patch.moneyVariation;
  return base;
}
