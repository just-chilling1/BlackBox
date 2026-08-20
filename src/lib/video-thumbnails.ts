export const VIDEO_THUMBNAILS: Record<string, string> = {
  /** Map Vimeo IDs to custom poster paths once videos are uploaded */
};

/** Dashboard video track — index 0–2 */
export const DASHBOARD_VIDEO_THUMBNAILS = [
  "/thumbnails/dashboard-01-watch-this-first.webp",
  "/thumbnails/dashboard-02-how-the-money-flows.webp",
  "/thumbnails/dashboard-03-five-minute-tour.webp",
] as const;

/** Academy platform tutorials — no custom posters (play placeholder only) */
export const ACADEMY_PLATFORM_THUMBNAILS = [] as const;

/** Academy premium tutorials — no custom posters (play placeholder only) */
export const ACADEMY_PREMIUM_THUMBNAILS = [] as const;

const VIMEO_ID_REGEX = /vimeo\.com\/(?:video\/)?(\d+)/;

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
  // byline/portrait/title hide the uploader and channel info in the player chrome
  const params = new URLSearchParams({
    badge: "0",
    byline: "0",
    portrait: "0",
    title: "0",
    autopause: "0",
    player_id: "0",
    app_id: "58479",
    dnt: "1",
    ...(autoplay ? { autoplay: "1" } : {}),
  });
  return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}
