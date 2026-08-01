"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Link2, Loader2, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { ArmedLinkInput } from "../components/ArmedLinkInput";
import { useBlogBuilder } from "../context/BlogBuilderContext";
import type { ArmedLink } from "../types";
import { isValidAffiliateUrl } from "../lib/affiliate-url";

function hasValidLink(links: ArmedLink[]): boolean {
  return links.some((l) => isValidAffiliateUrl(l.url));
}

export default function LinkVaultPage() {
  const { sessionLoaded, armedLinks, saveLinksToVault } = useBlogBuilder();
  const [links, setLinks] = useState<ArmedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!sessionLoaded || hydrated.current) return;

    const stored = armedLinks.length > 0 ? armedLinks : [];
    setLinks(
      stored.length > 0
        ? stored
        : [{ label: "Promotional Offer", url: "", network: "other" }]
    );
    hydrated.current = true;
    setLoading(false);
  }, [sessionLoaded, armedLinks]);

  const handleSave = async () => {
    if (!hasValidLink(links)) {
      setError("Add at least one link with a valid URL before saving.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await saveLinksToVault(links);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Could not save to Links Library");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoading message="Loading Links Library..." />;
  }

  const canSave = hasValidLink(links) && !saving;

  return (
    <div className="page-container">
      <PageHeader
        eyebrow="Links library"
        title="Saved promotion links"
        subtitle="Store affiliate and promo links with a name, tag, and description. Click Save link when you're ready."
        actions={
          <Link href="/sales-offer-generator" className="btn-secondary text-sm">
            Add link in generator
          </Link>
        }
      />

      {links.length === 0 ? (
        <EmptyState
          icon={Link2}
          title="No links saved yet"
          description="Add your first promotional link below, or start in the Sales Offer Generator."
          action={{ label: "Start Sales Offer Generator", href: "/sales-offer-generator" }}
        />
      ) : null}

      <div className="page-section-card space-y-4">
        <ArmedLinkInput links={links} onChange={setLinks} />

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!canSave}
            className="btn-primary"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : saved ? (
              <Check size={18} />
            ) : (
              <Save size={18} />
            )}
            {saved ? "Link Saved" : saving ? "Saving..." : "Save link"}
          </button>
          {saved && !error && (
            <span className="text-sm font-medium text-success">Saved to Links Library</span>
          )}
        </div>
      </div>

      {error && <ErrorBanner message={error} />}
    </div>
  );
}
