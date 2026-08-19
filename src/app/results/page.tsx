import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { loadFeaturePage } from "@/lib/load-feature-page";

const ResultsPage = loadFeaturePage(
  () => import("@/features/results/pages/ResultsPage"),
  "Loading results..."
);

export default function Page() {
  return (
    <FeatureGuard feature="results">
      <ResultsPage />
    </FeatureGuard>
  );
}
