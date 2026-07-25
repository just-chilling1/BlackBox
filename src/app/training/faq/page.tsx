import { FeatureGuard } from "@/components/layout/FeatureGuard";
import TrainingFaqPage from "@/features/training/pages/TrainingFaqPage";

export default function Page() {
  return (
    <FeatureGuard feature="training">
      <TrainingFaqPage />
    </FeatureGuard>
  );
}
