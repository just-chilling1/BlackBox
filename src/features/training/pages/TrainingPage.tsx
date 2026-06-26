"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Play,
  Search,
  Brain,
  Radar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Zap,
  BookOpen,
  Star,
  Video,
} from "lucide-react";
import { trainingContent } from "@/config/training.config";
import {
  trainingFaqSections,
  trainingCta,
  trainingContentReady,
  trainingPageSkeletonNote,
  trainingPremiumVideos,
  trainingProTips,
  trainingQuickStartChecklist,
  trainingWorkflowSteps,
} from "@/config/training-content.config";

const STEP_ICONS = [Search, Brain, Radar, MessageSquare] as const;

function VideoPlaceholder({ title }: { title: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0a0a0c] border border-dashed border-border-dim/40"
      aria-hidden
    >
      <Video size={28} className="text-text-muted/50" />
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-4 text-center">
        {title}
      </span>
      <span className="text-[10px] text-text-muted/70 px-4 text-center">Add Vimeo ID in training.config.ts</span>
    </div>
  );
}

function VideoCard({
  id,
  title,
  description,
  badge,
}: {
  id: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="border border-border-dim/30 rounded-xl overflow-hidden bg-[#0c0c0e]">
      <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
        {id ? (
          <iframe
            src={`https://player.vimeo.com/video/${id}?badge=0&autopause=0`}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
          />
        ) : (
          <VideoPlaceholder title={title} />
        )}
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        {badge && (
          <span className="text-[9px] font-bold text-accent uppercase tracking-widest">{badge}</span>
        )}
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="text-[12px] text-text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border-dim/20 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <HelpCircle size={15} className="text-accent shrink-0" />
          <span className="text-sm font-semibold text-text-primary">{q}</span>
        </div>
        {open ? (
          <ChevronUp size={14} className="text-text-muted shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-text-muted shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-12">
              <p className="text-[13px] text-text-secondary leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TrainingPage() {
  const faqCount = trainingFaqSections.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-12 max-w-5xl mx-auto w-full py-6"
    >
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 border border-accent/20 flex items-center justify-center rounded-lg">
            <GraduationCap size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="text-2xl text-text-primary font-black tracking-tight">
              {trainingContent.pageTitle}
            </h1>
            <p className="text-sm text-text-muted">{trainingContent.pageSubtitle}</p>
          </div>
        </div>
        {!trainingContentReady && (
          <p className="text-xs text-amber-200/90 bg-amber-500/10 border border-amber-400/20 rounded-lg px-3 py-2">
            {trainingPageSkeletonNote}
          </p>
        )}
      </header>

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Play size={16} className="text-accent" />
          <h2 className="text-lg font-bold text-white">Video Training</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainingContent.videos.map((video) => (
            <VideoCard key={video.title} id={video.id} title={video.title} description={video.description} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-accent" />
          <h2 className="text-lg font-bold text-white">Premium Feature Walkthroughs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingPremiumVideos.map((video) => (
            <VideoCard
              key={video.badge}
              id={video.id}
              title={video.title}
              description={video.description}
              badge={video.badge}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-accent" />
          <h2 className="text-lg font-bold text-white">Step-by-Step Guide</h2>
        </div>
        <div className="flex flex-col gap-4">
          {trainingWorkflowSteps.map((s, i) => {
            const Icon = STEP_ICONS[i] ?? Search;
            return (
              <div
                key={s.step}
                className="border border-border-dim/20 rounded-xl bg-[#0c0c0e] p-5 flex flex-col gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-[9px] font-bold text-accent uppercase tracking-widest">
                      Step {s.step}
                    </span>
                    <h3 className="text-base font-bold text-white">{s.title}</h3>
                    <p className="text-[13px] text-text-secondary leading-relaxed">{s.description}</p>
                  </div>
                </div>
                <div className="pl-14 flex flex-col gap-2">
                  {s.tips.map((tip) => (
                    <div key={tip} className="flex items-start gap-2">
                      <CheckCircle2 size={12} className="text-green-400 shrink-0 mt-0.5" />
                      <span className="text-[12px] text-text-secondary">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-accent" />
          <h2 className="text-lg font-bold text-white">Pro Tips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingProTips.map((tip, i) => (
            <div key={`${tip.title}-${i}`} className="border border-border-dim/20 rounded-xl bg-[#0c0c0e] p-4">
              <h3 className="text-[13px] font-bold text-white mb-2">{tip.title}</h3>
              <p className="text-[12px] text-text-muted">{tip.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-400" />
          <h2 className="text-lg font-bold text-white">Quick Start Checklist</h2>
        </div>
        <div className="border border-green-500/15 rounded-xl bg-green-500/3 p-5 flex flex-col gap-3">
          {trainingQuickStartChecklist.map((item, i) => (
            <div key={`${item}-${i}`} className="flex items-start gap-3">
              <span className="text-[9px] font-black text-green-400 w-5">{i + 1}</span>
              <span className="text-[13px] text-text-secondary">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-accent" />
          <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-2">
            {faqCount} answers
          </span>
        </div>
        <div className="flex flex-col gap-6">
          {trainingFaqSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <h3 className="text-[11px] font-bold text-accent uppercase tracking-[0.15em] px-1 mb-1">
                {section.title}
              </h3>
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="border border-accent/20 rounded-xl bg-accent/5 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">{trainingCta.headline}</h3>
          <p className="text-[13px] text-text-muted">{trainingCta.subcopy}</p>
        </div>
        <a
          href={trainingCta.href}
          className="btn-primary h-11 px-6 text-sm rounded-lg flex items-center gap-2 shrink-0"
        >
          <ArrowRight size={16} />
          <span>{trainingCta.buttonLabel}</span>
        </a>
      </section>
    </motion.div>
  );
}
