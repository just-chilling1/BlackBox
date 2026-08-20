"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ExternalLink, Loader2, Rocket } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { WorkflowPage } from "@/components/ui/workflow-page";
import { WorkflowStepsBar } from "@/components/ui/workflow-steps";
import { EmptyState } from "@/components/ui/empty-state";

interface ResultsPayload {
  moneyPagesLive: number;
  trafficAssetsCreated: number;
  visitorsGenerated: number;
  affiliateClicks: number;
  warning?: string;
  assets: {
    id: string;
    product: string;
    status: string;
    traffic: number;
    affiliateClicks: number;
    ctr: number;
    href: string;
    publicPath?: string | null;
    viewHref?: string;
  }[];
  activity: { at: string; text: string }[];
}

function StatusBadge({ status }: { status: string }) {
  const live = status.toLowerCase() === "live" || status.toLowerCase() === "active";
  return (
    <span className={live ? "status-badge status-badge--live" : "status-badge status-badge--draft"}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultsPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/results")
      .then((r) => r.json())
      .then((payload) => {
        if (payload.error) setError(payload.error);
        else {
          setData(payload);
          if (typeof payload.warning === "string" && payload.warning) {
            setError(payload.warning);
          }
        }
      })
      .catch(() => setError("Could not load results"))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Money pages live", value: data?.moneyPagesLive ?? 0 },
    { label: "Traffic assets created", value: data?.trafficAssetsCreated ?? 0 },
    { label: "Visitors generated", value: data?.visitorsGenerated ?? 0 },
    { label: "Affiliate clicks", value: data?.affiliateClicks ?? 0 },
  ];

  return (
    <WorkflowPage width="wide">
      <WorkflowStepsBar current="results" />
      <PageHeader
        eyebrow="Step 4"
        title="Your results"
        subtitle="These numbers come from real visits and clicks — nothing is simulated."
      />

      {error ? <div className="alert-banner">{error}</div> : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <GlassPanel key={stat.label} className="stat-card">
            <div className="stat-card-label">{stat.label}</div>
            <div className="stat-card-value">
              {loading ? <Loader2 className="inline h-6 w-6 animate-spin text-pulse-500" /> : stat.value}
            </div>
          </GlassPanel>
        ))}
      </div>

      <GlassPanel className="overflow-hidden p-0">
        <div className="border-b border-[var(--np-line)] px-5 py-4">
          <h2 className="ds-h3">Asset performance</h2>
        </div>
        {(data?.assets ?? []).length === 0 && !loading ? (
          <div className="p-6">
            <EmptyState
              icon={Rocket}
              title="No assets yet"
              description="Activate your first product to publish a money page and start tracking visitors."
              actionHref="/activate"
              actionLabel="Activate an asset"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[var(--np-surface-field)] text-xs uppercase tracking-wide text-ink-4">
                <tr>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Traffic</th>
                  <th className="px-5 py-3 font-medium">Affiliate clicks</th>
                  <th className="px-5 py-3 font-medium">CTR</th>
                  <th className="px-5 py-3 font-medium text-right">Sales page</th>
                </tr>
              </thead>
              <tbody>
                {(data?.assets ?? []).map((asset) => {
                  const viewHref = asset.viewHref || asset.publicPath || asset.href;
                  return (
                    <tr key={asset.id} className="border-t border-[var(--np-line)]">
                      <td className="px-5 py-4">
                        <Link href={asset.href} className="font-medium text-pulse-500 hover:underline">
                          {asset.product}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={asset.status} />
                      </td>
                      <td className="px-5 py-4 text-ink-2">{asset.traffic} visitors</td>
                      <td className="px-5 py-4 text-ink-2">{asset.affiliateClicks} clicks</td>
                      <td className="px-5 py-4 text-ink-2">{asset.ctr.toFixed(1)}%</td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href={viewHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary inline-flex min-h-9 items-center gap-1.5 px-3 py-1.5 text-[13px]"
                        >
                          View
                          <ExternalLink size={14} strokeWidth={1.75} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>

      <GlassPanel className="space-y-5 p-6 sm:p-7">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-pulse-500" />
          <h2 className="ds-h3">Recent activity</h2>
        </div>
        {(data?.activity ?? []).length === 0 ? (
          <p className="text-sm leading-relaxed text-ink-4">
            No tracked events yet. Publish a page and share a pin to see activity here.
          </p>
        ) : (
          <ul className="space-y-3">
            {(data?.activity ?? []).map((item) => (
              <li
                key={item.at + item.text}
                className="rounded-lg border border-[var(--np-line)] bg-[var(--np-surface-field)] px-4 py-3 text-sm text-ink-2"
              >
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </GlassPanel>
    </WorkflowPage>
  );
}
