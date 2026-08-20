import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = join(root, "brand-assets");
const publicDir = join(root, "public");
mkdirSync(brandDir, { recursive: true });
mkdirSync(publicDir, { recursive: true });

function decodeB64(name) {
  const b64Path = join(brandDir, `${name}.b64`);
  if (!existsSync(b64Path)) throw new Error(`Missing ${b64Path}`);
  const raw = readFileSync(b64Path, "utf8").replace(/\s+/g, "");
  return Buffer.from(raw, "base64");
}

for (const name of ["logo", "logo-icon"]) {
  const png = decodeB64(name);
  writeFileSync(join(brandDir, `${name}.png`), png);
  writeFileSync(join(publicDir, `${name}.png`), png);
}

const icon = readFileSync(join(publicDir, "logo-icon.png"));
writeFileSync(join(publicDir, "favicon.png"), icon);
writeFileSync(join(publicDir, "apple-touch-icon.png"), icon);

const report = ["logo.png", "logo-icon.png", "favicon.png", "apple-touch-icon.png"].map((name) => {
  const path = join(publicDir, name);
  return `${path} ${statSync(path).size} bytes`;
});
report.push(
  ...["logo.png", "logo-icon.png"].map((name) => {
    const path = join(brandDir, name);
    return `${path} ${statSync(path).size} bytes`;
  }),
);

writeFileSync(join(root, "scripts", "logo-install-report.txt"), report.join("\n") + "\n", "utf8");
console.log(report.join("\n"));
