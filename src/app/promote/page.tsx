import { Suspense } from "react";
import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { PageLoading } from "@/components/ui/page-loading";
import PromotePage from "@/features/publish-kit/pages/PromotePage";

export default function Page() {
  return (
    <FeatureGuard feature="article-publish">
      <Suspense fallback={<PageLoading message="Loading X-Power Promotions..." />}>
        <PromotePage />
      </Suspense>
    </FeatureGuard>
  );
}
