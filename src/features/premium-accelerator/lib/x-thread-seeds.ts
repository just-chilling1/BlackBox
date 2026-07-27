import { THREAD_POST_ANGLES } from "@/features/publish-kit/lib/promote-constants";

/** Static X threads stored on accelerator templates — [LINK] swapped at clone time. */
export function buildAcceleratorXThreadSeeds(productName: string, niche: string): string[] {
  const short = productName.slice(0, 60);
  return [
    `Just found a solid ${niche.toLowerCase()} resource that actually delivers. Worth a look if you're serious about results: [LINK]`,
    `Real talk — most ${niche.toLowerCase()} advice is recycled fluff. This ${short} approach is different. See for yourself: [LINK]`,
    `I was skeptical about another ${niche.toLowerCase()} offer… but this one surprised me. Quick breakdown here: [LINK]`,
    `If you're stuck in ${niche.toLowerCase()}, start here. Simple, practical, no hype: [LINK]`,
    `Bookmarking this for anyone exploring ${niche.toLowerCase()}. Clear steps + honest guidance: [LINK]`,
    `The ${short} method is the first thing that made ${niche.toLowerCase()} click for me. Might help you too: [LINK]`,
    `Stop scrolling — this ${niche.toLowerCase()} guide cuts through the noise. One link, real value: [LINK]`,
    `Sharing because I wish I had this ${niche.toLowerCase()} resource months ago: [LINK]`,
    `Quick thread: why this ${niche.toLowerCase()} pick stands out 👇\n\n1/ Clear path\n2/ Beginner-friendly\n3/ No fluff\n\nFull details: [LINK]`,
    `Before you buy anything in ${niche.toLowerCase()}, read this first. Saved me time and money: [LINK]`,
  ].map((text, i) => {
    const angle = THREAD_POST_ANGLES[i] ?? `Angle ${i + 1}`;
    return `${text}\n\n#${angle.replace(/\s+/g, "")}`;
  });
}

/** Placeholder used in template HTML — replaced when a member clones. */
export const ACCELERATOR_LINK_PLACEHOLDER = "[AFFILIATE_LINK]";
