import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { FeatureStubPage } from "@/components/FeatureStubPage";

export default function Page() {
  return (
    <FeatureGuard feature="protector">
      <FeatureStubPage feature="protector" title="Wealth Protector" />
    </FeatureGuard>
  );
}
