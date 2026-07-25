import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { FeatureStubPage } from "@/components/FeatureStubPage";

export default function Page() {
  return (
    <FeatureGuard feature="premium-social">
      <FeatureStubPage feature="premium-social" title="Social Payouts" />
    </FeatureGuard>
  );
}
