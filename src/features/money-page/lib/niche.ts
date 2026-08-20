export function inferNiche(productName: string, context = ""): string {
  const text = `${productName} ${context}`.toLowerCase();
  const rules: [RegExp, string][] = [
    [/sleep|insomnia|melatonin|mattress/, "sleep"],
    [/box(ing)?|glove|mma|martial|kickbox|sparring|punch/, "boxing & combat sports"],
    [/gym|workout|weight|keto|diet|fat loss|fitness|sport/, "health & fitness"],
    [/skincare|skin|serum|wrinkle|beauty/, "beauty"],
    [/money|invest|crypto|wealth|income/, "make money"],
    [/ai |chatgpt|software|saas|app/, "software"],
    [/dog|cat|pet|puppy/, "pets"],
    [/course|training|coaching|ebook/, "education"],
  ];
  for (const [re, niche] of rules) {
    if (re.test(text)) return niche;
  }
  return "general";
}
