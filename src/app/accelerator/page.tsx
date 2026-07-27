import AcceleratorPage from "@/features/premium-accelerator/pages/AcceleratorPage";
import { FeatureGuard } from "@/components/layout/FeatureGuard";

export default function Page() {
  return (
    <FeatureGuard feature="premium-accelerator">
      <AcceleratorPage />
    </FeatureGuard>
  );
}
