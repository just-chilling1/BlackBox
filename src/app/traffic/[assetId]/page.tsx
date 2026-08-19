import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { loadFeaturePage } from "@/lib/load-feature-page";

const TrafficPage = loadFeaturePage(
  () => import("@/features/traffic/pages/TrafficPage"),
  "Loading traffic assets..."
);

export default function Page() {
  return (
    <FeatureGuard feature="traffic-pins">
      <TrafficPage />
    </FeatureGuard>
  );
}
