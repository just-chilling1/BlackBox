"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import { trainingPageSkeletonNote, trainingContentReady } from "@/config/training-content.config";
import { trainingContent as trainingMeta } from "@/config/training.config";
import { TrainingTabNav } from "./TrainingTabNav";

export function TrainingPageLayout({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-6"
    >
      <PageHeader
        eyebrow="Academy"
        title={trainingMeta.pageTitle}
        subtitle={trainingMeta.pageSubtitle}
      />

      {!trainingContentReady && (
        <p className="-mt-4 mb-2 alert-warning">
          {trainingPageSkeletonNote}
        </p>
      )}

      <TrainingTabNav />
      {children}
    </motion.div>
  );
}
