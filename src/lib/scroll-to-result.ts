export function scrollToGenerationResult(targetId: string, attempt = 0) {
  const el = document.getElementById(targetId);
  if (!el) {
    if (attempt < 10) {
      window.setTimeout(() => scrollToGenerationResult(targetId, attempt + 1), 120);
    }
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
