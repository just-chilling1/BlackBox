/**
 * Force-regenerate all accelerator story threads + images.
 * Same as: npx tsx scripts/seed-accelerator.ts --force
 */
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["tsx", "scripts/seed-accelerator.ts", "--force"], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
