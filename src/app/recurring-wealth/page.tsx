import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { FeatureStubPage } from "@/components/FeatureStubPage";

export default function Page() {
  return (
    <FeatureGuard feature="premium-recurring">
      <FeatureStubPage feature="premium-recurring" title="Recurring Wealth" />
    </FeatureGuard>
  );
}
