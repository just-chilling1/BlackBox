import { copyFileSync, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
mkdirSync(publicDir, { recursive: true });

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
  join(root, "brand-assets", "logo.png"),
  join(root, "brand-assets", "nullping-logo.png"),
  join(process.env.USERPROFILE || "", ".cursor", "projects", "c-Users-gt-Desktop-blackbox", "assets", wordmarkName),
]);

const iconSrc = firstExisting([
  join(root, "brand-assets", "logo-icon.png"),
  join(root, "brand-assets", "nullping-icon.png"),
  join(process.env.USERPROFILE || "", ".cursor", "projects", "c-Users-gt-Desktop-blackbox", "assets", iconName),
]);

const report: string[] = [];

if (!wordmarkSrc || !iconSrc) {
  report.push(`missing sources wordmark=${wordmarkSrc ?? "none"} icon=${iconSrc ?? "none"}`);
} else {
  copyFileSync(wordmarkSrc, join(publicDir, "logo.png"));
  copyFileSync(iconSrc, join(publicDir, "logo-icon.png"));
  report.push(`wordmark ${statSync(join(publicDir, "logo.png")).size} bytes`);
  report.push(`icon ${statSync(join(publicDir, "logo-icon.png")).size} bytes`);

  try {
    const sharp = await import("sharp");
    await sharp.default(join(publicDir, "logo-icon.png"))
      .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(join(publicDir, "favicon.png"));
    await sharp.default(join(publicDir, "logo-icon.png"))
      .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(join(publicDir, "apple-touch-icon.png"));
    report.push("favicons generated via sharp");
  } catch {
    copyFileSync(iconSrc, join(publicDir, "favicon.png"));
    copyFileSync(iconSrc, join(publicDir, "apple-touch-icon.png"));
    report.push("favicons copied from icon (sharp unavailable)");
  }
}

writeFileSync(join(publicDir, "_logo-install.txt"), `${new Date().toISOString()}\n${report.join("\n")}\n`, "utf8");
console.log(report.join("\n"));
