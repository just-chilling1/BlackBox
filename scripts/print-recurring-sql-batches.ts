import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "scripts", ".recurring-sql-batches");
const files = readdirSync(dir)
  .filter((f) => f.endsWith("-insert.sql"))
  .sort();

for (const file of files) {
  const sql = readFileSync(join(dir, file), "utf8");
  console.log(`__BATCH__${file}__START__`);
  console.log(sql);
  console.log(`__BATCH__${file}__END__`);
}
