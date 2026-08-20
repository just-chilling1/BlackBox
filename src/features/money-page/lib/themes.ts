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
    description: "Signal teal — clear and trustworthy",
    swatch: "#14B8A6",
    css: {
      bg: "#f6f8fb",
      bgSoft: "#eef3f8",
      heroEnd: "#f8fbfd",
      accent: "#0F766E",
      accentMid: "#14B8A6",
      accentDark: "#115E59",
      accentRgb: "15, 118, 110",
      accentMidRgb: "20, 184, 166",
      ctaPanelEnd: "#134E4A",
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
      accent: "#047857",
      accentMid: "#059669",
      accentDark: "#065f46",
      accentRgb: "4, 120, 87",
      accentMidRgb: "5, 150, 105",
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
      accent: "#b45309",
      accentMid: "#d97706",
      accentDark: "#92400e",
      accentRgb: "180, 83, 9",
      accentMidRgb: "217, 119, 6",
      ctaPanelEnd: "#7c2d12",
    },
  },
  {
    id: "slate",
    label: "Slate",
    description: "Cool steel — sharp and modern",
    swatch: "#64748b",
    css: {
      bg: "#f4f6f8",
      bgSoft: "#e8edf2",
      heroEnd: "#f7f9fb",
      // Slightly clearer mid accent so FAQ chevrons / chips read on light cards
      accent: "#334155",
      accentMid: "#64748b",
      accentDark: "#0f172a",
      accentRgb: "51, 65, 85",
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
