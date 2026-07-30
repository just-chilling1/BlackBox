import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { loadFeaturePage } from "@/lib/load-feature-page";

const PromotePage = loadFeaturePage(
  () => import("@/features/publish-kit/pages/PromotePage"),
  "Loading X-Power Promotions..."
);

export default function Page() {
  return (
    <FeatureGuard feature="article-publish">
      <PromotePage />
    </FeatureGuard>
  );
}
