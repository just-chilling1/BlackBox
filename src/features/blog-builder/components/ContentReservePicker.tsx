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
      <label className="wizard-form-label mb-2 block">Select from Links Library</label>
      <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
        {links.map((link, index) => {
          const isSelected = selectedUrl === link.url;
          return (
            <button
              key={`${link.url}-${index}`}
              type="button"
              onClick={() => onSelect(isSelected ? null : link)}
              className={clsx(
                "flex w-full items-center gap-3 rounded-xl border p-3 text-left cursor-pointer transition-all duration-200",
                isSelected
                  ? "border-accent/55 bg-accent/10 ring-1 ring-accent/20"
                  : "border-border-dim bg-page hover:border-accent/35 hover:bg-white"
              )}
            >
              <Link2
                size={16}
                className={clsx("shrink-0", isSelected ? "text-accent" : "text-text-muted")}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={clsx(
                    "truncate text-sm font-medium",
                    isSelected ? "text-text-heading" : "text-text-primary"
                  )}
                >
                  {link.label || "Untitled Link"}
                </p>
                <p className="truncate text-xs text-text-muted">{link.url}</p>
              </div>
              {isSelected && <Check size={16} className="shrink-0 text-accent" strokeWidth={2.5} />}
            </button>
          );
        })}
      </div>
      <p className="wizard-divider-label">or enter manually</p>
    </div>
  );
}
