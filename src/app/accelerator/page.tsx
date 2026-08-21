import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { loadFeaturePage } from "@/lib/load-feature-page";

const AcceleratorPage = loadFeaturePage(
  () => import("@/features/premium-accelerator/pages/AcceleratorPage"),
  "Loading Unlimited..."
);

export default function Page() {
  return (
    <FeatureGuard feature="premium-accelerator">
      <AcceleratorPage />
    </FeatureGuard>
  );
}
