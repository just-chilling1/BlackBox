import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { FeatureStubPage } from "@/components/FeatureStubPage";

export default function Page() {
  return (
    <FeatureGuard feature="premium-accelerator">
      <FeatureStubPage feature="premium-accelerator" title="Accelerator" />
    </FeatureGuard>
  );
}
