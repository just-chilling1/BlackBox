import { FeatureGuard } from "@/components/layout/FeatureGuard";
import OffersLibraryPage from "@/features/blog-builder/pages/OffersLibraryPage";

export default function Page() {
  return (
    <FeatureGuard feature="blog-builder">
      <OffersLibraryPage />
    </FeatureGuard>
  );
}
