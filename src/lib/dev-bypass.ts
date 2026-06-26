/** Local preview only — set DEV_BYPASS_AUTH=true in .env.local */
export function isDevAuthBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.DEV_BYPASS_AUTH === "true"
  );
}
