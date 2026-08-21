import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const log = [];

function run(cmd) {
  log.push(`$ ${cmd}`);
  try {
    const out = execSync(cmd, { cwd: root, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
    if (out.trim()) log.push(out.trim());
    return { ok: true, out };
  } catch (err) {
    const stdout = err.stdout?.toString?.() ?? "";
    const stderr = err.stderr?.toString?.() ?? "";
    if (stdout.trim()) log.push(stdout.trim());
    if (stderr.trim()) log.push(stderr.trim());
    log.push(`exit ${err.status ?? 1}`);
    return { ok: false, err };
  }
}

run("git status -sb");
run("git add -A");
run('git reset HEAD -- .env .env.local 2>nul || git reset HEAD -- .env .env.local');
run(`git commit -m "Resolve merge conflicts and ship support, money-page, and BrandLogo fixes."`);
const push = run("git push https://github.com/just-chilling1/BlackBox.git HEAD:main");
if (!push.ok) {
  run("git push origin HEAD:main");
}
run("git log -1 --oneline");
run("git status -sb");

writeFileSync(join(root, "scripts", "git-push-result.txt"), log.join("\n") + "\n", "utf8");
