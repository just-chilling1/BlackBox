"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import type { FaqItem } from "@/config/faq.config";

interface SupportFaqAccordionProps {
  items: FaqItem[];
}

export function SupportFaqAccordion({ items }: SupportFaqAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border-dim/80">
      {items.map((faq, index) => {
        const isOpen = expandedIndex === index;

        return (
          <div key={faq.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between px-1 py-3 text-left transition-colors hover:bg-brass-100 sm:px-2"
              onClick={() => setExpandedIndex(isOpen ? null : index)}
            >
              <span className="pr-4 text-sm font-medium text-text-primary">{faq.q}</span>
              {isOpen ? (
                <ChevronUp size={18} className="shrink-0 text-brass-700" />
              ) : (
                <ChevronDown size={18} className="shrink-0 text-text-muted" />
              )}
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-1 pb-4 text-sm leading-relaxed text-text-secondary sm:px-2">
                    {faq.a}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function SupportFaqCardHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-border-dim/80 px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--bb-line-brass)] bg-brass-100">
        <HelpCircle className="h-5 w-5 text-brass-700" />
      </div>
      <div>
        <h2 className="ds-h3">Frequently Asked Questions</h2>
        <p className="mt-1 text-sm text-text-muted">Common queries and system documentation</p>
      </div>
    </div>
  );
}
