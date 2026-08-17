import { FeatureGuard } from "@/components/layout/FeatureGuard";
import { loadFeaturePage } from "@/lib/load-feature-page";

const ProtectorPage = loadFeaturePage(
  () => import("@/features/protector/pages/ProtectorPage"),
  "Loading Cyber Protection..."
);

export default function Page() {
  return (
    <FeatureGuard feature="protector">
      <ProtectorPage />
    </FeatureGuard>
  );
}
