"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Lightbulb, Link2, Rocket, CheckCircle2 } from "lucide-react";
import { brand } from "@/config/brand.config";
import { storageKeys } from "@/lib/storage-keys";
import { supabase } from "@/lib/supabase";
import { getVisibleWorkflowSteps } from "@/lib/features";

const TIPS = [
  "Pick one niche and stick with it — consistency beats jumping between topics.",
  "Always add your affiliate link before publishing — every click counts.",
  "Use the Offers Library to reuse winning sales pages across niches.",
  "Copy promotion threads from X-Power Promotions and adapt them for your audience.",
  "Individual results vary. Focus on showing up daily rather than overnight wins.",
];

function readJsonArray(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function HonestActivity() {
  const startHref = getVisibleWorkflowSteps()[0]?.path ?? "/training";
  const [tipIndex, setTipIndex] = useState(0);
  const [topicsExplored, setTopicsExplored] = useState(0);
  const [linksSaved, setLinksSaved] = useState(0);
  const [autopilotDone, setAutopilotDone] = useState(0);

  useEffect(() => {
    setTopicsExplored(readJsonArray(storageKeys.workflowHistory).length);
    setAutopilotDone(readJsonArray(storageKeys.autopilotCompleted).length);

    void supabase.auth.getUser().then(({ data: { user } }) => {
      const uid = user?.id ?? "anonymous";
      setLinksSaved(readJsonArray(`${brand.storagePrefix}_money_links_${uid}`).length);
    });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setTipIndex((t) => (t + 1) % TIPS.length), 8000);
    return () => window.clearInterval(timer);
  }, []);

  const hasUsage = topicsExplored > 0 || linksSaved > 0 || autopilotDone > 0;

  const stats = useMemo(
    () => [
      { label: "Topics explored", value: topicsExplored, icon: Rocket },
      { label: "Links saved", value: linksSaved, icon: Link2 },
      { label: "Tasks completed", value: autopilotDone, icon: CheckCircle2 },
    ],
    [topicsExplored, linksSaved, autopilotDone]
  );

  return (
    <div className="accent-card card-base border-border-dim/60">
      <h3 className="ds-h3">Your Activity</h3>

      {hasUsage ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="surface-inset p-4">
              <div className="flex items-center gap-2 text-accent">
                <Icon size={18} />
                <span className="text-2xl font-bold text-text-heading">{value}</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-text-muted">
          No activity yet — start with the{" "}
          <Link href={startHref} className="font-medium text-accent hover:underline">
            first workflow step
          </Link>
          .
        </p>
      )}

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-accent/15 bg-accent/5 p-4">
        <Lightbulb className="mt-0.5 shrink-0 text-accent" size={18} />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-accent/80">Tip</p>
          <p className="mt-1 text-sm text-text-secondary">{TIPS[tipIndex]}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-text-muted italic">Individual results vary.</p>
    </div>
  );
}
