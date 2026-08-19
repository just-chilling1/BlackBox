#!/usr/bin/env node
/**
 * Bulk migrate legacy styling to NullPing Cash design system.
 * Run: node scripts/migrate-ds-styles.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "../src");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx|ts|css)$/.test(entry.name)) files.push(full);
  }
  return files;
}

/** Pass-2 replacements — run after initial migration */
const REPLACEMENTS_PASS2 = [
  [/pulse-1000/g, "pulse-100"],
  [/border-accent-muted\/20/g, "border-[var(--np-line-pulse)]"],
  [/hover:border-accent\/50/g, "hover:border-[var(--np-line-pulse)]"],
  [/hover:border-accent\/35/g, "hover:border-[var(--np-line-pulse)]"],
  [/hover:border-accent/g, "hover:border-[var(--np-line-pulse)]"],
  [/(?<![/\w])border-accent(?![/\w-/])/g, "border-[var(--np-line-pulse)]"],
  [/border-accent\/50/g, "border-[var(--np-line-pulse)]"],
  [/border-accent\/35/g, "border-[var(--np-line-pulse)]"],
  [/border-accent\/15/g, "border-[var(--np-line-pulse)]"],
  [/ring-accent\/25/g, "ring-[var(--np-line-pulse)]"],
  [/ring-accent\/15/g, "ring-pulse-100"],
  [/ring-1 ring-accent\/15/g, "ring-1 ring-pulse-100"],
  [/bg-accent\/8/g, "bg-pulse-100"],
  [/from-accent\/50/g, "from-pulse-300"],
  [/from-accent\/15/g, "from-pulse-100"],
  [/from-accent\/12/g, "from-pulse-100"],
  [/from-accent\/10/g, "from-pulse-100"],
  [/via-accent\/10/g, "via-pulse-100"],
  [/to-accent\/10/g, "to-pulse-100"],
  [/to-accent\/5/g, "to-pulse-100"],
  [/from-accent\/\[0\.06\]/g, "from-pulse-100"],
  [/from-promo-accent\/10/g, "from-pulse-100"],
  [/bg-promo-accent\/15/g, "bg-pulse-100"],
  [/(?<![/\w])bg-promo-accent(?![/\w-/])/g, "bg-grad-pulse"],
  [/border-promo-accent\/30/g, "border-[var(--np-line-pulse)]"],
  [/from-amber-50\/40/g, "from-pulse-100"],
  [/to-amber-50\/40/g, "to-pulse-100"],
  [/to-amber-50\/30/g, "to-pulse-100"],
  [/to-amber-50\/60/g, "to-pulse-100"],
  [/ring-amber-100/g, "ring-pulse-100"],
  [/border-amber-400\/40/g, "border-[var(--np-line-pulse)]"],
  [/border-amber-500\/30/g, "border-[var(--np-line-pulse)]"],
  [/border-amber-500\/50/g, "border-[var(--np-line-pulse)]"],
  [/border-amber-600\/25/g, "border-[var(--np-line-pulse)]"],
  [/focus:border-amber-500\/60/g, "focus:border-pulse-700"],
  [/focus:border-amber-500/g, "focus:border-pulse-700"],
  [/focus:ring-amber-500\/20/g, "focus:ring-pulse-100"],
  [/text-amber-400\/90/g, "text-pulse-700"],
  [/text-amber-400/g, "text-pulse-700"],
  [/hover:text-amber-950/g, "hover:text-pulse-900"],
  [/bg-slate-900\/60/g, "bg-ink/60"],
  [/bg-slate-900\/40/g, "bg-ink/40"],
  [/from-slate-900/g, "from-ink"],
  [/via-slate-800/g, "via-ink-2"],
  [/to-slate-950/g, "to-ink"],
  [/hover:bg-slate-300/g, "hover:bg-ink-6"],
  [/hover:bg-\[#e6a800\]/g, "hover:brightness-105"],
  [/to-\[#e6a800\]/g, "to-pulse-500"],
  [/shadow-\[0_0_48px_rgba\(238,179,16,0\.35\),0_8px_32px_rgba\(238,179,16,0\.15\)\]/g, "shadow-pulse"],
  [/shadow-\[0_4px_24px_rgba\(238,179,16,0\.45\)\]/g, "shadow-pulse"],
  [/shadow-\[0_0_40px_rgba\(238,179,16,0\.08\)\]/g, "shadow-pulse"],
  [/shadow-\[0_0_16px_rgba\(238,179,16,0\.35\)\]/g, "shadow-pulse"],
  [/group-hover:shadow-\[0_0_16px_rgba\(238,179,16,0\.35\)\]/g, "group-hover:shadow-pulse"],
  [/shadow-\[0_4px_16px_rgba\(0,0,0,0\.12\),0_0_24px_rgba\(238,179,16,0\.35\)\]/g, "shadow-pulse"],
  [/hover:shadow-\[0_6px_20px_rgba\(0,0,0,0\.16\),0_0_32px_rgba\(238,179,16,0\.45\)\]/g, "hover:shadow-pulse"],
  [/boxShadow: "0 0 16px rgba\(238,179,16,0\.4\)"/g, 'boxShadow: "var(--np-shadow-pulse)"'],
  [/from-slate-900 to-slate-500/g, "from-ink to-ink-4"],
  [/border-left-color: #C9970D/g, "border-left-color: var(--np-pulse-500)"],
  [/@apply bg-amber-400/g, "@apply bg-pulse-300"],
  [/background: linear-gradient\(180deg, var\(--brand-primary\) 0%, #e6a800 100%\)/g, "background: var(--np-grad-pulse)"],
  [/focus-visible:ring-promo-accent\/50 focus-visible:border-promo-accent/g, "focus-visible:ring-pulse-100 focus-visible:border-pulse-700"],
  [/hover:border-promo-accent\/30/g, "hover:border-[var(--np-line-pulse)]"],
];

/** Ordered replacements — longer / more specific patterns first */
const REPLACEMENTS = [
  // Remove animate-premium-pulse
  [/\banimate-premium-pulse\b/g, ""],

  // Gold glow shadows → shadow-pulse or remove
  [/hover:shadow-\[0_0_40px_rgba\(238,179,16,0\.3\)\]/g, "hover:shadow-pulse"],
  [/hover:shadow-\[0_0_24px_rgba\(238,179,16,0\.28\)\]/g, "hover:shadow-pulse"],
  [/hover:shadow-\[0_0_20px_rgba\(238,179,16,0\.22\)\]/g, "hover:shadow-pulse"],
  [/hover:shadow-\[0_0_16px_rgba\(238,179,16,0\.22\)\]/g, "hover:shadow-pulse"],
  [/shadow-\[0_0_12px_rgba\(238,179,16,0\.45\)\]/g, "shadow-pulse"],

  // Gradient patterns → bg-grad-pulse (remove gradient utility chains)
  [/bg-gradient-to-r from-accent to-accent-muted/g, "bg-grad-pulse"],
  [/bg-gradient-to-br from-accent to-\[#C9970D\]/g, "bg-grad-pulse"],
  [/bg-gradient-to-r from-accent to-\[#C9970D\]/g, "bg-grad-pulse"],
  [/bg-gradient-to-br from-\[#F5C518\] to-\[#C9970D\]/g, "bg-grad-pulse"],
  [/from-transparent via-accent to-\[#C9970D\]/g, "from-transparent via-pulse-300 to-pulse-500"],

  // Hex legacy gold
  [/hover:bg-\[#F5C518\]/g, "hover:brightness-105"],
  [/bg-\[#EEB310\]/g, "bg-pulse-500"],
  [/text-\[#EEB310\]/g, "text-pulse-500"],
  [/to-\[#C9970D\]/g, "to-pulse-500"],
  [/via-\[#C9970D\]/g, "via-pulse-500"],
  [/from-\[#F5C518\]/g, "from-pulse-300"],
  [/border-color:\s*#C9970D/g, "border-color: var(--np-pulse-500)"],

  // Font weights
  [/\bfont-extrabold\b/g, "font-medium"],
  [/\bfont-black\b/g, "font-medium"],
  [/\bfont-bold\b/g, "font-medium"],
  [/\bfont-semibold\b/g, "font-medium"],

  // Text sizes
  [/text-\[9px\]/g, "text-[13px]"],
  [/text-\[10px\]/g, "text-[13px]"],
  [/text-\[11px\]/g, "text-[13px]"],

  // Shadow
  [/\bshadow-gold\b/g, "shadow-pulse"],

  // Accent opacity backgrounds/borders
  [/bg-accent\/25/g, "bg-pulse-100"],
  [/bg-accent\/20/g, "bg-pulse-200"],
  [/bg-accent\/15/g, "bg-pulse-100"],
  [/bg-accent\/10/g, "bg-pulse-100"],
  [/bg-accent\/5/g, "bg-pulse-100"],
  [/border-accent\/40/g, "border-[var(--np-line-pulse)]"],
  [/border-accent\/30/g, "border-[var(--np-line-pulse)]"],
  [/border-accent\/25/g, "border-[var(--np-line-pulse)]"],
  [/border-accent\/20/g, "border-[var(--np-line-pulse)]"],
  [/hover:border-accent\/40/g, "hover:border-[var(--np-line-pulse)]"],
  [/hover:border-accent\/30/g, "hover:border-[var(--np-line-pulse)]"],
  [/active:bg-accent\/10/g, "active:bg-pulse-100"],
  [/focus:ring-accent\/15/g, "focus:ring-pulse-100"],
  [/focus:border-accent/g, "focus:border-pulse-700"],

  // Accent-muted opacity
  [/bg-accent-muted\/10/g, "bg-pulse-100"],
  [/border-accent-muted\/25/g, "border-[var(--np-line-pulse)]"],
  [/hover:border-accent-muted\/40/g, "hover:border-[var(--np-line-pulse)]"],

  // Promo accent opacity
  [/bg-promo-accent\/10/g, "bg-pulse-100"],
  [/border-promo-accent\/25/g, "border-[var(--np-line-pulse)]"],
  [/hover:border-promo-accent\/40/g, "hover:border-[var(--np-line-pulse)]"],

  // Amber
  [/text-amber-900/g, "text-pulse-700"],
  [/text-amber-800/g, "text-pulse-700"],
  [/text-amber-700/g, "text-pulse-700"],
  [/text-amber-600/g, "text-pulse-700"],
  [/text-amber-500/g, "text-pulse-700"],
  [/bg-amber-100/g, "bg-pulse-100"],
  [/bg-amber-50/g, "bg-pulse-100"],
  [/border-amber-200/g, "border-[var(--np-line-pulse)]"],
  [/border-amber-300/g, "border-[var(--np-line-pulse)]"],
  [/hover:text-amber-700/g, "hover:text-pulse-700"],
  [/hover:text-amber-800/g, "hover:text-pulse-700"],

  // Slate text
  [/text-slate-900/g, "text-ink"],
  [/text-slate-800/g, "text-ink-2"],
  [/text-slate-700/g, "text-ink-2"],
  [/text-slate-600/g, "text-ink-3"],
  [/text-slate-500/g, "text-ink-4"],
  [/text-slate-400/g, "text-ink-5"],
  [/text-slate-300/g, "text-ink-6"],

  // Slate backgrounds/borders
  [/bg-slate-200/g, "bg-pulse-100"],
  [/bg-slate-100/g, "bg-pulse-100"],
  [/bg-slate-50/g, "bg-canvas"],
  [/border-slate-300/g, "border-border-dim"],
  [/border-slate-200/g, "border-border-dim"],
  [/border-slate-100/g, "border-border-dim"],

  // Slate hovers
  [/hover:bg-slate-100/g, "hover:bg-[rgba(28,27,24,0.04)]"],
  [/hover:bg-slate-50/g, "hover:bg-[rgba(28,27,24,0.04)]"],
  [/hover:bg-slate-200/g, "hover:bg-[rgba(28,27,24,0.04)]"],

  // text-accent on light backgrounds (text usage)
  [/(\btext-accent-readable\b)/g, "text-pulse-700"], // keep readable alias mapped
  [/(?<![/\w])text-accent(?![/\w-])/g, "text-pulse-700"],

  // Solid bg-accent for buttons → bg-grad-pulse (not bg-accent/xx which was handled above)
  [/(?<![/\w])bg-accent(?![/\w-])/g, "bg-grad-pulse"],

  // text-accent-muted → text-pulse-700
  [/text-accent-muted/g, "text-pulse-700"],

  // text-promo-accent → text-pulse-700
  [/text-promo-accent/g, "text-pulse-700"],

  // UI label text-xs with uppercase/tracking
  [/text-xs font-medium uppercase/g, "text-[13px] font-medium uppercase"],
  [/text-xs font-medium tracking/g, "text-[13px] font-medium tracking"],
  [/text-xs uppercase tracking/g, "text-[13px] uppercase tracking"],
  [/text-xs font-medium/g, "text-[13px] font-medium"],

  // Indigo/fuchsia gradient bars in quick-action etc
  [/from-accent\/80 to-promo-cta\/80/g, "from-pulse-300 to-pulse-500"],
  [/from-accent\/80 to-\[#C9970D\]\/80/g, "from-pulse-300 to-pulse-500"],
  [/from-promo-accent\/80 to-\[#C9970D\]\/80/g, "from-pulse-300 to-pulse-500"],
  [/from-accent-muted\/80/g, "from-pulse-300"],
];

function migrate(content, filePath) {
  let result = content;
  for (const [pattern, replacement] of [...REPLACEMENTS, ...REPLACEMENTS_PASS2]) {
    result = result.replace(pattern, replacement);
  }
  // Collapse double spaces in class strings
  result = result.replace(/className="([^"]*)"/g, (_, cls) => {
    return `className="${cls.replace(/\s{2,}/g, " ").trim()}"`;
  });
  result = result.replace(/className=\{`([^`]*)`\}/g, (_, cls) => {
    return `className={\`${cls.replace(/\s{2,}/g, " ").trim()}\`}`;
  });
  return result;
}

const files = walk(SRC);
let changed = 0;
for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const updated = migrate(original, file);
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    changed++;
    console.log("updated:", path.relative(SRC, file));
  }
}
console.log(`\nDone. ${changed} files updated.`);
