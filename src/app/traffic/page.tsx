import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { loadFeaturePage } from "@/lib/load-feature-page";

const TrafficHubPage = loadFeaturePage(
  () => import("@/features/traffic/pages/TrafficHubPage"),
  "Loading traffic generator..."
);

export default function Page() {
  return (
    <FeatureGuard feature="traffic-pins">
      <TrafficHubPage />
    </FeatureGuard>
  );
}
