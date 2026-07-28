/**
 * Export accelerator seed payloads as JSON (no Supabase client required).
 *
 * Usage:
 *   npx tsx scripts/export-accelerator-batch.ts --offset=0 --limit=25 > batch.json
 */

import { randomUUID } from "node:crypto";
import { buildSeededQuestionnaireCopy } from "../src/features/blog-builder/lib/questionnaire-seeds";
import { buildThemedQuestionnairePage } from "../src/features/blog-builder/lib/questionnaire-page-html";
import { getReadyTemplateFromConfig } from "../src/features/blog-builder/themes";
import {
  acceleratorTemplateKey,
  buildAcceleratorCatalog,
  type AcceleratorCatalogEntry,
} from "../src/features/premium-accelerator/lib/catalog";
import {
  ACCELERATOR_LINK_PLACEHOLDER,
  buildStaticAcceleratorXThreadSeedRows,
} from "../src/features/premium-accelerator/lib/x-thread-seeds";

const TEMPLATE_OWNER_ID =
  process.env.TEMPLATE_OWNER_ID?.trim() || "4d899e3a-6307-4077-96e9-21380464649c";

function parseArg(name: string, fallback: number): number {
  const prefix = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(prefix));
  if (!hit) return fallback;
  const n = Number(hit.slice(prefix.length));
  return Number.isFinite(n) ? n : fallback;
}

function newSlug(seed: string): string {
  return `${seed}-${randomUUID().slice(0, 8)}`;
}

function buildEntryPayload(entry: AcceleratorCatalogEntry) {
  const siteId = randomUUID();
  const template = getReadyTemplateFromConfig(entry.themeConfig);
  const copy = buildSeededQuestionnaireCopy({
    niche: entry.nicheLabel,
    nicheKey: entry.nicheKey,
    productName: entry.productName,
    copyToneId: template.copyToneId,
  });

  const salesPageHtml = buildThemedQuestionnairePage({
    siteId,
    niche: entry.nicheLabel,
    productName: entry.productName,
    copy,
    affiliateUrl: ACCELERATOR_LINK_PLACEHOLDER,
    themeConfig: entry.themeConfig,
  });

  const batchId = randomUUID();
  const threads = buildStaticAcceleratorXThreadSeedRows(
    entry.productName,
    entry.nicheLabel,
    entry.nicheKey
  ).map(
    (thread) => ({
      text: thread.text,
      angle: thread.angle,
      batch_id: batchId,
    })
  );

  return {
    catalogId: entry.id,
    site: {
      id: siteId,
      user_id: TEMPLATE_OWNER_ID,
      hobby: entry.nicheLabel,
      territory: entry.productName,
      title: copy.title,
      tagline: copy.subtitle.slice(0, 160),
      slug: newSlug(entry.productSlug),
      theme: entry.template.presetId,
      theme_config: entry.themeConfig,
      armed_links: [],
      status: "live",
      site_type: "product",
      is_template: true,
      template_key: acceleratorTemplateKey(entry.id),
      sales_page_html: salesPageHtml,
      sales_page_json: copy,
    },
    threads,
  };
}

const offset = parseArg("offset", 0);
const limit = parseArg("limit", 25);
const catalog = buildAcceleratorCatalog().slice(offset, offset + limit);
const payloads = catalog.map(buildEntryPayload);

process.stdout.write(JSON.stringify({ offset, limit, payloads }, null, 0));
