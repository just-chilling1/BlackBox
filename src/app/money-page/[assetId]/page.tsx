import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { loadFeaturePage } from "@/lib/load-feature-page";

const MoneyPageEditor = loadFeaturePage(
  () => import("@/features/money-page/pages/MoneyPageEditor"),
  "Loading money page..."
);

export default function Page() {
  return (
    <FeatureGuard feature="money-page">
      <MoneyPageEditor />
    </FeatureGuard>
  );
}
