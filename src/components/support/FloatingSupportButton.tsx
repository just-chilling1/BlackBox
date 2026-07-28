"use client";

import { useEffect, useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { ContactSupportWidget } from "@/components/dashboard/ContactSupportWidget";

export function FloatingSupportButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Need help? Contact support"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-xs font-black uppercase tracking-wide text-black shadow-gold cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_24px_rgba(238,179,16,0.28)] active:scale-[0.97] max-lg:bottom-[calc(5rem+env(safe-area-inset-bottom))]"
      >
        <HelpCircle size={16} />
        Need help?
      </button>

      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Contact support">
          <button
            type="button"
            aria-label="Close support panel"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[400px]">
            <div className="flex justify-end pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-dim bg-surface text-text-secondary cursor-pointer transition-all duration-200 hover:border-accent/40 hover:bg-slate-100 hover:text-amber-800 active:scale-95"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[min(75dvh,600px)] overflow-y-auto rounded-2xl">
              <ContactSupportWidget />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
