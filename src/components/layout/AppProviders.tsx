"use client";

import { isFeatureEnabled } from "@/config/features.config";
import { CoreWorkflowProvider } from "@/features/core-workflow/CoreWorkflowProvider";
import { BlogBuilderWorkflowProvider } from "@/features/blog-builder/context/BlogBuilderWorkflowProvider";
import { BrandStyleProvider } from "./BrandStyleProvider";
import { Shell } from "./Shell";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const content = (
    <BrandStyleProvider>
      <Shell>{children}</Shell>
    </BrandStyleProvider>
  );

  if (isFeatureEnabled("blog-builder")) {
    return <BlogBuilderWorkflowProvider>{content}</BlogBuilderWorkflowProvider>;
  }

  if (isFeatureEnabled("core-workflow")) {
    return <CoreWorkflowProvider>{content}</CoreWorkflowProvider>;
  }

  return content;
}
