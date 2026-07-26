import { FeatureGuard } from "@/components/layout/FeatureGuard";
import PromotePage from "@/features/publish-kit/pages/PromotePage";

export default function Page() {
  return (
    <FeatureGuard feature="article-publish">
      <PromotePage />
    </FeatureGuard>
  );
}
