import { Suspense } from "react";
import SocialPayoutsPage from "@/features/premium-social/pages/SocialPayoutsPage";
import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { PageLoading } from "@/components/ui/page-loading";

export default function Page() {
  return (
    <FeatureGuard feature="premium-social">
      <Suspense fallback={<PageLoading message="Loading Social Payouts..." />}>
        <SocialPayoutsPage />
      </Suspense>
    </FeatureGuard>
  );
}
