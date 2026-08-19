#!/usr/bin/env node
/**
 * Rename BlackBox theme tokens to NullPing ( --np-* → --np-*, brass → pulse ).
 * Run: node scripts/migrate-theme-tokens.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, files);
    } else if (/\.(tsx|ts|css|mjs|md|json|example)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const dirs = ["src", "scripts"].map((d) => path.join(ROOT, d));
const extra = [
  path.join(ROOT, "middleware.ts"),
  path.join(ROOT, "DEVELOPER-SETUP.md"),
  path.join(ROOT, "README.md"),
  path.join(ROOT, "EMBED.md"),
  path.join(ROOT, ".env.local.example"),
];

const files = dirs.flatMap((d) => (fs.existsSync(d) ? walk(d) : [])).concat(extra.filter((f) => fs.existsSync(f)));

let changed = 0;
for (const file of files) {
  let text = fs.readFileSync(file, "utf8");
  const original = text;
  text = text.replace(/--np-/g, "--np-");
  text = text.replace(/grad-pulse/g, "grad-pulse");
  text = text.replace(/shadow-pulse/g, "shadow-pulse");
  text = text.replace(/line-pulse/g, "line-pulse");
  text = text.replace(/pulse-/g, "pulse-");
  text = text.replace(/text-pulse\b/g, "text-pulse");
  text = text.replace(/bg-pulse\b/g, "bg-pulse");
  text = text.replace(/border-pulse\b/g, "border-pulse");
  text = text.replace(/ring-pulse\b/g, "ring-pulse");
  text = text.replace(/from-pulse\b/g, "from-pulse");
  text = text.replace(/to-pulse\b/g, "to-pulse");
  text = text.replace(/via-pulse\b/g, "via-pulse");
  text = text.replace(/accent: "pulse"/g, 'accent: "pulse"');
  text = text.replace(/NullPing Cash/g, "NullPing Cash");
  text = text.replace(/NullPing Cash/g, "NullPing Cash");
  text = text.replace(/nullping-cash/g, "nullping-cash");
  text = text.replace(/nullping_cash/g, "nullping_cash");
  text = text.replace(/NullPingCash/g, "NullPingCash");
  if (text !== original) {
    fs.writeFileSync(file, text);
    changed++;
  }
}
console.log(`Updated ${changed} files`);
