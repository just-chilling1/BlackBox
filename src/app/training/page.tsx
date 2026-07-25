import { FeatureGuard } from "@/components/layout/FeatureGuard";
import TrainingVideosPage from "@/features/training/pages/TrainingVideosPage";

export default function Page() {
  return (
    <FeatureGuard feature="training">
      <TrainingVideosPage />
    </FeatureGuard>
  );
}
