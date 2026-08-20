export const VIDEO_THUMBNAILS: Record<string, string> = {};

/** Dashboard / academy posters disabled — play placeholder only */
export const DASHBOARD_VIDEO_THUMBNAILS = [] as const;
export const ACADEMY_PLATFORM_THUMBNAILS = [] as const;
export const ACADEMY_PREMIUM_THUMBNAILS = [] as const;

const VIMEO_ID_REGEX = /vimeo\.com\/(?:video\/)?(\d+)/;

export function getVideoThumbnailById(_id: string): string | null {
  return null;
}

export function getDashboardVideoThumbnail(_index: number): string | null {
  return null;
}

export function getAcademyPlatformThumbnail(_index: number): string | null {
  return null;
}

export function getAcademyPremiumThumbnail(_index: number): string | null {
  return null;
}

export function resolveVideoThumbnail(
  _videoId: string,
  _fallbackSrc?: string | null
): string | null {
  return null;
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
