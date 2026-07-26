"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { brand } from "@/config/brand.config";
import { getFeatureMeta, type FeatureId } from "@/config/features.config";
import { PageHeader } from "@/components/ui/page-header";

interface FeatureStubPageProps {
  feature: FeatureId;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function FeatureStubPage({ feature, eyebrow, title, subtitle }: FeatureStubPageProps) {
  const meta = getFeatureMeta(feature);

  return (
    <div className="page-stack w-full max-w-2xl">
      <PageHeader
        eyebrow={eyebrow ?? "Coming soon"}
        title={title ?? meta?.description.split(".")[0] ?? feature}
        subtitle={
          subtitle ??
          `Enable and implement the "${feature}" module for ${brand.productName}. See the feature catalog guide for full implementation steps.`
        }
      />

      <div className="card-base border-dashed border-accent/30 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="text-accent shrink-0" size={20} />
          <span className="font-bold text-text-primary">Implementation guide</span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Read{" "}
          <code className="text-accent">.cursor/skills/product-feature-catalog/features/{meta?.guide ?? feature}.md</code>{" "}
          and implement under <code className="text-accent">src/features/</code>.
        </p>
        <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 w-fit">
          Back to dashboard
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
