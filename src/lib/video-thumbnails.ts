export const VIDEO_THUMBNAILS: Record<string, string> = {
  /** Map Vimeo IDs to custom poster paths once videos are uploaded */
};

/** Dashboard video track — index 0–2 */
export const DASHBOARD_VIDEO_THUMBNAILS = [
  "/thumbnails/dashboard-01-watch-this-first.png",
  "/thumbnails/dashboard-02-how-the-money-flows.png",
  "/thumbnails/dashboard-03-five-minute-tour.png",
] as const;

/** Academy platform tutorials — index 0–2 */
export const ACADEMY_PLATFORM_THUMBNAILS = [
  "/thumbnails/academy-04-sales-offer-generator.png",
  "/thumbnails/academy-05-x-power-promotions.png",
  "/thumbnails/academy-06-links-offers-library.png",
] as const;

/** Academy premium tutorials — index 0–3 */
export const ACADEMY_PREMIUM_THUMBNAILS = [
  "/thumbnails/academy-07-accelerator.png",
  "/thumbnails/academy-08-recurring-stream.png",
  "/thumbnails/academy-09-social-payouts.png",
  "/thumbnails/academy-10-protector.png",
] as const;

const VIMEO_ID_REGEX = /vimeo\.com\/(?:video\/)?(\d+)/;

export function getVideoThumbnail(videoUrl: string): string | null {
  const match = videoUrl.match(VIMEO_ID_REGEX);
  if (!match) return null;
  return VIDEO_THUMBNAILS[match[1]] ?? null;
}

export function getVideoThumbnailById(id: string): string | null {
  return VIDEO_THUMBNAILS[id] ?? null;
}

export function getDashboardVideoThumbnail(index: number): string | null {
  return DASHBOARD_VIDEO_THUMBNAILS[index] ?? null;
}

export function getAcademyPlatformThumbnail(index: number): string | null {
  return ACADEMY_PLATFORM_THUMBNAILS[index] ?? null;
}

export function getAcademyPremiumThumbnail(index: number): string | null {
  return ACADEMY_PREMIUM_THUMBNAILS[index] ?? null;
}

export function resolveVideoThumbnail(
  videoId: string,
  fallbackSrc?: string | null
): string | null {
  if (videoId) {
    return getVideoThumbnailById(videoId) ?? fallbackSrc ?? null;
  }
  return fallbackSrc ?? null;
}

export function toEmbedUrl(videoUrl: string, autoplay = true): string {
  const match = videoUrl.match(VIMEO_ID_REGEX);
  const id = match?.[1] ?? videoUrl.replace(/\D/g, "");
  const params = new URLSearchParams({
    badge: "0",
    autopause: "0",
    player_id: "0",
    app_id: "58479",
    ...(autoplay ? { autoplay: "1" } : {}),
  });
  return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}
