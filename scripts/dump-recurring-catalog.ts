import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildRecurringStreamCatalog } from "../src/features/premium-recurring/lib/catalog";

const outPath = join(process.cwd(), "scripts", ".recurring-catalog.json");
const catalog = buildRecurringStreamCatalog();
writeFileSync(outPath, JSON.stringify(catalog));
console.log(`Wrote ${catalog.length} articles to ${outPath}`);
