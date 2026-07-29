"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import { trainingContent as trainingMeta } from "@/config/training.config";
import { TrainingTabNav } from "./TrainingTabNav";

export function TrainingPageLayout({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-container py-6"
    >
      <PageHeader
        eyebrow="Academy"
        title={trainingMeta.pageTitle}
        subtitle={trainingMeta.pageSubtitle}
      />

      <TrainingTabNav />
      {children}
    </motion.div>
  );
}
