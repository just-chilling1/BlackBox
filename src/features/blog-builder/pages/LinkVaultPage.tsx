"use client";

import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
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
        if (!r.ok) throw new Error("Could not load link vault");
        return r.json();
      })
      .then((data) => {
        const stored = Array.isArray(data.links) ? (data.links as ArmedLink[]) : [];
        setLinks(stored);
      })
      .catch(() => setError("Could not load Content Reserve"))
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
        .catch(() => setError("Could not save to Content Reserve"));
    }, 500);

    return () => clearTimeout(timer);
  }, [links, sessionLoaded, loading, saveLinksToVault]);

  if (loading) {
    return <p className="text-text-muted text-sm animate-pulse">Loading Content Reserve...</p>;
  }

  return (
    <div className="page-stack w-full max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Content Reserve"
        title="Link Vault"
        subtitle="Your promotional links are saved here automatically whenever you add or edit them in Step 1 or on this page."
      />

      <ArmedLinkInput links={links} onChange={setLinks} />

      {error && <p className="text-sm text-error">{error}</p>}
      {saved && !error && <p className="text-xs text-promo-accent">Saved to Content Reserve</p>}
    </div>
  );
}
