"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { WorkflowPage } from "@/components/ui/workflow-page";
import { PremiumVideoTutorial } from "@/components/premium/PremiumVideoTutorial";

type WorkflowWidth = "narrow" | "default" | "wide";

export interface PremiumTrainingConfig {
  vimeoId: string;
  title: string;
  description: string;
  iframeTitle?: string;
  thumbnailSrc?: string;
}

interface PremiumWorkflowShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  width?: WorkflowWidth;
  actions?: ReactNode;
  training?: PremiumTrainingConfig;
  tip?: ReactNode;
}

/** Shared NullPing layout for premium feature pages (matches Asset Vault). */
export function PremiumWorkflowShell({
  title,
  subtitle,
  children,
  width = "wide",
  actions,
  training,
  tip,
}: PremiumWorkflowShellProps) {
  const [showTraining, setShowTraining] = useState(false);

  return (
    <WorkflowPage width={width}>
      <PageHeader
        eyebrow="Premium"
        title={title}
        subtitle={subtitle}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {training ? (
              <button
                type="button"
                onClick={() => setShowTraining((v) => !v)}
                className="btn-secondary inline-flex items-center gap-2 text-sm"
              >
                <PlayCircle size={16} />
                Training
                {showTraining ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            ) : null}
            {actions}
          </div>
        }
      />

      {showTraining && training ? (
        <PremiumVideoTutorial
          vimeoId={training.vimeoId}
          title={training.title}
          description={training.description}
          iframeTitle={training.iframeTitle ?? training.title}
          thumbnailSrc={training.thumbnailSrc}
        />
      ) : null}

      {tip ? <p className="text-sm text-text-muted">{tip}</p> : null}

      {children}
    </WorkflowPage>
  );
}
