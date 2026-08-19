"use client";

/** Brand CSS vars are applied on <html> in app/layout.tsx (server) to avoid hydration drift. */
export function BrandStyleProvider({ children }: { children: React.ReactNode }) {
  return children;
}
