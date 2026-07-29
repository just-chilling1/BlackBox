"use client";

import { ReactNode } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { support } from "@/config/support.config";

export function SupportPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-stack w-full max-w-7xl">
      <PageHeader eyebrow="Help" title={support.pageTitle} subtitle={support.pageSubtitle} />
      {children}
    </div>
  );
}
