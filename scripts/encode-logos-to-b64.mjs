import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-gt-Desktop-blackbox",
  "assets",
);

const sources = {
  logo: join(
    assetsDir,
    "c__Users_gt_AppData_Roaming_Cursor_User_workspaceStorage_261f873debd3cd570c5c19f35e287803_images_NullPing-logo-removebg-preview-2e4be9af-e113-479b-8c6a-d27d3b144778.png",
  ),
  "logo-icon": join(
    assetsDir,
    "c__Users_gt_AppData_Roaming_Cursor_User_workspaceStorage_261f873debd3cd570c5c19f35e287803_images_Mini-logo-removebg-preview-811d9ecd-52b3-49b5-b36d-dcb62aa68c9a.png",
  ),
};

const brandDir = join(root, "brand-assets");
mkdirSync(brandDir, { recursive: true });

for (const [name, src] of Object.entries(sources)) {
  if (!existsSync(src)) throw new Error(`Missing source: ${src}`);
  const b64 = readFileSync(src).toString("base64");
  writeFileSync(join(brandDir, `${name}.b64`), b64 + "\n", "utf8");
  console.log(`${name}.b64 ${b64.length} chars from ${src}`);
}

console.log("\nRun: node scripts/decode-logos-from-b64.mjs");
