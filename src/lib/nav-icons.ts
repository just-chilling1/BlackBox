import {
  LayoutGrid,
  Search,
  Brain,
  Radar,
  MessageSquare,
  GraduationCap,
  TrendingUp,
  Scan,
  Sparkles,
  Rocket,
  Target,
  Smartphone,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import type { NavIconName } from "@/config/navigation.config";

const ICON_MAP: Record<NavIconName | "Target" | "Smartphone" | "Headphones", LucideIcon> = {
  LayoutGrid,
  Search,
  Brain,
  Radar,
  MessageSquare,
  GraduationCap,
  TrendingUp,
  Scan,
  Sparkles,
  Rocket,
  Target,
  Smartphone,
  Headphones,
};

export function getNavIcon(name: string): LucideIcon {
  return ICON_MAP[name as keyof typeof ICON_MAP] ?? Target;
}
