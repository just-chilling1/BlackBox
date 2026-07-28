"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { clsx } from "clsx";
import { AiLoadingBar } from "@/components/ui/AiLoadingBar";

interface SuggestionGridProps {
  suggestions: string[];
  selected: string;
  onSelect: (s: string) => void;
  loading?: boolean;
}

export function SuggestionGrid({
  suggestions,
  selected,
  onSelect,
  loading,
}: SuggestionGridProps) {
  if (loading) {
    return (
      <div className="glass-card p-6 flex flex-col gap-4">
        <AiLoadingBar label="Finding good topics for you" />
        <p className="text-sm text-text-muted text-center">
          This can take 10–30 seconds. Hang tight.
        </p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <p className="text-sm text-text-muted text-center py-2">
        Topic ideas will appear here after you press the Suggest button.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {suggestions.map((s) => (
        <motion.button
          key={s}
          type="button"
          whileHover={{ scale: 1.01 }}
          onClick={() => onSelect(s)}
          className={clsx("select-card p-4", selected === s && "is-selected")}
        >
          <span className={clsx("select-card-label block", selected === s && "font-bold text-amber-900")}>
            {s}
          </span>
          {selected === s && (
            <span className="select-check-badge select-check-badge--corner" aria-hidden>
              <Check size={18} strokeWidth={3} />
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
