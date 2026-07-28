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
                "select-card flex w-full items-center gap-3 p-3",
                isSelected && "is-selected"
              )}
            >
              <Link2
                size={16}
                className={clsx("shrink-0", isSelected ? "text-amber-800" : "text-text-muted")}
              />
              <div className="min-w-0 flex-1">
                <p className={clsx("select-card-label truncate", isSelected && "font-bold text-amber-900")}>
                  {link.label || "Untitled Link"}
                </p>
                <p className="truncate text-xs text-text-muted">{link.url}</p>
              </div>
              {isSelected && (
                <span className="select-check-badge" aria-hidden>
                  <Check size={18} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="wizard-divider-label">or enter manually</p>
    </div>
  );
}
