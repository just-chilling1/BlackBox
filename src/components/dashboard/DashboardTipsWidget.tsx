"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { brand } from "@/config/brand.config";

const DEFAULT_TIPS = [
  {
    title: "Tip",
    body: "Complete onboarding and add your real support email before launch.",
  },
  {
    title: "Tip",
    body: "Enable only the features your product needs — keep the sidebar focused.",
  },
  {
    title: "Tip",
    body: "Replace placeholder partner URLs in offers.config.ts and promos.config.ts.",
  },
  {
    title: "Tip",
    body: `Fill training videos and set trainingContentReady = true when ${brand.productName} is ready.`,
  },
];

interface DashboardTipsWidgetProps {
  tips?: { title: string; body: string }[];
}

export function DashboardTipsWidget({ tips = DEFAULT_TIPS }: DashboardTipsWidgetProps) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % tips.length);
    }, 12000);
    return () => window.clearInterval(timer);
  }, [tips.length]);

  const tip = tips[tipIndex];

  return (
    <div className="card-base border-border-dim/40 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-accent shrink-0" />
        <p className="ds-h4">{tip.title}</p>
      </div>
      <p className="text-sm leading-relaxed text-text-muted">{tip.body}</p>
      <p className="mt-3 text-xs text-text-muted italic">Individual results vary.</p>
    </div>
  );
}
