"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ArmedLink } from "../types";
import { detectLinkNetwork } from "../lib/affiliate-url";

interface ArmedLinkInputProps {
  links: ArmedLink[];
  onChange: (links: ArmedLink[]) => void;
}

export function ArmedLinkInput({ links, onChange }: ArmedLinkInputProps) {
  const updateLink = (index: number, patch: Partial<ArmedLink>) => {
    const next = links.map((link, i) => (i === index ? { ...link, ...patch } : link));
    onChange(next);
  };

  const addLink = () => {
    onChange([
      ...links,
      { label: "Promotional Offer", url: "", network: "other" },
    ]);
  };

  const removeLink = (index: number) => {
    if (links.length <= 1) {
      onChange([{ label: "Promotional Offer", url: "", network: "other" }]);
      return;
    }
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {links.map((link, index) => (
        <div key={index} className="card-base space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Link {index + 1}
            </span>
            {links.length > 1 && (
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="text-text-muted hover:text-error transition-colors p-1"
                aria-label="Remove link"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Link Name</label>
            <input
              type="text"
              value={link.label}
              onChange={(e) => updateLink(index, { label: e.target.value })}
              placeholder="e.g. My Fitness eBook, Keto Supplement"
              className="w-full rounded-xl border border-border-dim bg-page px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">URL</label>
            <input
              type="url"
              value={link.url}
              onChange={(e) => {
                const url = e.target.value;
                updateLink(index, { url, network: detectLinkNetwork(url) });
              }}
              placeholder="https://example.com/product?ref=your-id"
              className="w-full rounded-xl border border-border-dim bg-page px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addLink}
        className="inline-flex items-center gap-2 text-sm text-promo-accent hover:text-accent transition-colors"
      >
        <Plus size={16} />
        Add another link
      </button>
    </div>
  );
}
