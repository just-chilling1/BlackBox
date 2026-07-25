/** Whether a sidebar/bottom-nav item should show as active for the current path. */
export function isNavPathActive(pathname: string, itemPath: string): boolean {
  if (itemPath === "/training") {
    return pathname === "/training" || pathname.startsWith("/training/");
  }
  return pathname === itemPath;
}
