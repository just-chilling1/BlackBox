"use client";

import { isFeatureEnabled } from "@/config/features.config";
import { CoreWorkflowProvider } from "@/features/core-workflow/CoreWorkflowProvider";
import { BrandStyleProvider } from "./BrandStyleProvider";
import { Shell } from "./Shell";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const content = (
    <BrandStyleProvider>
      <Shell>{children}</Shell>
    </BrandStyleProvider>
  );

  if (isFeatureEnabled("core-workflow")) {
    return <CoreWorkflowProvider>{content}</CoreWorkflowProvider>;
  }

  return content;
}
