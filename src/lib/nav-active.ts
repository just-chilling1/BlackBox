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
  if (itemPath === "/traffic") {
    return pathname === "/traffic" || pathname.startsWith("/traffic/");
  }
  if (itemPath === "/account" || itemPath.startsWith("/account#")) {
    return pathname === "/account";
  }
  const pathOnly = itemPath.split("#")[0];
  return pathname === pathOnly || pathname === itemPath;
}
