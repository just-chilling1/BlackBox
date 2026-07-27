"use client";

import { Check, Link2 } from "lucide-react";
import { clsx } from "clsx";
import type { ArmedLink } from "../types";

interface ContentReservePickerProps {
  links: ArmedLink[];
  selectedUrl: string | null;
  onSelect: (link: ArmedLink | null) => void;
}

export function ContentReservePicker({ links, selectedUrl, onSelect }: ContentReservePickerProps) {
  if (links.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        Select from Content Reserve
      </label>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {links.map((link, index) => {
          const isSelected = selectedUrl === link.url;
          return (
            <button
              key={`${link.url}-${index}`}
              type="button"
              onClick={() => onSelect(isSelected ? null : link)}
              className={clsx(
                "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                isSelected
                  ? "border-promo-accent/50 bg-promo-accent/10"
                  : "border-border-dim bg-slate-50 hover:border-promo-accent/30"
              )}
            >
              <Link2
                size={16}
                className={clsx("shrink-0", isSelected ? "text-promo-accent" : "text-text-muted")}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={clsx(
                    "text-sm font-medium truncate",
                    isSelected ? "text-text-primary" : "text-text-secondary"
                  )}
                >
                  {link.label || "Untitled Link"}
                </p>
                <p className="text-xs text-text-muted truncate">{link.url}</p>
              </div>
              {isSelected && <Check size={16} className="text-promo-accent shrink-0" />}
            </button>
          );
        })}
      </div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-dim" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface px-3 text-xs text-text-muted">or enter manually</span>
        </div>
      </div>
    </div>
  );
}
