import RecurringStreamPage from "@/features/premium-recurring/pages/RecurringStreamPage";
import { FeatureGuard } from "@/components/layout/FeatureGuard";

export default function Page() {
  return (
    <FeatureGuard feature="premium-recurring">
      <RecurringStreamPage />
    </FeatureGuard>
  );
}
