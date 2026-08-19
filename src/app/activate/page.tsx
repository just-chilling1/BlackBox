import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { loadFeaturePage } from "@/lib/load-feature-page";

const ActivatePage = loadFeaturePage(
  () => import("@/features/money-page/pages/ActivatePage"),
  "Loading Activator..."
);

export default function Page() {
  return (
    <FeatureGuard feature="asset-activator">
      <ActivatePage />
    </FeatureGuard>
  );
}
