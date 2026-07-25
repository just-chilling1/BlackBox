"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { trainingFaqSections } from "@/config/training-content.config";
import { TrainingPageLayout } from "../components/TrainingPageLayout";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border-dim/20">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-accent/3"
      >
        <div className="flex items-center gap-3">
          <HelpCircle size={15} className="shrink-0 text-accent" />
          <span className="text-sm font-semibold text-text-primary">{q}</span>
        </div>
        {open ? (
          <ChevronUp size={14} className="shrink-0 text-text-muted" />
        ) : (
          <ChevronDown size={14} className="shrink-0 text-text-muted" />
        )}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-12">
              <p className="text-[13px] leading-relaxed text-text-secondary">{a}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function TrainingFaqPage() {
  const faqCount = trainingFaqSections.reduce((acc, section) => acc + section.items.length, 0);

  return (
    <TrainingPageLayout>
      <section className="flex flex-col gap-6">
        <div className="glass-card flex items-center gap-3 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10">
            <GraduationCap size={22} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-heading">Frequently Asked Questions</h2>
            <p className="text-sm text-text-muted">Quick answers to common questions about the platform</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-1">
          <HelpCircle size={16} className="text-accent" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            {faqCount} answers
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {trainingFaqSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <h3 className="mb-1 px-1 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
                {section.title}
              </h3>
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </TrainingPageLayout>
  );
}
