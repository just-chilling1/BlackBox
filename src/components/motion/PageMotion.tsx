"use client";

import type { ReactNode } from "react";

/** Light route enter animation without framer-motion on every navigation. */
export function PageMotion({ children }: { children: ReactNode }) {
  return <div className="page-enter min-h-full">{children}</div>;
}
