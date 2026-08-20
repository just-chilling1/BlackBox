import { copyFileSync, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const brandDir = join(root, "brand-assets");
mkdirSync(publicDir, { recursive: true });
mkdirSync(brandDir, { recursive: true });

const cursorAssetsDir = join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-gt-Desktop-blackbox",
  "assets",
);

const wordmarkName =
  "c__Users_gt_AppData_Roaming_Cursor_User_workspaceStorage_261f873debd3cd570c5c19f35e287803_images_NullPing-logo-removebg-preview-2e4be9af-e113-479b-8c6a-d27d3b144778.png";
const iconName =
  "c__Users_gt_AppData_Roaming_Cursor_User_workspaceStorage_261f873debd3cd570c5c19f35e287803_images_Mini-logo-removebg-preview-811d9ecd-52b3-49b5-b36d-dcb62aa68c9a.png";

function firstExisting(candidates) {
  for (const path of candidates) {
    if (path && existsSync(path)) return path;
  }
  return null;
}

const wordmarkSrc = firstExisting([
  join(brandDir, "logo.png"),
  join(cursorAssetsDir, wordmarkName),
]);

const iconSrc = firstExisting([
  join(brandDir, "logo-icon.png"),
  join(cursorAssetsDir, iconName),
]);

const report = [];

if (!wordmarkSrc || !iconSrc) {
  report.push("skipped: PNG sources not found (using committed SVG fallbacks in public/)");
  report.push(`wordmark=${wordmarkSrc ?? "missing"}`);
  report.push(`icon=${iconSrc ?? "missing"}`);
  writeFileSync(join(root, "scripts", "copy-logos-report.txt"), report.join("\n") + "\n", "utf8");
  console.log(report.join("\n"));
  process.exit(0);
}

const targets = [
  [wordmarkSrc, join(publicDir, "logo.png")],
  [iconSrc, join(publicDir, "logo-icon.png")],
  [wordmarkSrc, join(brandDir, "logo.png")],
  [iconSrc, join(brandDir, "logo-icon.png")],
  [iconSrc, join(publicDir, "favicon.png")],
  [iconSrc, join(publicDir, "apple-touch-icon.png")],
];

for (const [src, dest] of targets) {
  copyFileSync(src, dest);
  report.push(`${dest} ${statSync(dest).size} bytes`);
}

writeFileSync(join(root, "scripts", "copy-logos-report.txt"), report.join("\n") + "\n", "utf8");
writeFileSync(join(root, "scripts", "copy-logos-done.txt"), new Date().toISOString() + "\n", "utf8");
console.log(report.join("\n"));
