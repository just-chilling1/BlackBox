"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Link2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { ArmedLinkInput } from "../components/ArmedLinkInput";
import { useBlogBuilder } from "../context/BlogBuilderContext";
import type { ArmedLink } from "../types";

function hasValidLink(links: ArmedLink[]): boolean {
  return links.some((l) => l.url.trim().startsWith("http"));
}

export default function LinkVaultPage() {
  const { sessionLoaded, saveLinksToVault } = useBlogBuilder();
  const [links, setLinks] = useState<ArmedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const skipAutoSave = useRef(true);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!sessionLoaded || hydrated.current) return;

    fetch("/api/blog/link-vault", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Could not load links library");
        return r.json();
      })
      .then((data) => {
        const stored = Array.isArray(data.links) ? (data.links as ArmedLink[]) : [];
        setLinks(stored);
      })
      .catch(() => setError("Could not load Links Library"))
      .finally(() => {
        hydrated.current = true;
        setLoading(false);
        skipAutoSave.current = false;
      });
  }, [sessionLoaded]);

  useEffect(() => {
    if (!sessionLoaded || loading || skipAutoSave.current) return;

    const shouldSave = links.length === 0 || hasValidLink(links);
    if (!shouldSave) return;

    const timer = setTimeout(() => {
      void saveLinksToVault(links)
        .then(() => {
          setSaved(true);
          setError(null);
          setTimeout(() => setSaved(false), 2000);
        })
        .catch(() => setError("Could not save to Links Library"));
    }, 500);

    return () => clearTimeout(timer);
  }, [links, sessionLoaded, loading, saveLinksToVault]);

  if (loading) {
    return <PageLoading message="Loading Links Library..." />;
  }

  return (
    <div className="page-stack w-full max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Links library"
        title="Saved promotion links"
        subtitle="Store affiliate and promo links with a name, tag, and description. Links also save automatically when you add them in the Sales Offer Generator."
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
          description="Add your first promotional link in the Sales Offer Generator, or enter one below."
          action={{ label: "Start Sales Offer Generator", href: "/sales-offer-generator" }}
        />
      ) : null}

      <div className="page-section-card">
        <ArmedLinkInput links={links} onChange={setLinks} />
      </div>

      {error && <ErrorBanner message={error} />}
      {saved && !error && (
        <p className="text-xs font-medium text-promo-accent">Saved to Links Library</p>
      )}
    </div>
  );
}
