"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Rocket } from "lucide-react";
import { DeploySitePreview } from "./DeploySitePreview";
import { EarningsBanner } from "@/components/ui/earnings-banner";
import type { BlogSite } from "../types";

interface DeployCompletePanelProps {
  site: BlogSite;
  productName?: string | null;
  showOfferBanner: boolean;
  onDismissBanner: () => void;
  onGenerateAnother: () => void;
  onViewVault: () => void;
}

export function DeployCompletePanel({
  site,
  productName,
  showOfferBanner,
  onDismissBanner,
  onGenerateAnother,
  onViewVault,
}: DeployCompletePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-w-0 max-w-full flex-col gap-5 scroll-mt-24 overflow-x-clip"
    >
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/[0.08] via-accent/[0.04] to-transparent p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 ring-1 ring-accent/25">
            <CheckCircle2 className="shrink-0 text-accent" size={24} />
          </div>
          <div className="min-w-0">
            <p className="brand-font text-lg text-text-primary sm:text-xl">
              {productName || site.title}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Published and ready to share. Visitors complete the quiz, then see your affiliate offer on the last page.
            </p>
          </div>
        </div>
      </div>

      <DeploySitePreview site={site} showLiveLink />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <motion.button
          type="button"
          onClick={onGenerateAnother}
          whileHover={{ scale: 1.01 }}
          className="w-full rounded-xl border border-accent/40 bg-gradient-to-br from-accent to-[#C9970D] px-4 py-4 text-base font-bold text-text-on-accent shadow-gold"
        >
          <span className="flex items-center justify-center gap-2">
            <Rocket size={18} />
            Generate Another Site
          </span>
        </motion.button>

        <motion.button
          type="button"
          onClick={onViewVault}
          whileHover={{ scale: 1.01 }}
          className="w-full rounded-xl border border-accent/35 bg-white px-4 py-4 text-base font-bold text-accent shadow-sm transition-colors hover:border-accent/50 hover:bg-accent/5"
        >
          <span className="flex items-center justify-center gap-2">
            View Asset Vault
            <ArrowRight size={18} />
          </span>
        </motion.button>
      </div>

      {showOfferBanner && <EarningsBanner compact onDismiss={onDismissBanner} />}
    </motion.div>
  );
}
