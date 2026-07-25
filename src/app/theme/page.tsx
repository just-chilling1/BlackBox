import { FeatureGuard } from "@/components/layout/FeatureGuard";
import ChooseThemePage from "@/features/blog-builder/pages/ChooseThemePage";

export default function Page() {
  return (
    <FeatureGuard feature="blog-builder">
      <ChooseThemePage />
    </FeatureGuard>
  );
}
