"use client";

import { ReactNode } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { trainingContent as trainingMeta } from "@/config/training.config";
import { TrainingTabNav } from "./TrainingTabNav";

export function TrainingPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-container py-6 animate-fade-in-up">
      <PageHeader
        eyebrow="Academy"
        title={trainingMeta.pageTitle}
        subtitle={trainingMeta.pageSubtitle}
      />

      <TrainingTabNav />
      {children}
    </div>
  );
}
