import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  intensity?: "low" | "medium" | "high";
}

export function GlassPanel({
  children,
  className,
  contentClassName,
  intensity = "medium",
}: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "glass-panel rounded-[var(--np-r-lg)] relative overflow-hidden",
        "border-border-dim shadow-card",
        intensity === "high" && "ring-1 ring-[color:var(--np-line-pulse)]"
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-pulse-100/40 to-transparent pointer-events-none" />
      {/* Layout/spacing classes must live here so children receive gap/padding. */}
      <div className={cn("relative z-10 min-h-0", className, contentClassName)}>{children}</div>
    </motion.div>
  );
}
