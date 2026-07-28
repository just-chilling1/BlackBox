/** Whether a sidebar/bottom-nav item should show as active for the current path. */
export function isNavPathActive(pathname: string, itemPath: string): boolean {
  if (itemPath === "/sales-offer-generator") {
    return pathname === "/sales-offer-generator";
  }
  if (itemPath === "/training") {
    return pathname === "/training" || pathname.startsWith("/training/") || pathname === "/academy";
  }
  if (itemPath === "/support") {
    return pathname === "/support" || pathname.startsWith("/support/");
  }
  return pathname === itemPath;
}
