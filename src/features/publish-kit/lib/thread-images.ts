import type { SupabaseClient } from "@supabase/supabase-js";
import { resolvePostImage } from "@/features/blog-builder/lib/images";

const ANGLE_VISUAL_HINTS: Record<string, string> = {
  Urgency: "dynamic motion, clock or countdown mood, high energy",
  "Social proof": "diverse happy people, trust and success, community feel",
  "Personal story": "authentic candid moment, relatable everyday person",
};

/** Build a niche-aware prompt for X thread promotional images. */
export function buildThreadImagePrompt(params: {
  territory: string;
  angle: string;
  threadText: string;
}): { title: string; subject: string } {
  const angleHint = ANGLE_VISUAL_HINTS[params.angle] ?? "engaging promotional scene";
  const excerpt = params.threadText.replace(/https?:\/\/\S+/g, "").replace(/#\w+/g, "").trim().slice(0, 120);

  return {
    title: `${params.angle} — ${excerpt}`.slice(0, 120),
    subject: `${params.territory}. ${angleHint}. Photorealistic social media image, square composition, no text or logos`,
  };
}

/** Generate and persist a niche-related image for a promote thread. Returns null on failure. */
export async function generateThreadImage(params: {
  territory: string;
  angle: string;
  threadText: string;
  userId: string;
  supabase: SupabaseClient;
}): Promise<string | null> {
  const { title, subject } = buildThreadImagePrompt(params);

  try {
    const result = await resolvePostImage({
      title,
      subject,
      userId: params.userId,
      supabase: params.supabase,
      fast: false,
    });
    return result.url || null;
  } catch {
    return null;
  }
}
