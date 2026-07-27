import ProtectorPage from "@/features/protector/pages/ProtectorPage";
import { FeatureGuard } from "@/components/layout/FeatureGuard";

export default function Page() {
  return (
    <FeatureGuard feature="protector">
      <ProtectorPage />
    </FeatureGuard>
  );
}
