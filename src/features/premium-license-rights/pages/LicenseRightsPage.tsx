"use client";

import { LicenseRightsPanel } from "@/features/premium-license-rights/components/LicenseRightsPanel";
import { PremiumWorkflowShell } from "@/components/premium/PremiumWorkflowShell";
import { brand } from "@/config/brand.config";

/** Standalone page kept for bookmarks; Account is the primary home. */
export default function LicenseRightsPage() {
  return (
    <PremiumWorkflowShell
      title="Reseller & License Rights"
      subtitle={`Request activation from support. Manage this from Account anytime — your ticket is filed as "License Rights".`}
      tip={
        <>
          Tip: Sell {brand.productName} under your own brand after activation — submit one request
          below.
        </>
      }
    >
      <LicenseRightsPanel />
    </PremiumWorkflowShell>
  );
}
