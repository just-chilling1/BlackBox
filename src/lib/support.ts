import { brand } from "@/config/brand.config";
import { support } from "@/config/support.config";
import { offers } from "@/config/offers.config";

export const SUPPORT_EMAIL = support.email;
export const SUPPORT_PORTAL_URL = support.helpCenterUrl;
export const SUPPORT_MAILTO = `mailto:${support.email}`;
export const APP_SUPPORT_NAME = brand.productName;
export const FREE_TRAINING_URL = offers.exclusiveOffer3;

export function vimeoEmbedUrl(videoId: string): string {
  return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`;
}
