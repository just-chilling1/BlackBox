export const VIDEO_THUMBNAILS: Record<string, string> = {
  /** Add local thumbnails under public/thumbnails/ when available */
};

const VIMEO_ID_REGEX = /vimeo\.com\/(?:video\/)?(\d+)/;

export function getVideoThumbnail(videoUrl: string): string | null {
  const match = videoUrl.match(VIMEO_ID_REGEX);
  if (!match) return null;
  return VIDEO_THUMBNAILS[match[1]] ?? null;
}

export function getVideoThumbnailById(id: string): string | null {
  return VIDEO_THUMBNAILS[id] ?? null;
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
