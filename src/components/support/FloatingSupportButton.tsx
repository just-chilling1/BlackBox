"use client";

import { useEffect, useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { ContactSupportWidget } from "@/components/dashboard/ContactSupportWidget";
import { support } from "@/config/support.config";

export function FloatingSupportButton() {
  const [open, setOpen] = useState(false);
  const { floatingWidget } = support;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close support panel"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={floatingWidget.ariaLabel}
          className="support-float-trigger fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-accent/40 bg-white/95 px-4 py-2.5 text-sm font-semibold text-accent-readable shadow-gold backdrop-blur transition-all hover:border-accent/70 hover:shadow-[0_0_28px_rgba(238,179,16,0.28)] sm:bottom-6 sm:right-6 max-lg:bottom-[calc(4rem+env(safe-area-inset-bottom))]"
        >
          <HelpCircle className="h-4 w-4" />
          {floatingWidget.label}
        </button>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={floatingWidget.panelTitle}
          className="support-float-panel fixed bottom-4 right-4 z-50 flex max-h-[min(80vh,640px)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-accent/25 bg-white/95 shadow-[0_0_40px_rgba(99,102,241,0.12),0_0_25px_rgba(238,179,16,0.18)] backdrop-blur-md sm:bottom-6 sm:right-6 max-lg:bottom-[calc(4rem+env(safe-area-inset-bottom))]"
        >
          <div className="flex items-center justify-between border-b border-border-dim/80 bg-gradient-to-r from-accent/10 via-white to-accent-muted/10 px-4 py-3">
            <div className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-widest text-text-heading">
                {floatingWidget.panelTitle}
              </span>
              {floatingWidget.panelSubtitle ? (
                <span className="mt-0.5 block text-[11px] text-text-muted">{floatingWidget.panelSubtitle}</span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close support panel"
              className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-accent/10 hover:text-accent-readable"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="support-widget-scroll min-h-0 flex-1 overflow-y-auto p-3">
            <ContactSupportWidget embedded />
          </div>
        </div>
      ) : null}
    </>
  );
}
