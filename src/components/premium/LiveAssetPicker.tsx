"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import type { LiveAssetSummary } from "@/app/api/assets/list/route";

export type { LiveAssetSummary };

interface LiveAssetPickerProps {
  value: string;
  onChange: (assetId: string, asset: LiveAssetSummary | null) => void;
  /** Prefill from URL ?siteId= or parent */
  preferredId?: string | null;
  liveOnly?: boolean;
  label?: string;
  storageKey?: string;
  className?: string;
  disabled?: boolean;
}

export function LiveAssetPicker({
  value,
  onChange,
  preferredId,
  liveOnly = true,
  label = "Money page",
  storageKey,
  className,
  disabled,
}: LiveAssetPickerProps) {
  const [assets, setAssets] = useState<LiveAssetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const q = liveOnly ? "" : "?live=0";
      const res = await fetch(`/api/assets/list${q}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load money pages");
      const list = Array.isArray(data.assets) ? (data.assets as LiveAssetSummary[]) : [];
      setAssets(list);

      if (list.length === 0) {
        onChange("", null);
        return;
      }

      let fromStorage: string | null = null;
      if (storageKey) {
        try {
          fromStorage = localStorage.getItem(storageKey);
        } catch {
          /* ignore */
        }
      }

      const preferred =
        (preferredId && list.some((a) => a.id === preferredId) && preferredId) ||
        (fromStorage && list.some((a) => a.id === fromStorage) && fromStorage) ||
        (value && list.some((a) => a.id === value) && value) ||
        list[0].id;

      const selected = list.find((a) => a.id === preferred) ?? list[0];
      onChange(selected.id, selected);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setAssets([]);
      onChange("", null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onChange is unstable; prefer preferredId/liveOnly
  }, [liveOnly, preferredId, storageKey]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!storageKey || !value) return;
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      /* ignore */
    }
  }, [storageKey, value]);

  if (loading) {
    return (
      <div className={className}>
        <p className="mb-2 text-sm font-medium text-text-primary">{label}</p>
        <p className="inline-flex items-center gap-2 text-sm text-text-muted">
          <Loader2 size={14} className="animate-spin" />
          Loading your money pages…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <p className="mb-2 text-sm font-medium text-text-primary">{label}</p>
        <p className="text-sm text-danger">{error}</p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          icon={Zap}
          title="No live money page yet"
          description="Activate an asset first — then you can generate extra pins, run Autopilot, or add authority sections here."
          action={{ label: "Activate Asset", href: "/activate" }}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <label htmlFor="live-asset-picker" className="mb-2 block text-sm font-medium text-text-primary">
        {label}
      </label>
      <select
        id="live-asset-picker"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const id = e.target.value;
          const asset = assets.find((a) => a.id === id) ?? null;
          onChange(id, asset);
        }}
        className="w-full rounded-xl border border-[var(--np-line)] bg-[var(--np-surface-field)] px-3.5 py-3 text-sm text-text-primary focus:border-pulse-700 focus:outline-none focus:ring-2 focus:ring-pulse-100"
      >
        {assets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.productName}
            {asset.pinCount > 0 ? ` · ${asset.pinCount} pins` : ""}
            {asset.status === "live" ? "" : " (draft)"}
          </option>
        ))}
      </select>
    </div>
  );
}
