import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  buttonText: string;
  accent?: "gold" | "indigo" | "teal";
}

const accents = {
  gold: {
    text: "text-accent",
    tile: "bg-accent/10 border-accent/25",
    hoverBorder: "hover:border-accent/40",
    bar: "from-accent/80 to-promo-cta/80",
  },
  indigo: {
    text: "text-accent-muted",
    tile: "bg-accent-muted/10 border-accent-muted/25",
    hoverBorder: "hover:border-accent-muted/40",
    bar: "from-accent-muted/80 to-indigo-400/80",
  },
  teal: {
    text: "text-promo-accent",
    tile: "bg-promo-accent/10 border-promo-accent/25",
    hoverBorder: "hover:border-promo-accent/40",
    bar: "from-promo-accent/80 to-[#C9970D]/80",
  },
} as const;

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  buttonText,
  accent = "gold",
}: QuickActionCardProps) {
  const tone = accents[accent];

  return (
    <Link
      href={href}
      className={clsx(
        "accent-card group flex h-full flex-col rounded-2xl border border-border-dim/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        tone.hoverBorder
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={clsx("flex h-12 w-12 items-center justify-center rounded-xl border", tone.tile)}>
          <Icon className={clsx("h-6 w-6", tone.text)} />
        </div>
        <h3 className="text-lg font-bold tracking-tight text-text-heading">{title}</h3>
      </div>

      <p className="mb-5 flex-1 text-sm leading-relaxed text-text-secondary">{description}</p>

      <span className={clsx("inline-flex items-center gap-2 text-sm font-bold", tone.text)}>
        {buttonText}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
