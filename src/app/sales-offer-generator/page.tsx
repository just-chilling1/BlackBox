import { Suspense } from "react";
import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { PageLoading } from "@/components/ui/page-loading";
import SalesOfferGeneratorPage from "@/features/blog-builder/pages/SalesOfferGeneratorPage";

export default function Page() {
  return (
    <FeatureGuard feature="blog-builder">
      <Suspense fallback={<PageLoading message="Loading Sales Offer Generator..." />}>
        <SalesOfferGeneratorPage />
      </Suspense>
    </FeatureGuard>
  );
}
