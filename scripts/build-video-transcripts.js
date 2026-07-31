const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../training-video-system/blackbox-cash");
const map = [
  ["watch-this-first", "01-buyers-remorse.md", "Watch This First"],
  ["how-the-money-flows", "02-disconnect.md", "How The Money Flows"],
  ["five-minute-tour", "03-quick-overview.md", "Your 5-Minute Tour"],
  ["sales-offer-generator", "04-sales-offer-generator.md", "Sales Offer Generator"],
  ["x-power-promotions", "05-x-power-promotions.md", "X-Power Promotions"],
  ["links-offers-library", "06-links-offers-library.md", "Links & Offers Library"],
  ["accelerator", "07-accelerator.md", "Accelerator"],
  ["recurring-stream", "08-recurring-stream.md", "Recurring Stream"],
  ["social-payouts", "09-social-payouts.md", "Social Payouts"],
  ["protector", "10-protector.md", "Protector"],
];

function clean(raw) {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/^\[[^\]]+\]\s*/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^#+\s.*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const entries = map.map(([slug, file, title]) => {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  return { slug, title, transcript: clean(raw) };
});

const out = path.join(__dirname, "../src/config/training-videos.config.ts");
const body = entries
  .map((e) => {
    const esc = e.transcript.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
    return `  "${e.slug}": {\n    title: ${JSON.stringify(e.title)},\n    transcript: \`${esc}\`,\n  }`;
  })
  .join(",\n");

fs.writeFileSync(
  out,
  `/** Auto-derived from training-video-system/blackbox-cash scripts */\nexport const trainingVideos = {\n${body}\n} as const;\n\nexport type TrainingVideoSlug = keyof typeof trainingVideos;\n\nexport function getTrainingVideoMeta(slug: TrainingVideoSlug) {\n  return trainingVideos[slug];\n}\n`
);

console.log("Wrote", out);
