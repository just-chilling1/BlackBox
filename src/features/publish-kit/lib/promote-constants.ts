export const THREADS_PER_GENERATION = 10;

/** First N threads receive AI-generated niche images on each generation run. */
export const THREADS_WITH_IMAGES = 3;

export const THREAD_POST_ANGLES = [
  "Urgency",
  "Social proof",
  "Personal story",
  "Curiosity hook",
  "Pain point",
  "Benefit highlight",
  "Question hook",
  "Contrarian take",
  "Before and after",
  "Direct call to action",
] as const;
