import { loadFeaturePage } from "@/lib/load-feature-page";

const AccountPage = loadFeaturePage(
  () => import("@/features/account/pages/AccountPage"),
  "Loading account..."
);

export default function Page() {
  return <AccountPage />;
}
