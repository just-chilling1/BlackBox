"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { brand } from "@/config/brand.config";
import { getNavIcon } from "@/lib/nav-icons";
import { supabase } from "@/lib/supabase";
import {
  onboardingContent,
  ONBOARDING_DASHBOARD_ROUTE,
  ONBOARDING_PRODUCT_NAME,
} from "@/config/onboarding-content";

function OnboardingBrand() {
  const Icon = getNavIcon(brand.logo.icon);
  const useImage = brand.logo.type === "image";
  const isWordmarkImage = useImage && brand.logo.wordmark;
  const imageSrc = isWordmarkImage ? brand.logo.src : brand.logo.iconSrc ?? brand.logo.src;

  return (
    <div className="flex items-center gap-3">
      {useImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={brand.logo.alt}
          width={isWordmarkImage ? undefined : 40}
          height={isWordmarkImage ? undefined : 40}
          className={clsx(
            "w-auto shrink-0 object-contain",
            isWordmarkImage ? "h-12 sm:h-14 md:h-16" : "h-10"
          )}
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent shadow-sm">
          <Icon size={20} className="text-black" />
        </div>
      )}
      {!isWordmarkImage && (
        <div className="min-w-0">
          <p className="truncate font-bold text-slate-900">{brand.productName}</p>
          <p className="truncate text-sm text-slate-500">{brand.tagline}</p>
        </div>
      )}
    </div>
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const cfg = onboardingContent.activation;

  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activationStep, setActivationStep] = useState(0);

  useEffect(() => {
    const timers = cfg.infoSteps.map((_, i) =>
      window.setTimeout(() => setActivationStep(i + 1), 600 * (i + 1))
    );
    return () => timers.forEach(window.clearTimeout);
  }, [cfg.infoSteps]);

  const handleActivate = async () => {
    const trimmed = firstName.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: trimmed }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Could not activate your account. Please try again.");
        return;
      }

      window.location.href = ONBOARDING_DASHBOARD_ROUTE;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-amber-50/40">
      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-12 sm:px-10">
          <div className="mb-8">
            <OnboardingBrand />
          </div>

          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">{cfg.headline}</h1>
          <p className="mt-3 text-lg text-slate-600">{cfg.subheadline}</p>

          <input
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (error) setError(null);
            }}
            placeholder={cfg.inputPlaceholder}
            aria-label={`Your first name for ${ONBOARDING_PRODUCT_NAME}`}
            autoComplete="given-name"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && firstName.trim() && !submitting) {
                void handleActivate();
              }
            }}
            className="mt-8 h-16 w-full rounded-2xl border-2 border-slate-200 bg-white px-5 text-xl text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/15"
          />

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-bold text-slate-900">{cfg.infoTitle}</p>
            <ol className="space-y-3">
              {cfg.infoSteps.map((step, i) => (
                <li
                  key={step}
                  className={`flex items-start gap-3 text-sm transition-all duration-500 ${
                    activationStep > i ? "text-slate-700 opacity-100" : "text-slate-300 opacity-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      activationStep > i ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {activationStep > i ? "✓" : i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-5 text-sm font-medium text-amber-700">{cfg.note}</p>

          {error && (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => void handleActivate()}
            disabled={!firstName.trim() || submitting}
            className="mt-8 h-16 w-full rounded-2xl bg-gradient-to-r from-accent to-accent-muted text-xl font-extrabold text-text-on-accent shadow-gold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_24px_rgba(238,179,16,0.28)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:brightness-100"
          >
            {submitting ? "Activating…" : cfg.ctaLabel}
          </button>
        </div>
      </main>
    </div>
  );
}

export default OnboardingFlow;
