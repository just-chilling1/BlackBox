"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Headphones, X } from "lucide-react";
import { ContactSupportWidget } from "@/components/dashboard/ContactSupportWidget";
import { support, supportRoutes } from "@/config/support.config";

export function FloatingSupportButton() {
  const [open, setOpen] = useState(false);
  const { floatingWidget } = support;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {!open ? (
          <motion.button
            key="trigger"
            type="button"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(true)}
            aria-label={floatingWidget.ariaLabel}
            className="support-float-trigger fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-black/10 bg-accent px-5 py-3.5 text-sm font-black uppercase tracking-[0.1em] text-black shadow-gold ring-2 ring-accent-muted/20 cursor-pointer transition-all duration-200 hover:brightness-105 hover:shadow-[0_0_28px_rgba(238,179,16,0.32)] hover:ring-accent-muted/35 active:scale-[0.97] max-lg:bottom-[calc(5rem+env(safe-area-inset-bottom))]"
          >
            <Headphones size={17} strokeWidth={2.25} />
            {floatingWidget.label}
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={floatingWidget.panelTitle}>
            <motion.button
              type="button"
              aria-label="Close support panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[420px]"
            >
              <div className="support-float-panel overflow-hidden rounded-2xl border border-accent/25 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
                <div className="flex items-start justify-between gap-3 border-b border-border-dim/80 bg-gradient-to-r from-accent/10 via-white to-accent-muted/5 px-5 py-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/15">
                      <Headphones size={18} className="text-accent-readable" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="brand-font text-base font-bold text-text-heading">{floatingWidget.panelTitle}</h2>
                      <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{floatingWidget.panelSubtitle}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-dim bg-white text-text-muted cursor-pointer transition-colors hover:border-accent/35 hover:bg-accent/10 hover:text-accent-readable"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="max-h-[min(70dvh,560px)] overflow-y-auto">
                  <ContactSupportWidget embedded />
                </div>

                <div className="border-t border-border-dim/80 bg-page/50 px-5 py-3">
                  <Link
                    href={supportRoutes.contact}
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-readable hover:underline"
                  >
                    Visit full support center
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
